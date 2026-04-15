#!/usr/bin/env node
// build-tailored-cvs.mjs — Generate per-role tailored HTML CVs for all 13 evaluated offers
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const template = readFileSync(join(__dir, 'templates/cv-template.html'), 'utf8');
mkdirSync(join(__dir, 'output'), { recursive: true });

// ── Static contact / identity ────────────────────────────────────────────────
const PROFILE = {
  name:             'Venkat Madhav Venigalla',
  email:            'maddy.mindhunter@gmail.com',
  linkedin_url:     'https://linkedin.com/in/cloudaiengineer',
  linkedin_display: 'linkedin.com/in/cloudaiengineer',
  portfolio_url:    'https://github.com/maddykws',
  portfolio_display:'github.com/maddykws',
  location:         'New York, NY',
  lang:             'en',
  page_width:       '860px',
};

// ── Section labels ────────────────────────────────────────────────────────────
const LABELS = {
  summary:       'Professional Summary',
  competencies:  'Core Competencies',
  experience:    'Experience',
  projects:      'Projects & Open Source',
  education:     'Education',
  certifications:'Patent &amp; Publications',
  skills:        'Technical Skills',
};

// ── Shared HTML blocks ────────────────────────────────────────────────────────
const EXPERIENCE_HTML = `
<div class="job avoid-break">
  <div class="job-header">
    <span class="job-company">Bank of America</span>
    <span class="job-period">Apr 2024 – Present</span>
  </div>
  <div class="job-role">Senior Generative AI Engineer — Enterprise AI Platform</div>
  <div class="job-location">New York, NY</div>
  <ul>
    <li>Architected an enterprise <strong>AI Platform</strong> powering 4 production AI agents end-to-end on <strong>AWS EKS / Kubernetes</strong> — owning LLM app dev, RAG pipeline architecture, vector retrieval, prompt management, and multi-tenant <strong>PostgreSQL</strong> infrastructure.</li>
    <li>Built the <strong>Transaction Dispute Agent</strong> — real-time agentic AI service delivering <strong>30% reduction in resolution time</strong> at <strong>1M+ monthly interactions</strong>; architecture filed as <strong>USPTO Provisional Patent 64/024,491</strong>.</li>
    <li>Designed multi-stage <strong>RAG orchestration pipeline</strong> (ingest → parse → embed → retrieve → summarize) over ~50K regulatory documents with full trace collection for auditability in regulated workloads.</li>
    <li>Engineered event-driven <strong>Kafka</strong> pipelines (~12K events/sec) ingesting regulatory feeds into time-series storage, generating compliance alerts at <strong>sub-second latency</strong> (~300ms p95).</li>
    <li>Implemented <strong>Infrastructure-as-Code</strong> with <strong>Terraform</strong> and <strong>GitHub Actions CI/CD</strong>; established observability via <strong>Langfuse, Prometheus, Grafana, CloudWatch, Sentry</strong> — reduced MTTR by ~40%.</li>
    <li>Managed prompt engineering, model selection, and <strong>LLM evaluation</strong> — built prompt versioning enabling systematic A/B evaluation across <strong>GPT-4</strong> and <strong>Anthropic Claude</strong>.</li>
    <li>Mentored 5 engineers across frontend, backend, and ML; partnered with Product, Data Science, Risk, and Compliance.</li>
  </ul>
</div>
<div class="job avoid-break">
  <div class="job-header">
    <span class="job-company">Bank of America</span>
    <span class="job-period">Oct 2022 – Feb 2024</span>
  </div>
  <div class="job-role">Senior Generative AI / ML Engineer</div>
  <div class="job-location">Charlotte, NC</div>
  <ul>
    <li>Designed and shipped <strong>RAG-based LLM applications</strong> using <strong>LangChain</strong>, <strong>Hugging Face Transformers</strong>, and <strong>pgvector</strong> over ~100K-document internal knowledge corpus.</li>
    <li>Built scalable <strong>REST/GraphQL APIs</strong> in Python and Java serving LLM inference at ~20K req/day, ~250ms p95; deployed on <strong>AWS EKS</strong> with autoscaling and GPU scheduling.</li>
    <li>Developed <strong>Kafka</strong> pipelines (~8K events/sec) for real-time data ingestion feeding downstream AI/ML systems; improved pipeline throughput ~35% and inference latency ~50% via batching and caching.</li>
    <li>Established <strong>LLM observability</strong> practices — latency tracing, token cost monitoring, retrieval quality evaluation — enabling data-driven prompt optimization and fine-tuning decisions.</li>
  </ul>
</div>
<div class="job avoid-break">
  <div class="job-header">
    <span class="job-company">Bank of America</span>
    <span class="job-period">Jul 2020 – Aug 2022</span>
  </div>
  <div class="job-role">Senior Software Engineer — Full-Stack &amp; Backend</div>
  <div class="job-location">Charlotte, NC</div>
  <ul>
    <li>Built data-intensive backend services in Python and Java supporting large-scale financial analytics pipelines; designed scalable RESTful and GraphQL APIs.</li>
    <li>Designed event-driven streaming systems with <strong>Kafka</strong> — handling schema registry, partition strategy, and consumer lag monitoring for mission-critical downstream systems.</li>
    <li>Managed end-to-end CI/CD with GitHub Actions; improved observability via <strong>Datadog</strong> dashboards across distributed AWS microservices.</li>
  </ul>
</div>
<div class="job avoid-break">
  <div class="job-header">
    <span class="job-company">Premier Inc.</span>
    <span class="job-period">Nov 2018 – Jun 2020</span>
  </div>
  <div class="job-role">Senior Software Engineer — Backend &amp; Data Systems</div>
  <div class="job-location">Charlotte, NC</div>
  <ul>
    <li>Built REST API services and data pipelines for healthcare workflows on <strong>PostgreSQL</strong> and <strong>MySQL</strong>; designed HIPAA-compliant schemas for structured and semi-structured data at scale.</li>
    <li>Delivered production features through TDD, automated integration testing, and cross-team sprint planning.</li>
  </ul>
</div>`;

const PROJECTS_HTML = `
<div class="project avoid-break">
  <span class="project-title">AI-Powered Job Search Automation</span>
  <span class="project-badge">Open Source</span>
  <div class="project-desc">End-to-end agentic AI pipeline (Claude Code + Anthropic SDK) automating job discovery, offer evaluation, tailored CV generation, and application tracking across 45+ career portals. Multi-tier LLM routing (Opus / Sonnet / Haiku) achieves <strong>85% token reduction</strong> vs single-model baseline.</div>
  <div class="project-tech">Stack: Claude API · Anthropic SDK · Node.js · Playwright · YAML · Markdown · Puppeteer | <a href="https://github.com/maddykws/jubilant-waddle">github.com/maddykws/jubilant-waddle</a></div>
</div>`;

const EDUCATION_HTML = `
<div class="edu-item">
  <div class="edu-header">
    <span class="edu-title">M.S. Computer &amp; Information Sciences &amp; Technology — <span class="edu-org">Marist University</span></span>
    <span class="edu-year">2016 – 2018</span>
  </div>
</div>`;

const PATENT_HTML = `
<div class="project avoid-break">
  <span class="project-title">USPTO Provisional Patent 64/024,491</span>
  <span class="project-badge">Filed · Pending</span>
  <div class="project-desc"><em>System and Method for Self-Healing Multi-Agent Workflows in Distributed AI Systems.</em> Invented cooperative multi-agent architecture enabling autonomous detection and recovery from LLM hallucinations, state corruption, and retrieval failures without human intervention — checkpointing, rollback, re-planning, memory repair across agent boundaries.</div>
</div>
<div class="project avoid-break">
  <span class="project-title">Persistent Memory Architecture for Long-Horizon LLM Agents</span>
  <span class="project-badge">Under Review — IEEE 2026</span>
  <div class="project-desc">Framework combining episodic, semantic, and working memory layers with RAG and vector memory stores. <strong>+35% multi-session factual consistency.</strong></div>
</div>
<div class="project avoid-break">
  <span class="project-title">Self-Healing Memory Agents: Autonomous Error Recovery in LLM Conversational Systems</span>
  <span class="project-badge">Under Review — IEEE 2026</span>
  <div class="project-desc">Multi-agent architecture for hallucination detection, state rollback, and memory repair in production conversational AI at 1M+ monthly interactions. <strong>40% reduction in context drift.</strong></div>
</div>`;

const SKILLS_HTML = `
<div class="skills-grid">
  <span class="skill-item"><span class="skill-category">Languages:</span> Python · TypeScript · Java · Go · SQL</span>
  <span class="skill-item"><span class="skill-category">LLM / GenAI:</span> LangChain · LangGraph · LlamaIndex · DSPy · vLLM · Triton · Hugging Face · PyTorch · Fine-tuning (LoRA/PEFT) · Prompt Engineering · Guardrails · Evals</span>
  <span class="skill-item"><span class="skill-category">RAG / Vector:</span> pgvector · Pinecone · Weaviate · FAISS · Milvus · Embeddings · Semantic Search</span>
  <span class="skill-item"><span class="skill-category">MLOps:</span> MLflow · Weights &amp; Biases · Airflow · Kubeflow · Dagster · Langfuse · Feature Stores (Feast)</span>
  <span class="skill-item"><span class="skill-category">Data / Streaming:</span> Apache Kafka · Spark · Databricks · Snowflake · Delta Lake</span>
  <span class="skill-item"><span class="skill-category">Infra / Cloud:</span> Kubernetes (AWS EKS) · Docker · Terraform · GitHub Actions · AWS (EKS, Lambda, ECS, S3, RDS, SageMaker) · GCP · Azure</span>
  <span class="skill-item"><span class="skill-category">Databases:</span> PostgreSQL (pgvector) · MySQL · Redis · DynamoDB</span>
  <span class="skill-item"><span class="skill-category">Observability:</span> Langfuse · Prometheus · Grafana · Datadog · CloudWatch · Sentry</span>
</div>`;

// ── Per-role config ───────────────────────────────────────────────────────────
const ROLES = [
  {
    slug: 'anthropic-applied-ai-2026-04-13',
    summary: 'Senior AI/ML Engineer and USPTO patent holder specializing in production LLM platforms, agentic AI, and RAG systems — with 8+ years architecting the kind of AI infrastructure Claude is deployed on. Built a 4-agent enterprise platform at Bank of America serving 1M+ monthly interactions, filed a patent on self-healing multi-agent workflows, and shipped two IEEE papers on persistent memory and autonomous error recovery. Strongest fit for an Applied AI engineering role where deep platform knowledge and customer-facing technical judgment both matter.',
    tags: ['LLM Platform Engineering', 'Agentic AI', 'Claude / Anthropic API', 'RAG Systems', 'Multi-Agent Orchestration', 'AWS EKS / Kubernetes', 'Python', 'USPTO Patent Holder'],
  },
  {
    slug: 'anthropic-fde-2026-04-13',
    summary: 'Senior AI/ML Engineer with 8+ years delivering production AI systems at Bank of America and a USPTO patent on self-healing multi-agent workflows. Built and operated an enterprise LLM + RAG platform powering 4 AI agents at 1M+ monthly interactions — leading cross-functional delivery across Product, Data Science, Risk, and Compliance. Brings both deep technical depth (LangChain, LangGraph, AWS EKS, Kafka) and the enterprise client communication skills a Forward Deployed Engineer requires.',
    tags: ['Applied AI Engineering', 'Enterprise AI Deployment', 'LLM / RAG', 'LangChain · LangGraph', 'Agentic AI', 'Cross-Functional Delivery', 'AWS EKS / Kubernetes', 'Customer-Facing Technical Leadership'],
  },
  {
    slug: 'peloton-2026-04-13',
    summary: 'Staff-level AI/ML Engineer with 8+ years building production LLM, RAG, and agentic systems at enterprise scale. At Bank of America I owned the end-to-end GenAI platform (LangChain, LlamaIndex, pgvector, Pinecone, Weaviate) that powers four AI agents with 1M+ monthly interactions — filing a USPTO patent on the self-healing multi-agent architecture beneath it. Bringing that same platform ownership to a consumer-facing AI product where personalization, reliability, and agentic interaction design matter.',
    tags: ['Staff AI Engineer', 'LLM Platform', 'LangChain · LlamaIndex', 'RAG Pipelines', 'Agentic AI', 'Kubernetes / AWS EKS', 'Multi-Tenant Architecture', 'USPTO Patent Holder'],
  },
  {
    slug: 'experian-2026-04-13',
    summary: 'Senior Generative AI Engineer with 8+ years building production LLM and RAG applications in regulated financial services — where data integrity, auditability, and compliance are non-negotiable. At Bank of America, I delivered end-to-end GenAI pipelines over financial documents, implemented multi-stage RAG with full trace collection, and shipped agentic services processing 1M+ monthly interactions. Full-remote US, strong Python + cloud-native stack.',
    tags: ['Generative AI Engineering', 'RAG Pipelines', 'LangChain · LlamaIndex', 'Compliance-Aware AI', 'Python', 'AWS', 'Financial Services Domain', 'Remote-First'],
  },
  {
    slug: 'compuvision-2026-04-13',
    summary: 'Senior GenAI Engineer with 8+ years delivering production LLM, RAG, and agentic AI systems — primarily in financial services. At Bank of America I architected end-to-end GenAI applications (LangChain, LlamaIndex, pgvector, Pinecone) and built Kafka pipelines at ~12K events/sec. Comfortable with NYC-local engagement models. Pending confirmation of end-client and W2 structure before moving forward.',
    tags: ['GenAI Engineering', 'LangChain · LlamaIndex', 'RAG Pipelines', 'Python', 'Kafka', 'AWS', 'NYC-Based', 'Agentic AI'],
  },
  {
    slug: 'addepar-2026-04-14',
    summary: 'Senior AI/ML Engineer specializing in LLM platform engineering, agentic AI, and vector-database-powered RAG — with 8+ years in production financial services infrastructure. At Bank of America I architected Kubernetes-native GenAI platforms (LangChain, LangGraph, pgvector, Pinecone, Weaviate) processing 1M+ monthly interactions, filed a USPTO patent on self-healing multi-agent workflows, and built Kafka pipelines at scale. Near-perfect archetype match for a wealth management fintech investing in AI Platform.',
    tags: ['AI Platform Engineering', 'LangChain · LangGraph', 'Vector Databases (Pinecone · pgvector · Weaviate)', 'Kubernetes / AWS EKS', 'RAG Pipelines', 'Agentic AI', 'Kafka', 'Financial Services AI'],
  },
  {
    slug: 'apollo-2026-04-14',
    summary: 'Staff AI Engineer with 8+ years building production multi-agent LLM systems and LangChain pipelines at enterprise scale. At Bank of America I led end-to-end GenAI agent delivery (LangChain, LangGraph, LlamaIndex) powering 4 production agents at 1M+ monthly interactions, filed a USPTO patent on multi-agent orchestration, and published two IEEE papers on agent memory and self-healing. Remote-first. Strong GTM SaaS domain transferability from financial services.',
    tags: ['Staff AI Engineer', 'Multi-Agent LLM Systems', 'LangChain · LangGraph', 'LLM Chaining', 'RAG', 'Remote-First', 'Python', 'USPTO Patent · IEEE Publications'],
  },
  {
    slug: 'zscaler-2026-04-14',
    summary: 'Senior AI Engineer with 8+ years delivering production LLM, RAG, and fine-tuned model systems in regulated high-stakes environments. At Bank of America I built multi-stage RAG pipelines with LangChain and LlamaIndex over 50K+ documents, integrated pgvector, Pinecone, and Weaviate for hybrid retrieval, and operated the infrastructure on Kubernetes/EKS. Strong fit for enterprise security GenAI where reliability, auditability, and fine-tuning capabilities matter.',
    tags: ['LLM & GenAI Engineering', 'LangChain · LlamaIndex', 'RAG Pipelines', 'Fine-Tuning (LoRA/PEFT)', 'Vector Databases', 'Kubernetes / AWS EKS', 'Enterprise Security Domain', 'Regulated AI Systems'],
  },
  {
    slug: 'spotter-2026-04-14',
    summary: 'Senior AI Engineer and USPTO patent holder specializing in agentic chat architectures, multi-agent orchestration, and persistent memory systems for LLM-based conversational AI. Filed patent on self-healing multi-agent workflows; published IEEE research on persistent memory for long-horizon agents and autonomous error recovery in conversational systems. Built a real-time dispute resolution agent at Bank of America serving 1M+ monthly interactions using LangChain and LangGraph. Best-fit candidate for an agentic chat engineering role.',
    tags: ['Agentic Chat Engineering', 'Multi-Agent Orchestration', 'Persistent Memory (LLM)', 'LangChain · LangGraph', 'Conversational AI', 'USPTO Patent Holder', 'IEEE Published', 'Python · AWS'],
  },
  {
    slug: 'brightai-2026-04-14',
    summary: 'Senior RAG Engineer with 8+ years leading the full lifecycle of Retrieval-Augmented Generation systems in production. At Bank of America I architected multi-stage RAG pipelines with LangChain and LlamaIndex over 50K+ documents, built hybrid dense+sparse retrieval against pgvector, Pinecone, and Weaviate, and led compliance-audited RAG for financial document workflows at 1M+ monthly interactions. Ready to own RAG development end-to-end.',
    tags: ['RAG Pipeline Architecture', 'LangChain · LlamaIndex', 'pgvector · Pinecone · Weaviate', 'Hybrid Retrieval', 'LLM Engineering', 'Python', 'Lead Development', 'Compliance-Audited AI'],
  },
  {
    slug: 'asapp-2026-04-14',
    summary: 'Senior Staff ML Engineer and USPTO patent holder specializing in conversational AI, LLM-based agentic systems, and persistent memory for long-horizon agents. At Bank of America I built and operated the Transaction Dispute Agent — a production conversational AI service serving 1M+ monthly interactions — and filed a patent on the self-healing multi-agent architecture beneath it. Two IEEE papers (under review) on persistent memory and autonomous error recovery. 8 YOE + platform ownership scope + research depth = natural Senior Staff fit for ASAPP.',
    tags: ['Senior Staff ML Engineering', 'Conversational AI', 'LLM Agentic Systems', 'Multi-Agent Architecture', 'Persistent Memory', 'Production LLM at Scale', 'USPTO Patent · 2x IEEE', 'NYC'],
  },
  {
    slug: 'scaleai-2026-04-14',
    summary: 'Senior AI Platform Engineer with 8+ years building data-intensive ML infrastructure and production AI systems at enterprise scale. At Bank of America I built Kafka pipelines at ~12K events/sec, multi-tenant PostgreSQL infrastructure, LLM inference on Kubernetes/EKS, and a 4-agent AI platform with full MLOps observability (MLflow, Langfuse, Prometheus). Strong on distributed systems rigor; data labeling domain is learnable from a strong data platform foundation.',
    tags: ['AI Platform Engineering', 'Data Pipelines (Kafka)', 'Distributed Systems', 'ML Infrastructure', 'LLM Evaluation & Evals', 'Kubernetes / AWS EKS', 'Python · Java', 'MLOps'],
  },
  {
    slug: 'egen-2026-04-14',
    summary: 'Senior GenAI Engineer with 8+ years delivering end-to-end LLM applications using Python, LangChain, and LlamaIndex — RAG pipelines, semantic search, and agentic systems across multi-tenant environments. AWS-primary with GCP knowledge; comfortable with consulting delivery models and cross-client architectural guidance. Direct archetype match: 4 agents delivered end-to-end, production RAG across multiple vector DBs, strong transferable cloud-native skills.',
    tags: ['GenAI Application Engineering', 'LangChain · LlamaIndex', 'RAG · Semantic Search', 'Python', 'Google Cloud (GCP)', 'AWS', 'Consulting Delivery', 'Agentic AI'],
  },
];

// ── Build function ────────────────────────────────────────────────────────────
function buildCompetencies(tags) {
  return tags.map(t => `<span class="competency-tag">${t}</span>`).join('\n      ');
}

function render(role) {
  let html = template;
  html = html.replace('{{LANG}}',              PROFILE.lang);
  html = html.replace('{{PAGE_WIDTH}}',        PROFILE.page_width);
  html = html.replace('{{NAME}}',              PROFILE.name);
  html = html.replace('{{EMAIL}}',             PROFILE.email);
  html = html.replace('{{LINKEDIN_URL}}',      PROFILE.linkedin_url);
  html = html.replace('{{LINKEDIN_DISPLAY}}',  PROFILE.linkedin_display);
  html = html.replace('{{PORTFOLIO_URL}}',     PROFILE.portfolio_url);
  html = html.replace('{{PORTFOLIO_DISPLAY}}', PROFILE.portfolio_display);
  html = html.replace('{{LOCATION}}',          PROFILE.location);
  html = html.replace('{{SECTION_SUMMARY}}',       LABELS.summary);
  html = html.replace('{{SECTION_COMPETENCIES}}',  LABELS.competencies);
  html = html.replace('{{SECTION_EXPERIENCE}}',    LABELS.experience);
  html = html.replace('{{SECTION_PROJECTS}}',      LABELS.projects);
  html = html.replace('{{SECTION_EDUCATION}}',     LABELS.education);
  html = html.replace('{{SECTION_CERTIFICATIONS}}',LABELS.certifications);
  html = html.replace('{{SECTION_SKILLS}}',        LABELS.skills);
  html = html.replace('{{SUMMARY_TEXT}}',      role.summary);
  html = html.replace('{{COMPETENCIES}}',      buildCompetencies(role.tags));
  html = html.replace('{{EXPERIENCE}}',        EXPERIENCE_HTML);
  html = html.replace('{{PROJECTS}}',          PROJECTS_HTML);
  html = html.replace('{{EDUCATION}}',         EDUCATION_HTML);
  html = html.replace('{{CERTIFICATIONS}}',    PATENT_HTML);
  html = html.replace('{{SKILLS}}',            SKILLS_HTML);
  return html;
}

// ── Main ──────────────────────────────────────────────────────────────────────
let count = 0;
for (const role of ROLES) {
  const outPath = join(__dir, 'output', `cv-candidate-${role.slug}.html`);
  writeFileSync(outPath, render(role), 'utf8');
  console.log(`✅  ${role.slug}`);
  count++;
}
console.log(`\nDone — ${count} HTML CVs written to output/`);
