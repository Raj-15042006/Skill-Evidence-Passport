import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

try:
    import mlflow
    HAS_MLFLOW = True
except ImportError:
    HAS_MLFLOW = False


def log_experiment_run(
    experiment_name: str,
    params: Dict[str, Any],
    metrics: Dict[str, float],
    artifact_paths: Dict[str, str] = None,
    model_version: str = "v1.0.0-ml"
):
    """
    Logs model training parameters, per-class metrics, and artifacts to MLflow.
    Handles fallback cleanly if MLflow is unavailable or raises an exception.
    """
    if not HAS_MLFLOW:
        logger.warning("MLflow not installed. Logging run metrics locally.")
        logger.info(f"Params: {params}")
        logger.info(f"Metrics: {metrics}")
        return

    try:
        mlflow.set_experiment(experiment_name)
        with mlflow.start_run():
            mlflow.log_params(params)
            mlflow.log_param("model_version", model_version)
            mlflow.log_metrics(metrics)
            
            if artifact_paths:
                for name, path in artifact_paths.items():
                    mlflow.log_artifact(path)
                    
        logger.info(f"Successfully logged run to MLflow experiment '{experiment_name}'.")
    except Exception as e:
        logger.warning(f"Failed to log run to MLflow: {e}. Metrics were computed successfully.")
