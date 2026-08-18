import React from 'react';
import { Bot, Settings, Database, Sparkles, FileText, Trash2, Cpu } from 'lucide-react';
import { RagSettings } from '../types';

interface NavbarProps {
  indexedDocCount: number;
  totalChunks: number;
  settings: RagSettings;
  onOpenSettings: () => void;
  onLoadSamples: () => void;
  onClearStore: () => void;
  isLoadingSamples: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  indexedDocCount,
  totalChunks,
  settings,
  onOpenSettings,
  onLoadSamples,
  onClearStore,
  isLoadingSamples
}) => {
  return (
    <header className="glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                RAG<span className="gradient-text font-black">Mind</span>
              </h1>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                v1.0 LangChain
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Context-Aware PDF Retrieval-Augmented Generation
            </p>
          </div>
        </div>

        {/* Stats Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Model Indicator */}
          <div className="hidden md:flex items-center gap-1.5 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs border border-slate-800 text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-medium capitalize">{settings.embedding_provider} Embeddings</span>
          </div>

          {/* Indexing Stats */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs border border-slate-800 text-slate-300">
            <Database className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-semibold text-white">{totalChunks}</span>
            <span className="text-slate-400 hidden sm:inline">Chunks</span>
            <span className="text-slate-600">|</span>
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-semibold text-white">{indexedDocCount}</span>
            <span className="text-slate-400 hidden sm:inline">PDFs</span>
          </div>

          {/* Quick Load Sample Documents */}
          <button
            onClick={onLoadSamples}
            disabled={isLoadingSamples}
            title="Load sample policy and technical manuals"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 text-xs font-medium transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isLoadingSamples ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sample PDFs</span>
          </button>

          {/* Clear Store Button */}
          {indexedDocCount > 0 && (
            <button
              onClick={onClearStore}
              title="Reset vector store"
              className="flex items-center justify-center rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 p-1.5 text-xs transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 px-3 py-1.5 text-xs font-medium transition-all"
          >
            <Settings className="h-3.5 w-3.5 text-slate-300" />
            <span className="hidden sm:inline">Settings</span>
          </button>

        </div>

      </div>
    </header>
  );
};
