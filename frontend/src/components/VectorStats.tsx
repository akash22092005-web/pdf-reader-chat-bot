import React from 'react';
import { Database, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import { VectorStoreStats } from '../types';

interface VectorStatsProps {
  stats: VectorStoreStats;
}

export const VectorStats: React.FC<VectorStatsProps> = ({ stats }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200">Vector Store & Embedding Status</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
          <ShieldCheck className="h-3 w-3" />
          {stats.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-2.5">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Embeddings</p>
          <p className="text-base font-black font-mono text-cyan-400 mt-0.5">{stats.total_chunks}</p>
        </div>

        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-2.5">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Indexed PDFs</p>
          <p className="text-base font-black font-mono text-indigo-400 mt-0.5">{stats.total_documents}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <Cpu className="h-3 w-3 text-cyan-500" />
          Provider: <strong className="text-slate-200 capitalize">{stats.embedding_provider}</strong>
        </span>
        <span className="flex items-center gap-1 font-mono text-slate-400">
          <HardDrive className="h-3 w-3 text-purple-400" />
          Cosine DB
        </span>
      </div>
    </div>
  );
};
