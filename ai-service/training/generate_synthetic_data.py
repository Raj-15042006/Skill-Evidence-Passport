import os
import random
import csv
import re
import numpy as np

# Set fixed random seed for reproducibility
RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

SKILLS = [
    "python-programming",
    "data-analysis",
    "cloud-architecture",
    "ui-ux-design",
    "devops-ci-cd",
    "cybersecurity-defense",
    "ai-ml-engineering",
    "product-management",
    "database-engineering",
    "mobile-development"
]

LABELS = ["approved", "rejected", "needs-info"]

# High-fidelity realistic text templates with realistic domain term overlap
SAMPLE_TEMPLATES = {
    "python-programming": {
        "approved": [
            "Implemented an asynchronous REST API using FastAPI, Pydantic, and SQLAlchemy ORM. Added comprehensive unit tests using Pytest with 95% line coverage. Handled custom exceptions gracefully, implemented JWT bearer auth middleware, and integrated a PostgreSQL connection pool.",
            "Developed a Python data processing pipeline with Pandas, NumPy, and multiprocessing. Created custom classes for data schema validation and built a CLI tool using Click. Package was published as a PyPI wheel with full docstrings, type annotations, and Sphinx documentation.",
            "Built a distributed event-driven microservice in Python 3.11 using asyncio, Kafka consumers, and Redis caching. Wrote custom decorator patterns for retry logic, rate limiting, and structured JSON logging with OpenTelemetry traces."
        ],
        "rejected": [
            "I like Python. Python is good. Code works on my machine.",
            "Hello world test project submission. Nothing else to report.",
            "Random text file with no code or explanation attached.",
            "Copy pasted python script from stackoverflow without understanding how it works.",
            "Submitted an empty zip file with no repository link or documentation."
        ],
        "needs-info": [
            "Wrote a small script to scrape a website. Used requests library.",
            "Created a python function to compute fibonacci numbers.",
            "Basic python script for file renaming, missing test cases and docstrings.",
            "Submitted a single script without setup instructions or dependency file."
        ]
    },
    "data-analysis": {
        "approved": [
            "Analyzed customer churn dataset (100k rows) using Pandas, SciPy, and Seaborn. Built a logistic regression and Random Forest classifier in scikit-learn achieving 0.88 ROC-AUC score. Summary interactive dashboard created in Streamlit with SQL query integration.",
            "Performed exploratory data analysis on sales transactional data. Handled missing values via KNN imputation, normalized numerical features, and visualized distribution histograms using Matplotlib, Plotly, and SQL window aggregations.",
            "Engineered time-series forecasting pipeline using Statsmodels and Prophet. Conducted hypothesis testing (A/B test z-test, ANOVA) and published an executive report with actionable insights for product retention."
        ],
        "rejected": [
            "Data analysis project. Excel file submitted with one column.",
            "Chart looks nice.",
            "Sample text without methodology or data findings.",
            "Submitted a blank CSV file.",
            "Copied numbers from Wikipedia without analysis."
        ],
        "needs-info": [
            "Cleaned CSV file and removed empty rows using Python.",
            "Calculated average revenue per user for Q3 using Excel formulas.",
            "Created a basic bar chart of monthly active users but missing statistical methodology.",
            "Exported raw dataset without insights or summary conclusion."
        ]
    },
    "cloud-architecture": {
        "approved": [
            "Architected a multi-region AWS cloud infrastructure using Terraform HCL. Configured VPC peering, ALB load balancers, ECS Fargate cluster with auto-scaling, and IAM least-privilege policies. Documented topology with architecture diagrams.",
            "Deployed Kubernetes cluster on Azure AKS. Configured ingress controllers, SSL cert-manager, Helm chart deployments, RBAC policy binding, and Prometheus/Grafana operational metric dashboards.",
            "Designed serverless backend on GCP using Cloud Run, Cloud Pub/Sub, and Firestore. Implemented Terraform state locking with Cloud Storage and zero-downtime blue/green deployment strategy."
        ],
        "rejected": [
            "AWS login screenshot attached.",
            "Cloud server is running.",
            "Did some cloud stuff last week.",
            "Clicked buttons in AWS console without documentation or infrastructure as code.",
            "Unconfigured server with open 0.0.0.0/0 security group."
        ],
        "needs-info": [
            "Created an S3 bucket and uploaded a static HTML file.",
            "Spun up an EC2 t2.micro instance manually.",
            "Basic docker-compose file for local deployment, missing cloud configuration.",
            "Submitted cloud diagram draft without live deployment proof."
        ]
    },
    "ui-ux-design": {
        "approved": [
            "Designed end-to-end mobile application in Figma following WCAG 2.1 AAA accessibility guidelines. Conducted usability testing sessions with 12 participants and iterated interactive wireframes based on heatmaps. Created atomic design system with full component library.",
            "Created responsive web interface prototype for SaaS product. Built design tokens, typography scale, responsive grid layouts, and interactive micro-animations. Documented user journey maps, empathy maps, and user persona research.",
            "Redesigned checkout flow to minimize user friction. Measured a 24% reduction in drop-off rate during user testing. Produced high-fidelity Figma prototypes with auto-layout and interactive variants."
        ],
        "rejected": [
            "Rough napkin drawing of a website.",
            "I designed a logo in Paint.",
            "Screenshots of another app downloaded from Pinterest.",
            "Single low-res image without UX wireframes or interaction specs.",
            "Plagiarized Behance UI kit."
        ],
        "needs-info": [
            "Made a simple wireframe for a login screen.",
            "Drafted color palette options in Figma.",
            "Figma link provided but user permissions set to private view.",
            "Static UI mockups without interactive prototype transitions."
        ]
    },
    "devops-ci-cd": {
        "approved": [
            "Built automated CI/CD pipeline using GitHub Actions. Pipeline executes linting, unit tests, Docker container build, security vulnerability scanning with Trivy, container signing with Cosign, and automated deployment to AWS EKS cluster.",
            "Configured Jenkins pipeline for multi-stage microservice release. Implemented blue-green deployment strategy, automated rollback on canary health failure, and Slack/Teams webhook build alerts.",
            "Engineered automated GitOps pipeline using ArgoCD and Kubernetes Helm charts. Integrated Vault for secrets management and SonarQube for static code analysis in the pull request pipeline."
        ],
        "rejected": [
            "Ran docker build command once on localhost.",
            "Build failed but code runs on my machine.",
            "CI CD readme note with no actual pipeline file.",
            "Shell script with broken syntax.",
            "Hardcoded passwords stored in public repository."
        ],
        "needs-info": [
            "Wrote a simple Dockerfile for a Node app.",
            "Created a basic GitHub workflow file for running npm test.",
            "Set up bash script for deployment without secret protection.",
            "Pipeline exists but lacks security scanning and deployment automation."
        ]
    },
    "cybersecurity-defense": {
        "approved": [
            "Conducted penetration testing and security vulnerability assessment on web application. Identified OWASP Top 10 vulnerabilities (SQLi, XSS, SSRF), configured WAF rules, and implemented zero-trust RBAC authorization policies.",
            "Deployed SIEM log monitoring pipeline using Elastic Security and Snort IDS. Created automated threat detection rules for brute-force attacks and privilege escalation attempts. Conducted SOC 2 compliance audit."
        ],
        "rejected": [
            "Ran ping command in terminal.",
            "Downloaded Wireshark but did not capture packets.",
            "Security note with no threat remediation."
        ],
        "needs-info": [
            "Ran Nmap scan on local subnet.",
            "Drafted basic password policy guideline without technical enforcement."
        ]
    },
    "ai-ml-engineering": {
        "approved": [
            "Engineered Retrieval-Augmented Generation (RAG) vector search pipeline using LangChain, OpenAI embeddings, and PGVector. Achieved sub-200ms semantic retrieval across 50,000 PDF documents with 92% answer precision.",
            "Fine-tuned Llama 3 8B model using QLoRA on custom domain dataset. Quantized model weights to GGUF format and deployed local inference microservice with FastAPI and vLLM."
        ],
        "rejected": [
            "Used ChatGPT once to write an essay.",
            "Called API endpoint without handling errors or embeddings.",
            "Sample AI text."
        ],
        "needs-info": [
            "Created simple vector embedding script with ChromaDB.",
            "Wrote basic prompt engineering template."
        ]
    },
    "product-management": {
        "approved": [
            "Authored comprehensive Product Requirement Document (PRD) for SaaS analytics tool. Mapped user stories, defined success metrics (ARR, Churn, NPS), conducted 15 user interviews, and prioritized backlog using RICE framework.",
            "Managed 6-sprint Agile release cycle in Jira. Defined sprint velocity KPIs, tracked burndown charts, and facilitated daily standups and retrospectives achieving 98% sprint commitment completion."
        ],
        "rejected": [
            "Idea notebook with two bullet points.",
            "Thought of a cool app idea.",
            "Product note without specs."
        ],
        "needs-info": [
            "Drafted basic feature list without user story mapping.",
            "Created simple Trello board."
        ]
    },
    "database-engineering": {
        "approved": [
            "Designed normalized PostgreSQL relational schema (3NF) for e-commerce backend. Built composite B-Tree and GIN indexing strategies, optimized slow queries using EXPLAIN ANALYZE reducing latency by 78%, and configured Redis caching.",
            "Constructed zero-downtime database migration strategy with Flyway. Implemented database connection pooling with PgBouncer and configured multi-AZ streaming replication with automated failover."
        ],
        "rejected": [
            "Created single table in SQLite with 3 rows.",
            "SQL query with syntax error.",
            "Database text."
        ],
        "needs-info": [
            "Wrote SELECT query with JOIN statements.",
            "Created basic ER diagram draft."
        ]
    },
    "mobile-development": {
        "approved": [
            "Developed cross-platform mobile application using Flutter and Dart with BLoC state management. Integrated offline-first SQLite database synchronization, push notifications, and automated CI/CD build distribution via Fastlane.",
            "Built native React Native iOS/Android app with TypeScript. Configured navigation routing, camera and geolocation device APIs, and automated TestFlight / Google Play Beta deployments."
        ],
        "rejected": [
            "Flutter template app run on simulator screenshot.",
            "Mobile app crashed on launch.",
            "App icon image."
        ],
        "needs-info": [
            "Created basic 2-screen React Native demo app.",
            "Built Flutter UI prototype without backend API integration."
        ]
    }
}

TECHNICAL_MODIFIERS = [
    " Project repo available at https://github.com/student/capstone-repo.",
    " Benchmarked performance achieving 99.9% uptime under simulated load test.",
    " Includes comprehensive README, architecture diagrams, and postman API collection.",
    " Validated against industry standard security guidelines.",
    " Added unit tests with >90% code coverage."
]


def inject_realistic_noise(text: str, noise_level: float = 0.08) -> str:
    """Injects realistic text noise, minor typos, and formatting variations to simulate real student writing."""
    if random.random() > noise_level:
        return text

    typo_map = {
        "python": "pythn",
        "implemented": "developped",
        "configured": "configred",
        "fastapi": "fast api",
        "docker": "dokker",
        "pipeline": "pipline",
        "analysis": "analisis"
    }

    words = text.split()
    noisy_words = []
    for w in words:
        w_lower = w.lower()
        if w_lower in typo_map and random.random() < 0.3:
            noisy_words.append(typo_map[w_lower])
        else:
            noisy_words.append(w)
    return " ".join(noisy_words)


def generate_synthetic_dataset(num_samples: int = 1500) -> str:
    output_dir = os.path.join(os.path.dirname(__file__))
    os.makedirs(output_dir, exist_ok=True)
    csv_path = os.path.join(output_dir, "synthetic_data.csv")

    rows = []
    for i in range(num_samples):
        evidence_id = f"ev_synth_{i+1000:04d}"
        skill_id = random.choice(SKILLS)
        
        # Realistic class distribution: 40% approved, 35% rejected, 25% needs-info
        label = random.choices(LABELS, weights=[0.40, 0.35, 0.25])[0]

        # 7% Boundary / Edge Overlap cases (prevent trivial memorization)
        is_boundary_case = random.random() < 0.07

        if is_boundary_case:
            if label == "approved":
                # Short submission but contains a valid repo URL & key verb
                base_text = f"Built {skill_id} prototype microservice. See repository at https://github.com/student/app-v1."
            elif label == "rejected":
                # Long submission with 120 words of verbose filler text containing keywords
                base_text = f"This is a comprehensive report on {skill_id}. I studied how {skill_id} works by reading online articles and documentation. I understand concepts like deployment, data, python, and cloud architecture, but did not write code."
            else:
                base_text = f"Initial setup completed for {skill_id}. Partial documentation attached."
        else:
            templates = SAMPLE_TEMPLATES[skill_id][label]
            base_text = random.choice(templates)
            if label == "approved" and random.random() > 0.4:
                base_text += random.choice(TECHNICAL_MODIFIERS)

        # Inject text noise
        final_text = inject_realistic_noise(base_text, noise_level=0.10)
        
        words = final_text.split()
        word_count = len(words)
        char_count = len(final_text)
        
        if label == "approved":
            evidence_type = random.choice(["code_repository", "project_report", "certificate"])
        elif label == "needs-info":
            evidence_type = random.choice(["project_report", "transcript", "code_snippet"])
        else:
            evidence_type = random.choice(["document", "text_note", "code_snippet"])

        rows.append({
            "evidence_id": evidence_id,
            "skill_id": skill_id,
            "evidence_text": final_text,
            "evidence_type": evidence_type,
            "word_count": word_count,
            "char_count": char_count,
            "quality_label": label
        })

    fieldnames = ["evidence_id", "skill_id", "evidence_text", "evidence_type", "word_count", "char_count", "quality_label"]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {len(rows)} noisy, regularized synthetic samples at {csv_path}")

    # Write data dictionary
    dict_path = os.path.join(output_dir, "data_dictionary.md")
    dict_content = """# Data Dictionary — Synthetic Training Dataset (Regularized v2.1)

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
"""
    with open(dict_path, "w", encoding="utf-8") as f:
        f.write(dict_content)

    return csv_path


if __name__ == "__main__":
    generate_synthetic_dataset()
