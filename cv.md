# Venkat Madhav Venigalla

**Senior AI/ML Engineer** · LLM · RAG · Agentic AI Platforms · Kafka · Kubernetes · PostgreSQL · AWS
**USPTO Patent Holder — Self-Healing Multi-Agent AI** · **Published Researcher (IEEE, under review)**

New York, NY | maddy.mindhunter@gmail.com | 845-630-9412 | [linkedin.com/in/cloudaiengineer](https://linkedin.com/in/cloudaiengineer) | [github.com/maddykws](https://github.com/maddykws)

---

## Professional Summary

Senior Machine Learning / AI Infrastructure Engineer with **8+ years** building production AI/ML platforms, LLM and RAG systems, and real-time event-driven data pipelines — primarily in financial services, where latency, data integrity, and reliability are non-negotiable.

At **Bank of America**, I architected and operated an enterprise **AI Platform** powering four production **AI agents** at scale — owning **PostgreSQL** schema design across multi-tenant environments, **Apache Kafka** pipelines processing millions of real-time financial events daily, and **LLM/RAG** inference infrastructure on **AWS EKS / Kubernetes**, with **Python, Docker, Terraform,** and **CI/CD** across the stack. One of those systems — a real-time **agentic AI** dispute resolution service serving **1M+ monthly interactions** — led to a **USPTO provisional patent** on the self-healing multi-agent architecture beneath it. Two research papers currently under review on persistent memory and autonomous error recovery in LLM-based systems.

**Core stack:** Python · PyTorch · Hugging Face · LangChain · LangGraph · LlamaIndex · vLLM · pgvector · Pinecone · Weaviate · Kafka · PostgreSQL · Kubernetes (EKS) · AWS · Airflow · MLflow · Terraform

**Core depth:** MLOps and ML pipeline orchestration with traceability and reproducibility · time-series and event-driven data at scale · multi-tenant database infrastructure · LLM evaluation, guardrails, and observability · backend systems that operate under real-world production pressure.

Currently exploring **Staff / Senior ML Engineer, AI Platform, and Applied AI / Generative AI Engineer** roles at the intersection of industrial data systems and AI.

---

## Core Technical Skills

| Category | Skills |
|----------|--------|
| **Languages** | Python, TypeScript, Java, Go, SQL |
| **ML / LLM Frameworks** | PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, LangChain, LangGraph, LlamaIndex, DSPy |
| **Generative AI** | Large Language Models (LLMs), Generative AI (GenAI), Agentic AI, AI Agents, Multi-Agent Systems, Foundation Models, Fine-tuning (LoRA / PEFT), Embeddings, Prompt Engineering, Guardrails, Evals |
| **RAG & Vector DBs** | Retrieval-Augmented Generation (RAG) pipelines, pgvector, Pinecone, Weaviate, FAISS, Milvus, Azure Cognitive Search, semantic search |
| **Model Serving** | vLLM, Triton, TGI, FastAPI, OpenAI API, Anthropic Claude API |
| **MLOps** | MLflow, Weights & Biases, Airflow, Dagster, Kubeflow, Feature Stores (Feast), Model Registry, Experiment Tracking, Langfuse |
| **Data & Streaming** | Apache Kafka, MQTT, Apache Spark, Databricks, Snowflake, Delta Lake, Lakehouse |
| **Databases** | PostgreSQL (pgvector), MySQL, Redis, DynamoDB |
| **Infrastructure** | Kubernetes (AWS EKS), Docker, Terraform (IaC), GitHub Actions CI/CD, Helm |
| **Cloud** | AWS (EKS, Lambda, ECS, S3, RDS, SageMaker), GCP, Azure |
| **Observability** | Langfuse, Prometheus, Grafana, Datadog, CloudWatch, Sentry |

---

## Professional Experience

### Senior Generative AI Engineer — Enterprise AI Platform
**Bank of America** | New York, NY | April 2024 – Present

Architected and operated an enterprise **AI Platform** powering four production AI agents end-to-end — owning **LLM application development, RAG pipeline architecture, vector retrieval, prompt management**, multi-tenant **PostgreSQL** infrastructure, and cloud deployment on **AWS EKS / Kubernetes**.

- Architected and operated an event-driven **Kafka** pipeline ingesting live regulatory feeds and internal policy documents into a time-series-aware storage layer, generating structured compliance change alerts for risk and legal teams at **sub-second latency** (~300ms p95).
- Designed a multi-stage **RAG orchestration pipeline** (ingest → parse → embed → retrieve → summarize) over ~50K regulatory documents with full trace collection and reproducibility, enabling auditability for regulated workloads.
- Led delivery of AI/ML platform solutions built on LLMs (**GPT-4, Anthropic Claude**), **RAG**, and cloud-native **AWS (EKS, Lambda, S3)** — integrating real-time streaming data with ML pipelines to power **4 production AI agents** serving **1M+ monthly interactions**.
- Built the **Transaction Dispute Agent** — a real-time agentic AI service — delivering a **30% reduction in resolution time** and informing the architecture behind **USPTO Provisional Patent 64/024,491** on self-healing multi-agent workflows.
- Built real-time and batch data pipelines with **Apache Kafka** and scalable backend services in **Python** and **Java**, processing ~12K events/sec across multi-tenant environments.
- Implemented **Infrastructure-as-Code** and **CI/CD** with **Terraform** and **GitHub Actions**, and established production observability via **Langfuse, Prometheus, Grafana, CloudWatch,** and **Sentry**, reducing MTTR by ~40%.
- Managed **prompt engineering**, **model selection**, and **LLM evaluation** in production — built prompt versioning and template management enabling systematic A/B evaluation across multiple GenAI use cases.
- Partnered with Product, Data Science, Risk, and Compliance teams; provided architectural guidance and mentored 5 engineers across frontend, backend, and ML systems.

### Senior Generative AI / ML Engineer
**Bank of America** | Charlotte, NC | October 2022 – February 2024

- Designed and shipped **RAG-based LLM applications** using **LangChain**, **Hugging Face Transformers**, and **pgvector** on PostgreSQL, powering semantic search and Q&A over an internal knowledge corpus of ~100K documents.
- Built scalable backend services and **REST/GraphQL APIs** in **Python** and **Java** to serve LLM inference and analytics workflows, handling ~20K requests/day at ~250ms p95 latency.
- Developed **Apache Kafka** pipelines for real-time ingestion, transformation, and enrichment of streaming data feeding downstream AI/ML systems at ~8K events/sec.
- Deployed and operated AI/ML workloads on **AWS EKS (Kubernetes)** with containerized inference services, autoscaling, and GPU scheduling for experimentation and production traffic.
- Improved pipeline throughput by ~35% and reduced inference latency by ~50% through request batching, embedding caching, and query optimization.
- Established **LLM observability** practices — latency tracing, token cost monitoring, and retrieval quality evaluation — enabling data-driven prompt optimization and fine-tuning decisions in production.

### Senior Software Engineer — Full-Stack & Backend
**Bank of America** | Charlotte, NC | July 2020 – August 2022

- Built data-intensive backend services in **Python** and **Java** supporting large-scale financial analytics pipelines; designed scalable **RESTful** and **GraphQL APIs** for internal applications.
- Designed and implemented event-driven streaming systems using **Apache Kafka** for real-time financial data processing — handling schema registry, partition strategy, and consumer lag monitoring for mission-critical downstream systems.
- Contributed to distributed systems architecture decisions and cross-team API versioning standards; managed end-to-end **CI/CD** workflows via **GitHub Actions**.
- Improved system observability through structured logging, **Datadog** dashboards, and alerting across distributed **AWS** microservices.

### Senior Software Engineer — Backend & Data Systems
**Premier Inc.** | Charlotte, NC | November 2018 – June 2020

- Built backend **REST API** services and data pipelines for clinical and operational healthcare workflows on **PostgreSQL** and **MySQL**; designed schemas for HIPAA-compliant structured and semi-structured data at scale.
- Delivered production features through TDD, automated integration testing, and code reviews; collaborated with stakeholders on sprint planning for distributed healthcare systems.

---

## Patent

**USPTO Provisional Patent 64/024,491 — System and Method for Self-Healing Multi-Agent Workflows in Distributed AI Systems** *(Filed, Pending)*

Invented a multi-agent architecture for distributed AI systems in which autonomous agents cooperatively detect, diagnose, and recover from runtime failures — including LLM hallucinations, state corruption, retrieval errors, and workflow-level faults — without human intervention. Introduces self-healing orchestration primitives (checkpointing, rollback, re-planning, and memory repair) across agent boundaries, enabling resilient long-running LLM workflows in production. The architecture underlies the real-time dispute resolution agent serving 1M+ monthly interactions at Bank of America.

*Keywords: multi-agent architecture, self-healing, distributed AI systems, LLM orchestration, LangGraph, Agentic AI, production GenAI reliability, AI platform engineering.*

---

## Publications

### Persistent Memory Architecture for Long-Horizon LLM Agents
*Under Review — IEEE | 2026*

Research on persistent memory architectures for **long-horizon LLM agents** operating over extended task sequences and multi-session interactions. Proposes a framework combining episodic, semantic, and working memory layers with **RAG** and **vector-based memory stores**, enabling agents to maintain coherent state across thousands of interactions without context window degradation. Contributions include a memory-aware agent orchestration pattern, benchmarks on long-context reasoning, and evaluation against production workloads in multi-agent systems. **Result:** 35% improvement in multi-session factual consistency.

*Keywords: persistent memory, long-horizon LLM agents, episodic memory, semantic memory, RAG, vector memory, agent orchestration, multi-agent systems, Agentic AI, memory-augmented LLMs, LangChain, LangGraph.*

### Self-Healing Memory Agents: A Framework for Autonomous Error Recovery in LLM-Based Conversational Systems
*Under Review — IEEE | 2026*

A framework for **self-healing LLM agents** capable of autonomous error detection and recovery in production conversational AI systems. Introduces a multi-agent architecture where memory, monitoring, and recovery agents cooperate to detect **hallucinations, state corruption, and retrieval failures** at runtime — triggering rollback, re-planning, and memory repair without human intervention. Evaluated on real-time dispute resolution workloads serving 1M+ monthly interactions in regulated financial services. **Result:** 40% reduction in context drift. Directly informed the architecture behind USPTO Provisional Patent 64/024,491.

*Keywords: self-healing agents, autonomous error recovery, LLM-based conversational systems, multi-agent architecture, hallucination detection, retrieval failure, production LLM systems, Agentic AI, LLM reliability, LLM observability, GenAI.*

---

## Projects

### AI-Powered Job Search Automation — 85% LLM Token Reduction via Multi-Tier Model Routing
**[github.com/maddykws/jubilant-waddle](https://github.com/maddykws/jubilant-waddle)** | Open source

End-to-end **Agentic AI pipeline** built on **Claude Code** and the **Anthropic SDK** that automates job discovery, offer evaluation, tailored CV generation, and application tracking across 45+ career portals. Contributed a **multi-tier LLM routing architecture** that dynamically dispatches tasks across **Claude Opus, Sonnet, and Haiku** based on task complexity, input size, and cost sensitivity — achieving an **85% reduction in token consumption** versus a single-model baseline while preserving output quality.

**Key contributions:**
- Multi-tier model routing (Opus / Sonnet / Haiku) driven by task classification and complexity scoring
- **Prompt caching** and context compaction to maximize Anthropic prompt-cache hit rates and minimize cold-read cost
- **Agentic orchestration** across offer evaluation, deep research, CV tailoring, and portal scanning modes
- Structured output pipelines feeding Markdown reports, PDF CV generation (Puppeteer/Playwright), and a persistent application tracker
- Batch evaluation mode for parallel processing of large offer backlogs

**Stack:** Claude API (Anthropic SDK) · Claude Code · Node.js · Playwright · YAML · Markdown · Puppeteer

*Keywords: Agentic AI, Claude Code, Anthropic SDK, LLM routing, multi-model orchestration, token optimization, prompt caching, context compaction, LLM cost optimization, prompt engineering, production GenAI.*

---

## Education

**Master of Science — Computer and Information Sciences & Technology**
Marist University | January 2016 – May 2018
