import React from 'react';
import { FileText, Layers, BookOpen, HardDrive, CheckCircle2 } from 'lucide-react';
import { IndexedDocument } from '../types';

interface DocumentListProps {
  documents: IndexedDocument[];
  totalChunks: number;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, totalChunks }) => {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-6 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-400">No PDF documents indexed yet</p>
        <p className="text-xs text-slate-500 mt-1">Upload a PDF above or click "Sample PDFs" to populate test data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Indexed Documents ({documents.length})
        </h3>
        <span className="text-xs text-cyan-400 font-mono font-medium">
          {totalChunks} Chunks in DB
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-slate-700 hover:bg-slate-900 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                  {doc.filename}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-slate-500" />
                    {doc.total_pages} {doc.total_pages === 1 ? 'Page' : 'Pages'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono text-cyan-400">
                    <Layers className="h-3 w-3 text-cyan-500" />
                    {doc.total_chunks} Chunks
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded-md shrink-0">
              <CheckCircle2 className="h-3 w-3" />
              <span>Indexed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
