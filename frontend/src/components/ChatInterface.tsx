import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { CitationCard } from './CitationCard';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isQuerying: boolean;
  hasDocuments: boolean;
}

const SAMPLE_QUESTIONS = [
  "What are the data classification security levels for RAG vector stores?",
  "What embedding models are benchmarked in the Technical Architecture Manual?",
  "What is the policy retention period for vector store document embeddings?",
  "How does the system prevent AI hallucinations when querying policy documents?"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isQuerying,
  hasDocuments
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isQuerying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isQuerying) return;
    const q = inputQuery;
    setInputQuery('');
    await onSendMessage(q);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 glass-panel shadow-2xl overflow-hidden">
      
      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
              <Bot className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Context-Aware RAG Assistant
            </h2>
            <p className="text-xs text-slate-400 max-w-md mb-6">
              Ask any question about your uploaded PDF policy documents or technical manuals. Answers are computed with strict context grounding and source page citations.
            </p>

            {/* Quick Prompts */}
            <div className="w-full max-w-lg space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Suggested Questions to Try:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(q)}
                    disabled={isQuerying}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-left text-xs font-medium text-slate-300 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300 transition-all group disabled:opacity-50"
                  >
                    <span>"{q}"</span>
                    <Sparkles className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10 text-[11px] opacity-80">
                  <span className="font-semibold">
                    {msg.role === 'user' ? 'You' : 'RAG Assistant'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-slate-400 hover:text-white transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Citations Card */}
                {msg.citations && msg.citations.length > 0 && (
                  <CitationCard citations={msg.citations} />
                )}
              </div>

              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isQuerying && (
          <div className="flex gap-4 items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-800 px-4 py-3 text-xs text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
              <span>Retrieving vector embeddings & synthesizing answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 p-3 sm:p-4">
        {!hasDocuments && (
          <div className="mb-2 flex items-center gap-2 rounded-lg bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 text-xs text-amber-300">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>No documents indexed yet. Upload a PDF or click "Sample PDFs" for instant testing.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about your PDF documents (e.g. 'What is the security policy?')..."
            disabled={isQuerying}
            className="glass-input flex-1 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isQuerying || !inputQuery.trim()}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:shadow-none shrink-0"
          >
            {isQuerying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline mr-1">Ask RAG</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
};
