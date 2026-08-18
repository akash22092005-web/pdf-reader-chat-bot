"""
Sample PDF Generator for RAG Testing
Generates realistic multi-page PDF documents:
1. Corporate_AI_Policy_2026.pdf (Enterprise policy document)
2. Technical_Architecture_Manual.pdf (Technical system manual)
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def create_sample_policy_pdf(filename="Corporate_AI_Policy_2026.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Heading2'],
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#2563eb'),
        spaceBefore=15,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []
    
    # Page 1
    story.append(Paragraph("Enterprise Artificial Intelligence & Data Policy 2026", title_style))
    story.append(Paragraph("Document Version: 3.4 | Effective Date: January 1, 2026 | Classification: Internal Confidential", body_style))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("1. Executive Summary & Purpose", h1_style))
    story.append(Paragraph("This policy document establishes mandatory guidelines for the usage of Generative AI, Retrieval-Augmented Generation (RAG) systems, Large Language Models (LLMs), and automated data processing pipelines across all enterprise operations. All employees, contractors, and third-party vendors must comply with these protocols to ensure data privacy, intellectual property protection, and regulatory compliance with AI governance frameworks.", body_style))
    
    story.append(Paragraph("2. Approved AI Models & API Usage", h1_style))
    story.append(Paragraph("2.1 Commercial API Providers: Only enterprise-tier agreements with OpenAI (GPT-4o, text-embedding-3-small), Anthropic (Claude 3.5 Sonnet), and Google Cloud Vertex AI are authorized for processing internal corporate data. Consumer-grade free web interfaces (such as public ChatGPT or Claude web chat) are strictly prohibited for uploading proprietary source code, customer PII, or financial statements.", body_style))
    story.append(Paragraph("2.2 Self-Hosted & Local Models: Open-source models deployed via HuggingFace Transformers (e.g., Llama 3, Mistral 7B, Sentence-Transformers all-MiniLM-L6-v2) may be hosted on internal private cloud instances provided vector storage is encrypted at rest using AES-256.", body_style))
    
    story.append(Paragraph("3. Data Classification & Security Levels", h1_style))
    story.append(Paragraph("Data ingested into RAG vector stores must be tagged according to the following 4 security levels:", body_style))
    
    data_table = [
        ["Level", "Classification", "RAG Vector Store Permission", "Allowed Embedding Models"],
        ["L1", "Public", "Unrestricted internal & public endpoints", "HuggingFace, OpenAI, Any"],
        ["L2", "Internal Business", "All authenticated employee instances", "Enterprise OpenAI, Local HuggingFace"],
        ["L3", "Confidential PII", "VPC Isolated Vector Database only", "Self-Hosted Local Embeddings Only"],
        ["L4", "Strictly Secret / Trade Secret", "PROHIBITED from LLM/RAG Indexing", "None (No AI Indexing Permitted)"]
    ]
    t = Table(data_table, colWidths=[40, 110, 180, 170])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#e2e8f0')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
    ]))
    story.append(t)
    story.append(Spacer(1, 15))
    
    story.append(PageBreak()) # Moving to Page 2
    
    # Page 2
    story.append(Paragraph("4. RAG Vector Database & Document Storage Rules", h1_style))
    story.append(Paragraph("4.1 Retention Period: Document embeddings stored in vector databases (Chroma, Supabase pgvector, Pinecone, or FAISS) must undergo an automated cleanup cycle every 90 days unless tagged for permanent archivist retention.", body_style))
    story.append(Paragraph("4.2 Chunking Standards: To optimize retrieval accuracy and eliminate hallucination risks, document splitters must adhere to a maximum chunk size of 1,000 characters with an overlap of 150 characters. Chunk metadata MUST preserve document title, section heading, author, and exact page number.", body_style))
    story.append(Paragraph("4.3 Deduplication & Hashing: Every incoming PDF must be verified using SHA-256 checksum hashing prior to vector embedding to prevent duplicate index clutter and minimize embedding API costs.", body_style))
    
    story.append(Paragraph("5. Employee Responsibilities & Verification", h1_style))
    story.append(Paragraph("5.1 Human-in-the-Loop Review: All external communications, code generated by LLMs, and client-facing summaries produced by RAG chatbots must be reviewed and verified by a qualified human team member before publishing or execution.", body_style))
    story.append(Paragraph("5.2 Incident Reporting: Any suspected data leak, accidental upload of Level 4 Restricted data to an AI model, or hallucination leading to operational error must be reported to security@enterprise-ai.com within 2 hours of discovery.", body_style))
    
    story.append(Paragraph("6. Compliance Penalties", h1_style))
    story.append(Paragraph("Non-compliance with this policy may result in revocation of AI tool credentials, formal disciplinary action up to termination of employment, and legal liability under applicable data protection laws (GDPR, CCPA, and EU AI Act 2024).", body_style))
    
    doc.build(story)
    print(f"[SUCCESS] Generated sample policy PDF: {filename}")

def create_sample_technical_manual_pdf(filename="Technical_Architecture_Manual.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0284c7'),
        spaceBefore=14,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    story = []
    
    # Page 1
    story.append(Paragraph("System Architecture & RAG Pipeline Technical Manual", title_style))
    story.append(Paragraph("Author: Cloud Systems Architecture Group | Version: 2.1 | Module: High-Performance Vector Retrieval", body_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("1. System Overview & Tech Stack", h1_style))
    story.append(Paragraph("The platform is engineered as a microservice-based RAG infrastructure utilizing Python 3.11+, FastAPI web framework, LangChain 0.2+, and Supabase Vector (pgvector extension). The architecture prioritizes low latency (<250ms vector query turnaround), high precision retrieval (MRR > 0.85), and real-time streaming answers.", body_style))
    
    story.append(Paragraph("2. Vector Embedding Engine Benchmarks", h1_style))
    story.append(Paragraph("The vector store supports two embedding options configured dynamically per request:", body_style))
    story.append(Paragraph("• HuggingFace sentence-transformers/all-MiniLM-L6-v2: Outputs 384-dimensional dense vectors. Runs locally on CPU/GPU with zero external dependency. Best for high-throughput, zero-cost internal indexing.", body_style))
    story.append(Paragraph("• OpenAI text-embedding-3-small: Outputs 1536-dimensional dense vectors. Requires valid OPENAI_API_KEY. Delivers superior multi-lingual semantic retrieval for technical manuals and legal contracts.", body_style))
    
    story.append(Paragraph("3. Vector Database Architecture & Indexing", h1_style))
    story.append(Paragraph("3.1 Local Storage (ChromaDB): Default local engine persists embeddings on disk in SQLite + HNSW graph structure. Collection distance metric is set to Cosine Similarity (1 - cosine distance).", body_style))
    story.append(Paragraph("3.2 Cloud Production (Supabase pgvector): Enterprise instances connect via PostgreSQL driver with IVFFlat or HNSW vector index algorithms enabling sub-10ms similarity searches across 10,000,000+ vector chunks.", body_style))
    
    story.append(PageBreak()) # Page 2
    
    story.append(Paragraph("4. RAG Query Pipeline & Citation Formatting", h1_style))
    story.append(Paragraph("When a user query arrives at POST /api/chat:", body_style))
    story.append(Paragraph("1. The query text is sanitized and passed to the embedding engine to compute query_vector.", body_style))
    story.append(Paragraph("2. The Vector Database executes a top-K similarity search (default K=4) filtering out chunks with similarity score below threshold (default score threshold = 0.35).", body_style))
    story.append(Paragraph("3. Top chunks are formatted into a context block with explicit markers: [Source: filename, Page: X, Chunk ID: Y].", body_style))
    story.append(Paragraph("4. The augmented system prompt instructs the LLM: 'Answer strictly using the provided context. If the answer cannot be deduced from the context, state clearly that the information is unavailable.'", body_style))
    story.append(Paragraph("5. The streaming response generator streams text tokens while appending an explicit citations array containing source filename, page number, confidence match percentage, and matched text snippet.", body_style))
    
    story.append(Paragraph("5. TroubleShooting & Maintenance", h1_style))
    story.append(Paragraph("If retrieval precision degrades, run vector re-indexing with chunk size 750 and overlap 100. Check logs at /var/log/rag_service.log for embedding API rate limit errors.", body_style))
    
    doc.build(story)
    print(f"[SUCCESS] Generated sample technical PDF: {filename}")

if __name__ == "__main__":
    os.makedirs("sample_docs", exist_ok=True)
    create_sample_policy_pdf("sample_docs/Corporate_AI_Policy_2026.pdf")
    create_sample_technical_manual_pdf("sample_docs/Technical_Architecture_Manual.pdf")
