export interface IndexedDocument {
  filename: string;
  total_chunks: number;
  total_pages: number;
  file_size: number;
}

export interface Citation {
  id: number;
  source: string;
  page: number;
  match_percent: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  retrieved_count?: number;
}

export interface RagSettings {
  chunk_size: number;
  chunk_overlap: number;
  top_k: number;
  score_threshold: number;
  embedding_provider: string;
  openai_api_key: string;
}

export interface VectorStoreStats {
  total_documents: number;
  total_chunks: number;
  embedding_provider: string;
  status: string;
}
