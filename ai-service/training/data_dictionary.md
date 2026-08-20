# Data Dictionary — Synthetic Training Dataset (Regularized v2.1)

> **Provenance Statement**: Synthetic dataset generated with realistic text noise, boundary overlap cases (7%), and typo injection to prevent model overtraining/memorization. Random seed = `42`.

---

## Dataset Schema (`training/synthetic_data.csv`)

| Field Name | Data Type | Provenance / Description | Example Value |
| :--- | :--- | :--- | :--- |
| `evidence_id` | String | Unique identifier (`ev_synth_XXXX`). | `ev_synth_1001` |
| `skill_id` | String | Target skill taxonomy category (5 distinct categories). | `python-programming` |
| `evidence_text` | String | Student project submission writeup text with noise injection. | `Implemented REST API using FastAPI...` |
| `evidence_type` | String | Categorical submission format (`code_repository`, `project_report`, `certificate`, `transcript`, `code_snippet`). | `code_repository` |
| `word_count` | Integer | Total word count. | `34` |
| `char_count` | Integer | Total character count. | `210` |
| `quality_label` | String | Ground-truth quality rating: `approved`, `rejected`, or `needs-info`. | `approved` |
