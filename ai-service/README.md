# AI/ML Advisory Microservice — Skill Evidence Passport

An advisory AI/ML microservice built with **FastAPI**, **scikit-learn**, **Sentence-Transformers**, **spaCy**, **pypdf/python-docx/pytesseract**, **MLflow**, and **Kafka**.

> [!IMPORTANT]
> **Advisory-Only Mandate**: This microservice strictly produces advisory recommendations (`confidence`, `rubric_suggestions`, `similarity_flag`, `model_version`). It NEVER approves or rejects student evidence. Final verification authority resides exclusively with human verifiers.

---

## Deliverable Directory Structure

```
ai-service/
├── app/
│   ├── main.py                   # FastAPI main application & /health endpoint
│   ├── api/routes/score.py        # HTTP POST /score route & core pipeline orchestrator
│   ├── pipeline/
│   │   ├── extract.py            # PDF, DOCX, Image OCR, and text extraction
│   │   ├── embeddings.py         # Sentence-Transformers CPU embedding generator
│   │   ├── similarity.py         # Per-skill scoped exemplar cosine similarity check
│   │   └── rubric_model.py       # Dual-layer rubric model (Rules-based + ML Model)
│   ├── models/schemas.py         # Pydantic data contracts (ScoreRequest, ScoreResponse)
│   ├── consumers/kafka_consumer.py # Kafka consumer for evidence.submitted -> evidence.ai_scored
│   └── config.py                 # Environment-variable driven settings
├── training/
│   ├── generate_synthetic_data.py # Synthetic data generator (seed=42, 5 skill categories)
│   ├── train_rubric_model.py     # GradientBoosting model trainer (80/20 split)
│   ├── data_dictionary.md        # Data dictionary & provenance documentation
│   └── mlflow_tracking.py        # MLflow experiment tracking wrapper
├── tests/
│   ├── fixtures/                 # Fixed sample test fixtures (pdf, docx, png, txt)
│   ├── test_extract.py           # Unit tests for text extraction
│   ├── test_embeddings.py        # Unit tests for embeddings & model caching
│   ├── test_similarity.py        # Unit tests for similarity calculation & skill scoping
│   ├── test_rubric_model.py      # Unit tests for rubric fallback and ML layer swapping
│   ├── test_api_contract.py      # API contract & schema compliance tests
│   └── test_golden_dataset.py    # Golden-dataset regression test suite
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## Pipeline Architecture & Design Choices

### Stage 1: Extraction Pipeline (`app/pipeline/extract.py`)
Extracts text from multi-format student submissions:
- **PDF**: Processed via `pypdf.PdfReader`.
- **DOCX**: Processed via `python-docx.Document`.
- **Scanned Images**: Processed via `pytesseract` OCR + `Pillow`. Inspects OCR word confidence scores; flags `low_confidence_extraction = True` if average confidence falls below 50% or if OCR degrades.
- **Plain Text**: Passed through with whitespace normalization.

### Stage 2: Embeddings (`app/pipeline/embeddings.py`)
- **Model Choice**: `all-MiniLM-L6-v2` via `sentence-transformers`.
- **Rationale**: 384-dimensional dense vectors, lightweight (~80MB footprint), highly optimized for CPU inference speed (~15ms per document), excellent semantic capture for English technical text.
- **Caching**: Loaded once at module level as a singleton to avoid reloading per request. Includes a fallback generator for offline or resource-constrained environments.

### Stage 3: Per-Skill Similarity Check (`app/pipeline/similarity.py`)
Compares submission embedding against prior approved exemplars for the **same `skill_id`** using cosine similarity.
- **Optimization**: Comparison is strictly partitioned per skill to avoid full-corpus scanning as data volume grows.
- **Output**: Returns `similarity_flag = True` if maximum similarity $\ge 0.85$.

### Stage 4: Dual-Layer Rubric Model (`app/pipeline/rubric_model.py`)
Constructed in two interchangeable layers implementing `BaseRubricModel`:
1. **Rules-Based Fallback (`RulesBasedRubricModel`)**:
   - Keyword overlap matching against skill taxonomies + text length heuristics.
   - Zero model file dependency — works out-of-the-box instantly.
   - Output confidence: low-to-medium (0.40 – 0.60).
2. **Trained ML Model (`MLRubricModel`)**:
   - `GradientBoostingClassifier` trained on synthetic evidence dataset.
   - Evaluates word count, character count, domain keyword density, and exemplar similarity.
   - Output confidence: high (0.65 – 0.95).
3. **Dynamic Swap**: `get_rubric_model()` checks if `MODEL_PATH` exists on disk. If present, it loads `MLRubricModel`; otherwise, it falls back seamlessly to `RulesBasedRubricModel`.

---

## Local Setup & Quick Start

### 1. Prerequisites
- Python 3.11+
- Tesseract OCR (`apt-get install tesseract-ocr` or Windows Tesseract binary)

### 2. Installation
```bash
# Navigate to microservice directory
cd ai-service

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Service Locally
```bash
# Start FastAPI application with Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Verify status:
- Health check: `curl http://localhost:8000/health` (Returns HTTP 200 `{"status": "ok"}`)
- Swagger docs: `http://localhost:8000/docs`

---

## Model Training & MLflow Tracking

### Generate Synthetic Training Data
```bash
python training/generate_synthetic_data.py
```
Generates `training/synthetic_data.csv` (600 samples across 5 skills, seed=42) and `training/data_dictionary.md`.

### Train Rubric Model & Log to MLflow
```bash
python training/train_rubric_model.py
```
- Performs 80/20 train/test split.
- Trains `GradientBoostingClassifier`.
- Exports trained model artifact to `app/models/rubric_model.joblib`.
- Logs parameters, F1, precision, and recall per class to MLflow.

---

## Running Test Suite

Run all unit, contract, and regression tests with Pytest:

```bash
# Execute entire test suite
pytest -v

# Execute specific test modules
pytest tests/test_extract.py
pytest tests/test_embeddings.py
pytest tests/test_similarity.py
pytest tests/test_rubric_model.py
pytest tests/test_api_contract.py
pytest tests/test_golden_dataset.py
```

---

## Running via Docker

```bash
# Build Docker image
docker build -t ai-service:latest .

# Run Docker container
docker run -p 8000:8000 ai-service:latest
```

---

## Model Card

### Intended Use
- **Primary Purpose**: Advisory assistant for human verifiers evaluating student skill evidence.
- **Out-of-Scope**: Automated decision making, auto-approvals, or auto-rejections.

### Model Details
- **Architecture**: `GradientBoostingClassifier` combined with Sentence-Transformer embeddings (`all-MiniLM-L6-v2`).
- **Features**: Word count, character count, domain keyword density, exemplar similarity score.

### Training Data Provenance
- **Dataset**: `training/synthetic_data.csv`.
- **Provenance**: Synthetic evidence generated specifically for capstone evaluation (seed=42). Zero real student data or PII used.

### Known Limitations
- OCR quality depends on input image resolution and Tesseract binaries.
- English-language domain taxonomies only. Non-English submissions will trigger low-confidence extraction flags.

### Subgroup Considerations & Ethics
- Designed strictly to assist human judgment, preventing automated bias or unreviewed rejections.
