import React, { useState } from 'react';
import { Citation } from '../types';
import { FileText, ChevronDown, ChevronUp, Quote, ExternalLink } from 'lucide-react';

interface CitationCardProps {
  citations: Citation[];
}

export const CitationCard: React.FC<CitationCardProps> = ({ citations }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
        <Quote className="h-3.5 w-3.5 text-cyan-400" />
        <span>Grounded Document Citations ({citations.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((cit) => {
          const isExpanded = expandedId === cit.id;
          return (
            <div
              key={cit.id}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 transition-all hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-500/20 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                    [{cit.id}]
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {cit.source}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">
                        Page {cit.page}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        {cit.match_percent}% Match
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : cit.id)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  title={isExpanded ? 'Collapse snippet' : 'View snippet'}
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] leading-relaxed text-slate-300 bg-slate-950/80 p-2 rounded border font-mono">
                  "{cit.snippet}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
