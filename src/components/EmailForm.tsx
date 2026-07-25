import React, { useState } from 'react';
import { Mail, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { EmailPayload, Tone, EmailLength, Language, ReferenceFile } from '../types';
import { translations } from '../data/translations';
import { sampleEmails } from '../data/examples';
import { ReferenceFileUploader } from './ReferenceFileUploader';

interface EmailFormProps {
  currentLang: Language;
  onSubmit: (data: EmailPayload) => void;
  isLoading: boolean;
}

export const EmailForm: React.FC<EmailFormProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const t = translations[currentLang];

  const [formData, setFormData] = useState<EmailPayload>({
    subjectOrGoal: '',
    recipientRole: '',
    context: '',
    keyPoints: '',
    language: currentLang,
    tone: 'formel',
    length: 'standard',
    senderSignature: ''
  });

  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSample = () => {
    const randomSample = sampleEmails[Math.floor(Math.random() * sampleEmails.length)];
    setFormData({
      ...randomSample,
      language: currentLang
    });
    setReferenceFile(null);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectOrGoal || formData.subjectOrGoal.trim() === '') {
      setValidationError("L'objet ou l'objectif de l'e-mail est obligatoire.");
      return;
    }
    setValidationError(null);
    onSubmit({
      ...formData,
      referenceFile: referenceFile || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-8 shadow-xs space-y-6 max-w-4xl mx-auto transition-colors">
      
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl">E-mails Professionnels</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rédacteur de messages clairs, formels et efficaces</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSample}
          className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Exemple pré-rempli</span>
        </button>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm rounded-xl flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Section 1: Objectif */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">1</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Objectif & Destinataire
          </h4>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs flex items-center space-x-1">
            <span>Objet ou Objectif Principal</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Demande de partenariat commercial, Relance d'offre..."
            value={formData.subjectOrGoal}
            onChange={(e) => {
              setFormData({ ...formData, subjectOrGoal: e.target.value });
              if (e.target.value.trim() !== '') setValidationError(null);
            }}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">Destinataire (Rôle ou Fonction)</label>
          <input
            type="text"
            placeholder="Ex: Directeur Général, Responsable Achats..."
            value={formData.recipientRole}
            onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Section 2: Contexte */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">2</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Contexte & Message
          </h4>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">{t.labels.context}</label>
          <textarea
            rows={3}
            placeholder="Expliquez brièvement le contexte du message..."
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Section 3: Document de Référence */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">3</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Fichier de Référence (Facultatif)
          </h4>
        </div>
        <ReferenceFileUploader
          referenceFile={referenceFile}
          onFileChange={setReferenceFile}
          label="Ajouter un document de référence"
          hint="PDF, DOCX ou TXT (max 10 Mo)"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Rédaction en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Générer l'e-mail (Gemma)</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
