import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PdfDropzone } from './components/PdfDropzone';
import { DocumentList } from './components/DocumentList';
import { ChatInterface } from './components/ChatInterface';
import { RagSettingsModal } from './components/RagSettingsModal';
import { IndexedDocument, ChatMessage, RagSettings } from './types';
import { AlertCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [documents, setDocuments] = useState<IndexedDocument[]>([]);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settings, setSettings] = useState<RagSettings>({
    chunk_size: 700,
    chunk_overlap: 150,
    top_k: 4,
    score_threshold: 0.15,
    embedding_provider: 'huggingface',
    openai_api_key: ''
  });

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Documents and Settings on Mount
  useEffect(() => {
    fetchDocuments();
    fetchSettings();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        setTotalChunks(data.total_chunks || 0);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to process and index PDF');
      }

      const data = await res.json();
      showNotify('success', `Indexed "${file.name}" into Vector Store!`);
      await fetchDocuments();
    } catch (err: any) {
      showNotify('error', err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSamples = async () => {
    setIsLoadingSamples(true);
    try {
      const res = await fetch('/api/load-samples', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to load sample documents');
      const data = await res.json();
      showNotify('success', 'Loaded Corporate AI Policy & Technical Architecture sample PDFs!');
      await fetchDocuments();
    } catch (err: any) {
      showNotify('error', err.message || 'Error loading samples');
    } finally {
      setIsLoadingSamples(false);
    }
  };

  const handleClearStore = async () => {
    if (!window.confirm('Are you sure you want to clear all indexed vector embeddings and documents?')) return;
    try {
      const res = await fetch('/api/clear', { method: 'DELETE' });
      if (res.ok) {
        showNotify('success', 'Vector store index cleared.');
        setDocuments([]);
        setTotalChunks(0);
        setMessages([]);
      }
    } catch (err) {
      showNotify('error', 'Failed to clear vector store.');
    }
  };

  const handleSendMessage = async (query: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsQuerying(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'RAG Query Failed');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        retrieved_count: data.retrieved_count,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      showNotify('error', err.message || 'Error executing RAG search');
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Error executing query: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSaveSettings = async (newSettings: Partial<RagSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        showNotify('success', 'RAG settings updated successfully.');
      }
    } catch (err) {
      showNotify('error', 'Failed to update RAG settings.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        indexedDocCount={documents.length}
        totalChunks={totalChunks}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLoadSamples={handleLoadSamples}
        onClearStore={handleClearStore}
        isLoadingSamples={isLoadingSamples}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold shadow-2xl border ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
                : 'bg-rose-950/90 text-rose-200 border-rose-800'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <main className="flex-1 mx-auto w-full max-w-7xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4.5rem)]">
        
        {/* Left Sidebar: Document Management & Vector Hub (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 overflow-y-auto pr-1">
          
          {/* PDF Dropzone */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>Document Ingestion</span>
            </h2>
            <PdfDropzone onFileUpload={handleFileUpload} isUploading={isUploading} />
          </div>

          {/* Indexed Documents List */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex-1">
            <DocumentList documents={documents} totalChunks={totalChunks} />
          </div>

        </div>

        {/* Right Main Panel: RAG Conversational Chat Workspace (8 Cols) */}
        <div className="lg:col-span-8 h-full">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isQuerying={isQuerying}
            hasDocuments={documents.length > 0}
          />
        </div>

      </main>

      {/* RAG Settings Modal */}
      <RagSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
};

export default App;
