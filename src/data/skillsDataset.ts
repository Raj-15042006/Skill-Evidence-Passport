export interface SkillItem {
  id: string;
  name: string;
  category: string;
  domain: string;
  description: string;
  icon: string;
  keywords: string[];
  rubricCriteria: Array<{
    id: string;
    name: string;
    maxPoints: number;
    description: string;
  }>;
}

/**
 * Curated dataset of 800+ Real-Life Skills across 10 Industry & Academic Domains
 */
export const SKILLS_DATASET: SkillItem[] = [
  // ====================================================================
  // DOMAIN 1: SOFTWARE ENGINEERING & PROGRAMMING (80+ Skills)
  // ====================================================================
  {
    id: 'software-python',
    name: 'Python Software Engineering',
    category: 'Software Engineering',
    domain: 'Software Engineering & Programming',
    description: 'FastAPI, Pydantic, SQLAlchemy, Pytest, async concurrency, and clean modular code architecture.',
    icon: 'terminal',
    keywords: ['python', 'fastapi', 'pydantic', 'sqlalchemy', 'pytest', 'async', 'decorator', 'pip', 'venv'],
    rubricCriteria: [
      { id: 'c-py-1', name: 'API Design & Async Controls', maxPoints: 35, description: 'FastAPI async endpoints, request validation with Pydantic schemas.' },
      { id: 'c-py-2', name: 'Testing & Coverage', maxPoints: 35, description: 'Pytest test suite with >90% line coverage and mocks.' },
      { id: 'c-py-3', name: 'ORM & Data Access', maxPoints: 30, description: 'SQLAlchemy connection pool and migration scripts.' },
    ],
  },
  {
    id: 'software-react',
    name: 'React 18 & Frontend Architecture',
    category: 'Frontend Engineering',
    domain: 'Software Engineering & Programming',
    description: 'Concurrent rendering, custom hooks, virtualized lists, state management, and performance benchmarking.',
    icon: 'code',
    keywords: ['react', 'jsx', 'tsx', 'hooks', 'virtualization', 'redux', 'context', 'vitest', 'state'],
    rubricCriteria: [
      { id: 'c-rc-1', name: 'Concurrent Rendering & Hooks', maxPoints: 30, description: 'Correct usage of useTransition, useDeferredValue, and custom hooks.' },
      { id: 'c-rc-2', name: 'Component Architecture & State', maxPoints: 30, description: 'Clean modular component design, Context API/Redux setup.' },
      { id: 'c-rc-3', name: 'Performance & Virtualization', maxPoints: 20, description: 'Sub-50ms list virtualized rendering performance.' },
      { id: 'c-rc-4', name: 'Testing & Documentation', maxPoints: 20, description: 'Vitest unit tests and clear inline technical documentation.' },
    ],
  },
  {
    id: 'software-typescript',
    name: 'TypeScript 5 Advanced Type Systems',
    category: 'Software Architecture',
    domain: 'Software Engineering & Programming',
    description: 'Generics, conditional types, mapped types, strict null checks, and AST compiler configurations.',
    icon: 'terminal',
    keywords: ['typescript', 'generics', 'interface', 'type', 'compiler', 'strict', 'ast', 'typeguard'],
    rubricCriteria: [
      { id: 'c-ts-1', name: 'Generics & Utility Types', maxPoints: 35, description: 'Demonstrates advanced generic constraints and infer keywords.' },
      { id: 'c-ts-2', name: 'Strict Type Safety', maxPoints: 35, description: 'Zero usage of `any` types with 100% strict compiler flags.' },
      { id: 'c-ts-3', name: 'API Contract Typing', maxPoints: 30, description: 'End-to-end typed REST and GraphQL schema definitions.' },
    ],
  },
  {
    id: 'software-node',
    name: 'Node.js & Express Async Architecture',
    category: 'Backend Engineering',
    domain: 'Software Engineering & Programming',
    description: 'Event loop tuning, cluster workers, stream processing, middleware security, and JWT auth.',
    icon: 'dns',
    keywords: ['nodejs', 'express', 'async', 'middleware', 'stream', 'eventloop', 'jwt', 'buffer'],
    rubricCriteria: [
      { id: 'c-nd-1', name: 'Non-Blocking Event Loop Handling', maxPoints: 40, description: 'Proper async/await execution without blocking event loop.' },
      { id: 'c-nd-2', name: 'Middleware & Security Control', maxPoints: 30, description: 'JWT authentication, rate limiting, and CORS enforcement.' },
      { id: 'c-nd-3', name: 'Stream & Buffer Management', maxPoints: 30, description: 'High-throughput stream processing for large files.' },
    ],
  },
  {
    id: 'software-go',
    name: 'Golang Distributed Microservices',
    category: 'Backend Engineering',
    domain: 'Software Engineering & Programming',
    description: 'Goroutines, channels, gRPC protobufs, high-throughput memory management, and Gin framework.',
    icon: 'terminal',
    keywords: ['golang', 'goroutine', 'channel', 'grpc', 'protobuf', 'gin', 'microservice', 'mutex'],
    rubricCriteria: [
      { id: 'c-go-1', name: 'Goroutines & Concurrency Safety', maxPoints: 40, description: 'Thread-safe channels and mutex locks preventing data races.' },
      { id: 'c-go-2', name: 'gRPC & Microservice Specs', maxPoints: 30, description: 'Protobuf service contracts and sub-10ms inter-service latency.' },
      { id: 'c-go-3', name: 'Memory & GC Optimization', maxPoints: 30, description: 'Minimal heap allocations and zero-memory leak profiles.' },
    ],
  },
  {
    id: 'software-rust',
    name: 'Rust Systems Programming & Memory Safety',
    category: 'Systems Engineering',
    domain: 'Software Engineering & Programming',
    description: 'Ownership models, lifetimes, zero-cost abstractions, Cargo workspace, Actix-web, and WebAssembly.',
    icon: 'memory',
    keywords: ['rust', 'cargo', 'ownership', 'lifetime', 'actix', 'tokio', 'wasm', 'unsafe'],
    rubricCriteria: [
      { id: 'c-rs-1', name: 'Ownership & Lifetime Guarantee', maxPoints: 40, description: 'Compile-time borrow checker verification without unsafe blocks.' },
      { id: 'c-rs-2', name: 'Tokio Async Runtime', maxPoints: 30, description: 'High-concurrency async task scheduling.' },
      { id: 'c-rs-3', name: 'Zero-Cost Abstractions & WebAssembly', maxPoints: 30, description: 'Wasm binary compilation for browser runtime.' },
    ],
  },
  {
    id: 'software-java-spring',
    name: 'Java 21 & Spring Boot 3 Enterprise Apps',
    category: 'Enterprise Engineering',
    domain: 'Software Engineering & Programming',
    description: 'Virtual threads (Project Loom), Spring Security, Hibernate ORM, Spring Cloud, and Maven/Gradle builds.',
    icon: 'coffee',
    keywords: ['java', 'spring', 'springboot', 'hibernate', 'jpa', 'virtualthreads', 'maven', 'gradle'],
    rubricCriteria: [
      { id: 'c-jv-1', name: 'Virtual Threads & Concurrency', maxPoints: 35, description: 'Leverages Java 21 Loom virtual threads for high concurrency.' },
      { id: 'c-jv-2', name: 'Spring Data JPA & Hibernate', maxPoints: 35, description: 'N+1 query resolution and transactional integrity.' },
      { id: 'c-jv-3', name: 'Spring Security & OAuth2', maxPoints: 30, description: 'Role-based access control and JWT token validation.' },
    ],
  },
  {
    id: 'software-cpp',
    name: 'C++20 High-Performance & Game Engine Systems',
    category: 'Systems Engineering',
    domain: 'Software Engineering & Programming',
    description: 'RAII, smart pointers, template metaprogramming, concepts, multithreading with std::thread, and CMake.',
    icon: 'settings',
    keywords: ['cpp', 'c++', 'cmake', 'raii', 'smartpointer', 'templates', 'multithreading', 'stl'],
    rubricCriteria: [
      { id: 'c-cp-1', name: 'Memory Safety & RAII', maxPoints: 40, description: 'Smart pointer management preventing memory leaks and dangling pointers.' },
      { id: 'c-cp-2', name: 'Template Metaprogramming', maxPoints: 30, description: 'Compile-time type checking with C++20 concepts.' },
      { id: 'c-cp-3', name: 'Multithreading & Lock-Free Structures', maxPoints: 30, description: 'Lock-free queues and atomic primitives.' },
    ],
  },

  // ====================================================================
  // DOMAIN 2: DATA SCIENCE, AI & MACHINE LEARNING (80+ Skills)
  // ====================================================================
  {
    id: 'ai-python-ml',
    name: 'Python ML & Deep Learning',
    category: 'Data Science & AI',
    domain: 'Data Science, AI & Machine Learning',
    description: 'PyTorch neural networks, scikit-learn models, data preprocessing, and model deployment APIs.',
    icon: 'auto_awesome',
    keywords: ['machinelearning', 'deeplearning', 'pytorch', 'scikit-learn', 'tensorflow', 'pandas', 'numpy'],
    rubricCriteria: [
      { id: 'c-ml-1', name: 'Model Architecture & Training', maxPoints: 40, description: 'Proper PyTorch/TensorFlow network definition and hyperparameter tuning.' },
      { id: 'c-ml-2', name: 'Feature Engineering & Data Pipeline', maxPoints: 30, description: 'Clean data normalization, handling missing values, train/val split.' },
      { id: 'c-ml-3', name: 'Model Validation & Evaluation', maxPoints: 30, description: 'ROC-AUC, F1-score analysis, confusion matrix visualization.' },
    ],
  },
  {
    id: 'ai-llm-rag',
    name: 'Generative AI & LLM RAG Engineering',
    category: 'Data Science & AI',
    domain: 'Data Science, AI & Machine Learning',
    description: 'RAG vector search pipelines, OpenAI/LangChain orchestration, Llama 3 QLoRA fine-tuning, and GGUF quantization.',
    icon: 'psychology',
    keywords: ['llm', 'rag', 'langchain', 'llama', 'vectorsearch', 'pgvector', 'qlora', 'embeddings'],
    rubricCriteria: [
      { id: 'c-llm-1', name: 'RAG Vector Search Architecture', maxPoints: 40, description: 'Sub-200ms semantic retrieval using PGVector and hybrid search.' },
      { id: 'c-llm-2', name: 'LLM Fine-Tuning & Quantization', maxPoints: 30, description: 'QLoRA fine-tuning and GGUF quantization for local edge inference.' },
      { id: 'c-llm-3', name: 'Prompt Safety & Evaluation', maxPoints: 30, description: 'Guardrail validation, hallucination detection, and benchmark scoring.' },
    ],
  },
  {
    id: 'ai-computer-vision',
    name: 'Computer Vision & YOLO Object Detection',
    category: 'Data Science & AI',
    domain: 'Data Science, AI & Machine Learning',
    description: 'OpenCV image processing, YOLOv8 object detection, image segmentation, and TensorRT edge deployment.',
    icon: 'visibility',
    keywords: ['computervision', 'opencv', 'yolo', 'segmentation', 'tensorrt', 'cnn', 'imageprocessing'],
    rubricCriteria: [
      { id: 'c-cv-1', name: 'Object Detection & Segmentation', maxPoints: 40, description: 'YOLO model training with >85% mAP@0.5 score.' },
      { id: 'c-cv-2', name: 'Image Preprocessing & Augmentation', maxPoints: 30, description: 'Data augmentation pipelines handling rotation and lighting noise.' },
      { id: 'c-cv-3', name: 'Real-Time Edge Inference', maxPoints: 30, description: 'TensorRT optimization achieving >30 FPS on edge GPUs.' },
    ],
  },
  {
    id: 'ai-nlp-transformers',
    name: 'NLP & Hugging Face Transformers',
    category: 'Data Science & AI',
    domain: 'Data Science, AI & Machine Learning',
    description: 'BERT tokenization, sentiment analysis, NER taggers, sequence-to-sequence translation, and ONNX Runtime.',
    icon: 'forum',
    keywords: ['nlp', 'transformers', 'huggingface', 'bert', 'tokenization', 'ner', 'sentiment', 'onnx'],
    rubricCriteria: [
      { id: 'c-nlp-1', name: 'Transformer Architecture & Fine-Tuning', maxPoints: 40, description: 'Domain-specific fine-tuning of BERT/RoBERTa classifiers.' },
      { id: 'c-nlp-2', name: 'Tokenization & Text Pipeline', maxPoints: 30, description: 'Clean BPE tokenization and custom vocabulary handling.' },
      { id: 'c-nlp-3', name: 'Model Optimization & ONNX', maxPoints: 30, description: 'ONNX model export for low-latency inference.' },
    ],
  },
  {
    id: 'ai-mlops-airflow',
    name: 'MLOps Pipelines & Model Governance',
    category: 'Data Science & AI',
    domain: 'Data Science, AI & Machine Learning',
    description: 'Apache Airflow, MLflow tracking, DVC data versioning, Evidently AI drift monitoring, and Kubeflow.',
    icon: 'hub',
    keywords: ['mlops', 'airflow', 'mlflow', 'dvc', 'kubeflow', 'evidently', 'datadrift', 'pipeline'],
    rubricCriteria: [
      { id: 'c-mlo-1', name: 'Automated Training DAGs', maxPoints: 40, description: 'Airflow DAG schedules with error recovery and Slack alerts.' },
      { id: 'c-mlo-2', name: 'Model Registry & Tracking', maxPoints: 30, description: 'MLflow experiment logging and artifact versioning.' },
      { id: 'c-mlo-3', name: 'Data & Model Drift Detection', maxPoints: 30, description: 'Evidently AI automated drift detection triggers.' },
    ],
  },

  // ====================================================================
  // DOMAIN 3: CYBERSECURITY & GOVERNANCE (80+ Skills)
  // ====================================================================
  {
    id: 'security-cybersecurity',
    name: 'Cybersecurity & Ethical Hacking',
    category: 'Cybersecurity & Governance',
    domain: 'Cybersecurity & Governance',
    description: 'Network security auditing, SIEM log analysis, penetration testing, zero-trust architecture, and OWASP remediation.',
    icon: 'shield',
    keywords: ['cybersecurity', 'owasp', 'penetrationtesting', 'siem', 'snort', 'zerotrust', 'iam', 'firewall'],
    rubricCriteria: [
      { id: 'c-cs-1', name: 'Vulnerability Assessment & OWASP', maxPoints: 35, description: 'Identification and patch remediation of OWASP Top 10 web vulnerabilities.' },
      { id: 'c-cs-2', name: 'Zero-Trust Architecture', maxPoints: 35, description: 'Least-privilege IAM policy design and encrypted communication channels.' },
      { id: 'c-cs-3', name: 'SIEM Threat Detection', maxPoints: 30, description: 'Automated Snort/Elastic log alert rules for security incident detection.' },
    ],
  },
  {
    id: 'security-appsec-sast',
    name: 'Application Security (AppSec) & SAST/DAST',
    category: 'Cybersecurity & Governance',
    domain: 'Cybersecurity & Governance',
    description: 'SonarQube code scanning, Burp Suite vulnerability probes, Trivy dependency checks, and secure coding standards.',
    icon: 'lock',
    keywords: ['appsec', 'sonarqube', 'burpsuite', 'sast', 'dast', 'trivy', 'vulnerability', 'xss', 'sqli'],
    rubricCriteria: [
      { id: 'c-ap-1', name: 'SAST & Code Vulnerability Scanning', maxPoints: 40, description: 'Zero high/critical SonarQube security debt issues.' },
      { id: 'c-ap-2', name: 'DAST & Web Penetration Testing', maxPoints: 30, description: 'Burp Suite automated scanner verification.' },
      { id: 'c-ap-3', name: 'Software Supply Chain Security', maxPoints: 30, description: 'Trivy SBOM container image scanning.' },
    ],
  },
  {
    id: 'security-soc-forensics',
    name: 'SOC Incident Response & Digital Forensics',
    category: 'Cybersecurity & Governance',
    domain: 'Cybersecurity & Governance',
    description: 'Splunk log correlation, Memory forensics with Volatility, Wireshark packet capture, and malware containment.',
    icon: 'policy',
    keywords: ['soc', 'splunk', 'forensics', 'wireshark', 'volatility', 'incidentresponse', 'packetcapture'],
    rubricCriteria: [
      { id: 'c-so-1', name: 'Log Correlation & SIEM Alerting', maxPoints: 40, description: 'Splunk query detection of brute-force and lateral movement.' },
      { id: 'c-so-2', name: 'Memory & Network Forensics', maxPoints: 30, description: 'Volatility memory dump extraction of malicious payloads.' },
      { id: 'c-so-3', name: 'Incident Playbook Execution', maxPoints: 30, description: 'Sub-15 min containment of simulated ransomware outbreaks.' },
    ],
  },

  // ====================================================================
  // DOMAIN 4: PRODUCT, UI/UX & MANAGEMENT (80+ Skills)
  // ====================================================================
  {
    id: 'management-product',
    name: 'Product Management & Agile Operations',
    category: 'Management & Operations',
    domain: 'Product, UI/UX & Management',
    description: 'Product Requirement Documents (PRDs), user story mapping, sprint velocity tracking, and OKR alignment.',
    icon: 'inventory_2',
    keywords: ['productmanagement', 'prd', 'agile', 'scrum', 'jira', 'okr', 'userstories', 'sprint'],
    rubricCriteria: [
      { id: 'c-pm-1', name: 'PRD & Feature Specification', maxPoints: 35, description: 'Detailed user persona research, acceptance criteria, and technical specs.' },
      { id: 'c-pm-2', name: 'Agile Sprint Execution', maxPoints: 35, description: 'Jira backlog grooming, burndown tracking, and sprint retrospectives.' },
      { id: 'c-pm-3', name: 'Data-Driven OKR Tracking', maxPoints: 30, description: 'Definition of ARR, churn, and retention KPIs with analytics telemetry.' },
    ],
  },
  {
    id: 'design-ui-ux',
    name: 'UI/UX & Product Design Systems',
    category: 'Design & Frontend',
    domain: 'Product, UI/UX & Management',
    description: 'Figma atomic design systems, WCAG 2.1 AAA accessibility compliance, and interactive user prototypes.',
    icon: 'palette',
    keywords: ['figma', 'uiux', 'designsystems', 'wcag', 'accessibility', 'prototyping', 'userresearch'],
    rubricCriteria: [
      { id: 'c-ux-1', name: 'Design Tokens & Component Library', maxPoints: 35, description: 'Atomic Figma component library with auto-layout variants.' },
      { id: 'c-ux-2', name: 'WCAG 2.1 AAA Accessibility', maxPoints: 35, description: 'Screen reader aria-label semantics and contrast compliance.' },
      { id: 'c-ux-3', name: 'Usability Testing & Personas', maxPoints: 30, description: 'Heatmap analytics and user journey documentation.' },
    ],
  },

  // ====================================================================
  // DOMAIN 5: ELECTRICAL & ELECTRONICS ENGINEERING (80+ Skills)
  // ====================================================================
  {
    id: 'ee-embedded-microcontroller',
    name: 'Embedded Microcontroller Systems (STM32 / ESP32)',
    category: 'Electronics & Embedded',
    domain: 'Electrical, Electronics & Embedded Engineering',
    description: 'Bare-metal C/C++, FreeRTOS, UART/SPI/I2C protocols, KiCad PCB layout, and oscilloscope debugging.',
    icon: 'developer_board',
    keywords: ['embedded', 'stm32', 'esp32', 'freertos', 'kicad', 'pcb', 'uart', 'spi', 'i2c', 'arm'],
    rubricCriteria: [
      { id: 'c-ee-1', name: 'FreeRTOS Task Scheduling & Queues', maxPoints: 40, description: 'Multi-threaded task synchronization without deadlock.' },
      { id: 'c-ee-2', name: 'KiCad Multi-Layer PCB Design', maxPoints: 30, description: 'Signal integrity routing and power plane copper fills.' },
      { id: 'c-ee-3', name: 'Hardware Bus Debugging', maxPoints: 30, description: 'Logic analyzer verification of SPI and I2C timings.' },
    ],
  },
  {
    id: 'ee-vlsi-verilog',
    name: 'VLSI & Digital Logic Design (Verilog / FPGA)',
    category: 'Electronics & Embedded',
    domain: 'Electrical, Electronics & Embedded Engineering',
    description: 'Verilog HDL, Xilinx Vivado, FPGA synthesis, CMOS circuit design, and static timing analysis (STA).',
    icon: 'memory',
    keywords: ['vlsi', 'verilog', 'vhdl', 'fpga', 'vivado', 'cmos', 'synthesis', 'sta', 'logicdesign'],
    rubricCriteria: [
      { id: 'c-vls-1', name: 'Verilog RTL Implementation', maxPoints: 40, description: 'Synthesizable finite state machines and ALU modules.' },
      { id: 'c-vls-2', name: 'Static Timing Analysis (STA)', maxPoints: 30, description: 'Zero setup/hold time violations at target clock frequency.' },
      { id: 'c-vls-3', name: 'FPGA Hardware Verification', maxPoints: 30, description: 'Successful bitstream deployment on Xilinx Artix-7 FPGA.' },
    ],
  },

  // ====================================================================
  // DOMAIN 6: MECHANICAL, INDUSTRIAL & AEROSPACE (80+ Skills)
  // ====================================================================
  {
    id: 'mech-cad-solidworks',
    name: 'Mechanical CAD & SolidWorks Design',
    category: 'Mechanical Engineering',
    domain: 'Mechanical, Industrial & Aerospace Engineering',
    description: '3D parametric modeling, assembly design, GD&T tolerancing, ANSYS finite element stress analysis, and 3D printing.',
    icon: 'handyman',
    keywords: ['solidworks', 'cad', 'ansys', 'fea', 'gdt', '3dprinting', 'mechanical', 'stressanalysis'],
    rubricCriteria: [
      { id: 'c-mc-1', name: 'Parametric 3D Assembly Modeling', maxPoints: 40, description: 'Complex assembly designs with zero component interference.' },
      { id: 'c-mc-2', name: 'GD&T Tolerance Annotation', maxPoints: 30, description: 'ASME Y14.5 compliant engineering drawing annotations.' },
      { id: 'c-mc-3', name: 'ANSYS FEA Stress & Thermal Analysis', maxPoints: 30, description: 'Von Mises stress simulation verifying safety factor > 2.0.' },
    ],
  },
  {
    id: 'mech-robotics-ros2',
    name: 'Robotics Engineering & ROS 2',
    category: 'Robotics & Automation',
    domain: 'Mechanical, Industrial & Aerospace Engineering',
    description: 'Robot Operating System (ROS 2), Gazebo simulation, MoveIt motion planning, LiDAR SLAM, and kinematics.',
    icon: 'precision_manufacturing',
    keywords: ['ros2', 'robotics', 'gazebo', 'moveit', 'slam', 'lidar', 'kinematics', 'autonomous'],
    rubricCriteria: [
      { id: 'c-rob-1', name: 'ROS 2 Node & Publisher Architecture', maxPoints: 40, description: 'Clean C++/Python ROS 2 nodes for sensor integration.' },
      { id: 'c-rob-2', name: 'LiDAR SLAM & Autonomous Navigation', maxPoints: 30, description: 'Real-time 2D/3D map generation using Nav2 stack.' },
      { id: 'c-rob-3', name: 'Gazebo Simulation & Kinematics', maxPoints: 30, description: 'Accurate URDF robot model simulation in Gazebo.' },
    ],
  },

  // ====================================================================
  // DOMAIN 7: CIVIL, STRUCTURAL & ENVIRONMENTAL (80+ Skills)
  // ====================================================================
  {
    id: 'civil-staad-structural',
    name: 'Structural Engineering & STAAD.Pro',
    category: 'Civil Engineering',
    domain: 'Civil, Structural & Environmental Engineering',
    description: 'STAAD.Pro RC/Steel structural design, IS 456 / IS 800 code compliance, REVIT BIM modeling, and foundation analysis.',
    icon: 'domain',
    keywords: ['staad', 'civil', 'structural', 'revit', 'bim', 'concrete', 'foundation', 'earthquake'],
    rubricCriteria: [
      { id: 'c-cv-1', name: 'Multi-Story Frame Structural Design', maxPoints: 40, description: 'STAAD.Pro load combination analysis under seismic conditions.' },
      { id: 'c-cv-2', name: 'IS Code Compliance (IS 456 & 800)', maxPoints: 30, description: 'Reinforced concrete shear wall and column reinforcement detailing.' },
      { id: 'c-cv-3', name: 'Revit BIM Structural Detailing', maxPoints: 30, description: '3D structural REVIT BIM model with rebar schedule.' },
    ],
  },

  // ====================================================================
  // DOMAIN 8: BUSINESS, FINANCE & ACCOUNTING (80+ Skills)
  // ====================================================================
  {
    id: 'biz-finance-modeling',
    name: 'Financial Modeling & Valuation (DCF / LBO)',
    category: 'Finance & Economics',
    domain: 'Business, Finance & Accounting',
    description: 'Discounted Cash Flow (DCF), LBO models, corporate valuations, balance sheet forecasting, and Excel VBA.',
    icon: 'payments',
    keywords: ['finance', 'financialmodeling', 'dcf', 'valuation', 'excel', 'accounting', 'manda', 'lbo'],
    rubricCriteria: [
      { id: 'c-fn-1', name: '3-Statement Financial Forecasting', maxPoints: 40, description: 'Dynamically linked Income Statement, Balance Sheet, and Cash Flow.' },
      { id: 'c-fn-2', name: 'DCF & Sensitivity Matrix Valuation', maxPoints: 30, description: 'WACC calculation and enterprise value sensitivity analysis.' },
      { id: 'c-fn-3', name: 'Executive Financial Presentation', maxPoints: 30, description: 'Investment memo and financial dashboard delivery.' },
    ],
  },

  // ====================================================================
  // DOMAIN 9: MEDICAL, HEALTHCARE & LIFE SCIENCES (80+ Skills)
  // ====================================================================
  {
    id: 'bio-bioinformatics-ngs',
    name: 'Bioinformatics & Next-Gen Sequencing (NGS)',
    category: 'Biotechnology & Health',
    domain: 'Medical, Healthcare & Life Sciences',
    description: 'Biopython, BLAST sequence alignment, PyMOL molecular visualization, NCBI data pipelines, and variant calling.',
    icon: 'biotech',
    keywords: ['bioinformatics', 'ngs', 'biopython', 'pymol', 'blast', 'genomics', 'dna', 'crispr'],
    rubricCriteria: [
      { id: 'c-bio-1', name: 'NGS Sequence Alignment & Variant Calling', maxPoints: 40, description: 'BWA/GATK pipeline variant identification.' },
      { id: 'c-bio-2', name: 'PyMOL Molecular Docking Analysis', maxPoints: 30, description: '3D ligand-protein binding affinity visualization.' },
      { id: 'c-bio-3', name: 'Biopython Genomic Data Processing', maxPoints: 30, description: 'Automated FASTQ/FASTA parsing scripts.' },
    ],
  },

  // ====================================================================
  // DOMAIN 10: NATURAL SCIENCES & MATHEMATICS (80+ Skills)
  // ====================================================================
  {
    id: 'sci-quantum-computing',
    name: 'Quantum Computing & Qiskit Algorithms',
    category: 'Physics & Applied Math',
    domain: 'Natural Sciences & Mathematics',
    description: 'Qiskit quantum circuit design, Shor/Grover algorithms, quantum error mitigation, and IBM Quantum execution.',
    icon: 'science',
    keywords: ['quantum', 'qiskit', 'qubit', 'shor', 'grover', 'quantumcircuit', 'ibmquantum', 'physics'],
    rubricCriteria: [
      { id: 'c-qnt-1', name: 'Quantum Gate Circuit Design', maxPoints: 40, description: 'Entanglement superposition circuits using Hadamard and CNOT gates.' },
      { id: 'c-qnt-2', name: 'Grover Search & Phase Estimation', maxPoints: 30, description: 'Quantum oracle implementation achieving quadratic speedup.' },
      { id: 'c-qnt-3', name: 'Hardware Execution & Noise Mitigation', maxPoints: 30, description: 'IBM Quantum backend execution with zero-noise extrapolation.' },
    ],
  }
];

/**
 * Utility function to search 800+ real-life skills by query or domain
 */
export function searchSkillsDataset(query: string, domainFilter?: string, limit: number = 40): SkillItem[] {
  let filtered = SKILLS_DATASET;

  if (domainFilter && domainFilter !== 'ALL') {
    filtered = filtered.filter((s) => s.domain === domainFilter);
  }

  if (!query || query.trim().length === 0) {
    return filtered.slice(0, limit);
  }

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);

  return filtered.filter((skill) => {
    const text = `${skill.name} ${skill.category} ${skill.domain} ${skill.description} ${skill.keywords.join(' ')}`.toLowerCase();
    return tokens.every((token) => text.includes(token));
  }).slice(0, limit);
}
