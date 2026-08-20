import json
import logging
import time
from typing import Optional, Dict, Any

from app.config import settings
from app.models.schemas import ScoreRequest, ScoreResponse
from app.api.routes.score import score_evidence

logger = logging.getLogger(__name__)

try:
    from kafka import KafkaConsumer, KafkaProducer
    HAS_KAFKA = True
except ImportError:
    HAS_KAFKA = False


def process_kafka_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Processes incoming evidence.submitted payload using shared score_evidence pipeline.
    Returns serialized dict ready for evidence.ai_scored topic.
    """
    try:
        score_req = ScoreRequest(
            evidence_id=payload.get("evidence_id", f"ev_kafka_{int(time.time())}"),
            skill_id=payload.get("skill_id", "python-programming"),
            file_url=payload.get("file_url"),
            content_type=payload.get("content_type"),
            raw_text=payload.get("raw_text") or payload.get("evidence_text")
        )
        response: ScoreResponse = score_evidence(score_req)
        return response.model_dump()
    except Exception as e:
        logger.error(f"Error processing Kafka evidence payload: {e}")
        return {
            "evidence_id": payload.get("evidence_id", "unknown"),
            "confidence": 0.0,
            "rubric_suggestions": [],
            "similarity_flag": False,
            "top_similarity_score": 0.0,
            "model_version": "v1.0.0-rules",
            "low_confidence_extraction": True,
            "error_reason": f"Kafka message processing error: {str(e)}"
        }


class EvidenceKafkaConsumer:
    """
    Kafka consumer daemon that consumes evidence.submitted messages,
    evaluates them via score_evidence pipeline, and publishes to evidence.ai_scored.
    """

    def __init__(self, bootstrap_servers: Optional[str] = None):
        self.bootstrap_servers = bootstrap_servers or settings.KAFKA_BOOTSTRAP_SERVERS
        self.consumer = None
        self.producer = None
        self.is_running = False

    def connect(self):
        if not HAS_KAFKA:
            logger.warning("kafka-python library not installed. Kafka consumer cannot connect.")
            return False

        try:
            self.consumer = KafkaConsumer(
                settings.KAFKA_TOPIC_SUBMITTED,
                bootstrap_servers=self.bootstrap_servers,
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='earliest',
                group_id='ai-scoring-group'
            )
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            logger.info(f"Kafka consumer successfully connected to {self.bootstrap_servers}")
            return True
        except Exception as e:
            logger.warning(f"Could not connect to Kafka broker at {self.bootstrap_servers}: {e}")
            return False

    def start_polling(self, max_messages: Optional[int] = None):
        if not self.connect():
            logger.warning("Skipping Kafka poll loop because broker is unreachable or client is missing.")
            return

        self.is_running = True
        count = 0
        logger.info(f"Starting consumer loop on topic '{settings.KAFKA_TOPIC_SUBMITTED}'...")

        try:
            for message in self.consumer:
                if not self.is_running:
                    break

                try:
                    payload = message.value
                    logger.info(f"Received message for evidence_id: {payload.get('evidence_id')}")

                    result_dict = process_kafka_payload(payload)

                    # Publish output to evidence.ai_scored topic
                    if self.producer:
                        self.producer.send(settings.KAFKA_TOPIC_SCORED, value=result_dict)
                        self.producer.flush()
                        logger.info(f"Published score result to {settings.KAFKA_TOPIC_SCORED}")

                except Exception as msg_err:
                    logger.error(f"Isolated error processing message offset {message.offset}: {msg_err}")

                count += 1
                if max_messages and count >= max_messages:
                    break
        finally:
            self.stop()

    def stop(self):
        self.is_running = False
        if self.consumer:
            self.consumer.close()
        if self.producer:
            self.producer.close()
        logger.info("Kafka consumer stopped.")


if __name__ == "__main__":
    consumer = EvidenceKafkaConsumer()
    consumer.start_polling()
