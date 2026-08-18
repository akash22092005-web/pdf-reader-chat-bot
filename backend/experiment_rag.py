"""
RAG Concepts Review & Interactive Experimentation Script.
Demonstrates step-by-step:
1. Document Ingestion from PDF
2. Text Chunking with Recursive Splitter & Page Metadata
3. Generating Vector Store Embeddings (HuggingFace / Local Dense Embedder)
4. Cosine Similarity Vector Search & Top-K Retrieval
5. RAG Augmented Answer Generation with Exact Page Citations
"""

import os
import sys
from generate_sample_pdf import create_sample_policy_pdf, create_sample_technical_manual_pdf
from rag_engine import RAGSystem, PDFProcessor, VectorStoreManager

def run_rag_experiment():
    print("=" * 70)
    print("[STEP 1] REVIEW RAG ARCHITECTURE & CONCEPTS")
    print("=" * 70)
    print("Retrieval-Augmented Generation (RAG) empowers LLMs to query domain-specific")
    print("unstructured PDF documents accurately by combining:")
    print("  * Document Loaders (PyPDF / LangChain)")
    print("  * Text Splitter (Recursive character chunking with overlap)")
    print("  * Embedding Model (Dense vector representations of chunks)")
    print("  * Vector Database (Indexing & Cosine Similarity search)")
    print("  * Grounded Synthesis (Prompting LLM strictly with retrieved context)")
    print()

    print("=" * 70)
    print("[STEP 2] CREATING SAMPLE PDF DOCUMENTS")
    print("=" * 70)
    os.makedirs("sample_docs", exist_ok=True)
    policy_pdf = "sample_docs/Corporate_AI_Policy_2026.pdf"
    manual_pdf = "sample_docs/Technical_Architecture_Manual.pdf"
    
    create_sample_policy_pdf(policy_pdf)
    create_sample_technical_manual_pdf(manual_pdf)
    print()

    print("=" * 70)
    print("[STEP 3] CHUNKING PDFS & CREATING VECTOR STORE EMBEDDINGS")
    print("=" * 70)
    rag = RAGSystem()
    
    print(f"\nProcessing '{policy_pdf}'...")
    res1 = rag.process_pdf(policy_pdf)
    print(f"Result: {res1}")

    print(f"\nProcessing '{manual_pdf}'...")
    res2 = rag.process_pdf(manual_pdf)
    print(f"Result: {res2}")
    
    total_chunks = len(rag.vector_store.chunks)
    print(f"\n[OK] Total Chunks Indexed into Vector Store: {total_chunks}")
    
    # Inspect a sample chunk & its embedding
    sample_chunk = rag.vector_store.chunks[0]
    sample_vec = sample_chunk.metadata.get("vector", [])
    print("\n--- Sample Chunk Metadata ---")
    print(f"ID: {sample_chunk.chunk_id}")
    print(f"Source PDF: {sample_chunk.metadata['source']}")
    print(f"Page Number: {sample_chunk.metadata['page']}")
    print(f"Embedding Vector Dim: {len(sample_vec)} dimensions")
    print(f"Text Preview:\n\"{sample_chunk.text[:180]}...\"")
    print()

    print("=" * 70)
    print("[STEP 4] EXPERIMENTING WITH RAG SIMILARITY SEARCH & RETRIEVAL")
    print("=" * 70)
    
    test_queries = [
        "What are the 4 data classification security levels for RAG vector stores?",
        "What embedding models are benchmarked in the Technical Architecture manual?",
        "What happens if level 4 restricted data is uploaded to an AI model?",
        "How often must document embeddings undergo cleanup in the vector store?"
    ]

    for idx, q in enumerate(test_queries, 1):
        print(f"\n----------------------------------------------------------------------")
        print(f"[TEST QUERY {idx}] '{q}'")
        print(f"----------------------------------------------------------------------")
        response = rag.query(q)
        
        print("\n[RAG GENERATED RESPONSE]")
        print(response["answer"])
        
        print("\n[RETRIEVED SOURCE CITATIONS]")
        for cit in response["citations"]:
            print(f"  * [Match: {cit['match_percent']}%] Source: {cit['source']} | Page {cit['page']}")
            print(f"    Snippet: \"{cit['snippet'][:120]}...\"")
            
    print("\n" + "=" * 70)
    print("[SUCCESS] RAG EXPERIMENT COMPLETED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_rag_experiment()
