"""
FastAPI Backend Server for RAG Chatbot Application.
Provides REST API endpoints for document uploads, vector indexing,
RAG chat queries, vector store analytics, and settings.
"""

import os
import shutil
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from rag_engine import RAGSystem
from generate_sample_pdf import create_sample_policy_pdf, create_sample_technical_manual_pdf

app = FastAPI(
    title="RAG Intelligent Chatbot API",
    description="Context-Aware PDF Chatbot powered by Retrieval-Augmented Generation & LangChain",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global RAG Instance
rag_instance = RAGSystem()
UPLOAD_DIR = "./uploaded_pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST) and os.path.exists(os.path.join(FRONTEND_DIST, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="static_assets")

class ChatQueryRequest(BaseModel):
    query: str

class SettingsUpdateRequest(BaseModel):
    chunk_size: Optional[int] = 700
    chunk_overlap: Optional[int] = 150
    top_k: Optional[int] = 4
    score_threshold: Optional[float] = 0.15
    embedding_provider: Optional[str] = "huggingface"
    openai_api_key: Optional[str] = ""

@app.get("/api/health")
def read_health():
    return {
        "status": "online",
        "app": "RAG Intelligent Chatbot Server",
        "version": "1.0.0",
        "indexed_documents": len(rag_instance.indexed_documents),
        "total_vector_chunks": len(rag_instance.vector_store.chunks)
    }

@app.get("/")
def read_root():
    index_file = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return read_health()

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF file, extract text chunks, generate embeddings, and index into Vector Store."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    res = rag_instance.process_pdf(file_path)
    if res.get("status") == "error":
        raise HTTPException(status_code=500, detail=res.get("message", "Error processing PDF"))
        
    return {
        "message": f"Successfully processed and indexed {file.filename}",
        "document": res["document"],
        "total_system_chunks": len(rag_instance.vector_store.chunks)
    }

@app.post("/api/chat")
def chat_query(req: ChatQueryRequest):
    """Execute RAG pipeline for user query and return grounded answer with citations."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
        
    response = rag_instance.query(req.query)
    return response

@app.get("/api/documents")
def list_documents():
    """List all currently indexed PDF documents and chunk statistics."""
    docs = list(rag_instance.indexed_documents.values())
    total_chunks = len(rag_instance.vector_store.chunks)
    return {
        "documents": docs,
        "total_documents": len(docs),
        "total_chunks": total_chunks
    }

@app.delete("/api/clear")
def clear_vector_store():
    """Clear all vector embeddings and indexed document metadata."""
    rag_instance.clear_all()
    # Remove files in upload dir
    for f in os.listdir(UPLOAD_DIR):
        fp = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(fp):
            os.remove(fp)
    return {"message": "Vector store and document index reset successfully."}

@app.get("/api/settings")
def get_settings():
    """Get current RAG engine settings."""
    # Hide raw API key string for security in response
    s = dict(rag_instance.settings)
    if s.get("openai_api_key"):
        s["openai_api_key"] = s["openai_api_key"][:4] + "..." + s["openai_api_key"][-4:]
    return s

@app.post("/api/settings")
def update_settings(req: SettingsUpdateRequest):
    """Update RAG settings dynamically."""
    new_settings = req.dict(exclude_unset=True)
    rag_instance.update_settings(new_settings)
    return {"message": "Settings updated successfully", "settings": rag_instance.settings}

@app.post("/api/load-samples")
def load_sample_docs():
    """Generate and load default sample PDF documents for testing."""
    sample_dir = "./sample_docs"
    os.makedirs(sample_dir, exist_ok=True)
    
    p1 = os.path.join(sample_dir, "Corporate_AI_Policy_2026.pdf")
    p2 = os.path.join(sample_dir, "Technical_Architecture_Manual.pdf")
    
    create_sample_policy_pdf(p1)
    create_sample_technical_manual_pdf(p2)
    
    res1 = rag_instance.process_pdf(p1)
    res2 = rag_instance.process_pdf(p2)
    
    return {
        "message": "Sample documents generated and indexed successfully",
        "documents": [res1.get("document"), res2.get("document")],
        "total_chunks": len(rag_instance.vector_store.chunks)
    }

# SPA Catch-all Fallback Route
if os.path.exists(FRONTEND_DIST):
    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        target_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.exists(target_path) and os.path.isfile(target_path):
            return FileResponse(target_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"status": "error", "message": "Frontend index.html not found"}

# Export Mangum handler for AWS Lambda / Firebase Cloud Functions serverless execution
try:
    from mangum import Mangum
    from firebase_functions import https_fn
    
    handler = Mangum(app)

    @https_fn.on_request()
    def api(req: https_fn.Request) -> https_fn.Response:
        return handler(req)
except Exception:
    handler = None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



