import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Layers } from 'lucide-react';

interface PdfDropzoneProps {
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const PdfDropzone: React.FC<PdfDropzoneProps> = ({ onFileUpload, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMsg(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setErrorMsg('Only PDF files are supported for vector embedding.');
      return;
    }
    try {
      await onFileUpload(file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process PDF.');
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
        } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-2">
            <div className="relative mb-3 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
              <Layers className="h-4 w-4 text-indigo-300 absolute" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Chunking & Generating Vector Embeddings...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Extracting text, running LangChain splitters & updating vector store
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-full bg-slate-800/80 p-3.5 text-cyan-400 border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Drop PDF file here or <span className="text-cyan-400 underline">browse</span>
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Supports policy documents, technical manuals, whitepapers & contracts.
            </p>
          </>
        )}

        {errorMsg && (
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 px-3 py-1.5 text-xs text-rose-300">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
