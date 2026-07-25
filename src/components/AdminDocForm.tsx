import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminDocPayload, AdminDocType, Tone, Language, ReferenceFile } from '../types';
import { translations } from '../data/translations';
import { sampleAdminDocs } from '../data/examples';
import { ReferenceFileUploader } from './ReferenceFileUploader';

interface AdminDocFormProps {
  currentLang: Language;
  onSubmit: (data: AdminDocPayload) => void;
  isLoading: boolean;
}

export const AdminDocForm: React.FC<AdminDocFormProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const t = translations[currentLang];

  const [formData, setFormData] = useState<AdminDocPayload>({
    docType: 'demande',
    customDocType: '',
    language: currentLang,
    senderInfo: '',
    recipientInfo: '',
    subject: '',
    context: '',
    detailsToInclude: '',
    tone: 'formel',
    dateLocation: ''
  });

  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSample = () => {
    const randomSample = sampleAdminDocs[Math.floor(Math.random() * sampleAdminDocs.length)];
    setFormData({
      ...randomSample,
      language: currentLang
    });
    setReferenceFile(null);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl">Documents Administratifs</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rédaction officielle et administrative rigoureuse</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSample}
          className="flex items-center justify-center space-x-2 text-xs font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 border border-blue-200 dark:border-blue-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Exemple pré-rempli</span>
        </button>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm rounded-xl flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Section 1: Type & Identités */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">1</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Type de Document & Identités
          </h4>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs flex items-center space-x-1">
            <span>{t.labels.docType}</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold">*</span>
          </label>
          <select
            value={formData.docType}
            onChange={(e) => setFormData({ ...formData, docType: e.target.value as AdminDocType })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lettre_officielle">{t.docTypes.lettre_officielle}</option>
            <option value="demande">{t.docTypes.demande}</option>
            <option value="rapport_court">{t.docTypes.rapport_court}</option>
            <option value="attestation">{t.docTypes.attestation}</option>
            <option value="note_service">{t.docTypes.note_service}</option>
            <option value="lettre_motivation">{t.docTypes.lettre_motivation}</option>
            <option value="autre">{t.docTypes.autre}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">{t.labels.senderInfo}</label>
            <input
              type="text"
              placeholder="Ex: Nom, Prénom, Organisme..."
              value={formData.senderInfo}
              onChange={(e) => setFormData({ ...formData, senderInfo: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">{t.labels.recipientInfo}</label>
            <input
              type="text"
              placeholder="Ex: Destinataire, Titre ou Service..."
              value={formData.recipientInfo}
              onChange={(e) => setFormData({ ...formData, recipientInfo: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contexte */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">2</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Objet & Contexte
          </h4>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">{t.labels.subject}</label>
          <input
            type="text"
            placeholder="Ex: Demande de partenariat / Note d'information..."
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">{t.labels.context}</label>
          <textarea
            rows={4}
            placeholder="Expliquez le contexte ou l'objectif principal..."
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Section 3: Document de Référence */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">3</span>
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
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Génération du document en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Générer le document (Gemma)</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
