import React, { useState } from 'react';
import { X, Sliders, Key, Cpu, Database, Save, Check } from 'lucide-react';
import { RagSettings } from '../types';

interface RagSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RagSettings;
  onSaveSettings: (newSettings: Partial<RagSettings>) => Promise<void>;
}

export const RagSettingsModal: React.FC<RagSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<RagSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 glass-panel shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">RAG Engine Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Embedding Provider Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Embedding Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, embedding_provider: 'huggingface' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  formData.embedding_provider === 'huggingface'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Cpu className="h-4 w-4" />
                <span>HuggingFace (Free)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, embedding_provider: 'openai' })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                  formData.embedding_provider === 'openai'
                    ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 shadow-md shadow-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Database className="h-4 w-4" />
                <span>OpenAI API</span>
              </button>
            </div>
          </div>

          {/* OpenAI API Key */}
          {formData.embedding_provider === 'openai' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.openai_api_key}
                  onChange={(e) => setFormData({ ...formData, openai_api_key: e.target.value })}
                  placeholder="sk-proj-..."
                  className="glass-input w-full rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <Key className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>
          )}

          {/* Chunk Size */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Chunk Size (characters)</span>
              <span className="font-mono text-cyan-400">{formData.chunk_size}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={formData.chunk_size}
              onChange={(e) => setFormData({ ...formData, chunk_size: parseInt(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Chunk Overlap */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Chunk Overlap (characters)</span>
              <span className="font-mono text-cyan-400">{formData.chunk_overlap}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={formData.chunk_overlap}
              onChange={(e) => setFormData({ ...formData, chunk_overlap: parseInt(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Top K Search Results */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Top-K Context Retrieval Chunks</span>
              <span className="font-mono text-cyan-400">{formData.top_k}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={formData.top_k}
              onChange={(e) => setFormData({ ...formData, top_k: parseInt(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50 mt-4"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save RAG Configuration</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
