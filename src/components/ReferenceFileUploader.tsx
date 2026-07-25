import React, { useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { ReferenceFile } from '../types';

interface ReferenceFileUploaderProps {
  referenceFile: ReferenceFile | null;
  onFileChange: (file: ReferenceFile | null) => void;
  label?: string;
  hint?: string;
}

export const ReferenceFileUploader: React.FC<ReferenceFileUploaderProps> = ({
  referenceFile,
  onFileChange,
  label = "Document de référence (Facultatif)",
  hint = "PDF, DOCX ou TXT jusqu'à 10 Mo. Le contenu sera extrait comme contexte."
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const processFile = (file: File) => {
    setError(null);

    // Validate size (10 MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("Le fichier dépasse la taille maximale autorisée de 10 Mo.");
      return;
    }

    // Validate extension
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setError("Format de fichier non pris en charge. Veuillez sélectionner un fichier PDF, DOCX ou TXT.");
      return;
    }

    // Read as Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      onFileChange({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        base64Data,
      });
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier. Veuillez réessayer.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-800 text-xs flex items-center space-x-1.5">
          <span>{label}</span>
          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Optionnel</span>
        </label>
        <div className="flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 space-x-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Non conservé après extraction</span>
        </div>
      </div>

      {referenceFile ? (
        <div className="flex items-center justify-between p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{referenceFile.name}</p>
              <p className="text-[11px] text-indigo-700 font-medium">{formatSize(referenceFile.size)} • Prêt pour analyse Gemma</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="p-1.5 hover:bg-indigo-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            title="Supprimer le fichier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
              : 'border-slate-200 hover:border-indigo-300 bg-slate-50/60 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Glissez-déposez un fichier ou <span className="text-indigo-600 underline">parcourez</span>
            </p>
            <p className="text-[11px] text-slate-400">{hint}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
