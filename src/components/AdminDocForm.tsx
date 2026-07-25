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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-7 max-w-4xl mx-auto">
      
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Documents Administratifs</h3>
            <p className="text-xs sm:text-sm text-slate-500">Concepteur officiel et institutionnel adapté à la RDC</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSample}
          className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3.5 py-2 rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Exemple RDC</span>
        </button>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Section 1: Type et Objet */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          1. Type de Document & Identités
        </h4>

        {/* Document Type Selector */}
        <div>
          <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
            {t.labels.docType} <span className="text-indigo-600 font-bold">*</span>
          </label>
          <select
            value={formData.docType}
            onChange={(e) => setFormData({ ...formData, docType: e.target.value as AdminDocType })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm font-medium"
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

        {formData.docType === 'autre' && (
          <div>
            <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
              {t.labels.customDocType} <span className="text-indigo-600 font-bold">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Procès-verbal de réunion, Convocation officielle..."
              value={formData.customDocType}
              onChange={(e) => setFormData({ ...formData, customDocType: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>
        )}

        {/* Grid 2 cols: Sender & Recipient */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                {t.labels.senderInfo}
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Mulamba Jean-Paul, Étudiant UNIKIN..."
              value={formData.senderInfo}
              onChange={(e) => setFormData({ ...formData, senderInfo: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                {t.labels.recipientInfo}
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Monsieur le Directeur Général de la SNEL..."
              value={formData.recipientInfo}
              onChange={(e) => setFormData({ ...formData, recipientInfo: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Contenu et Contexte */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          2. Objet & Contexte Détallé
        </h4>

        {/* Subject / Objet */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              {t.labels.subject}
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Demande de stage académique pour la période de Septembre à Octobre..."
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>

        {/* Context */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              {t.labels.context}
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <textarea
            rows={4}
            placeholder="Expliquez le contexte : Pourquoi écrivez-vous ce document ? Quelles sont les attentes principales ?"
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm leading-relaxed"
          />
        </div>

        {/* Details to Include */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              {t.labels.detailsToInclude}
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <textarea
            rows={2}
            placeholder="Ex: Dates précises, pièces jointes à mentionner, références légales ou antécédents..."
            value={formData.detailsToInclude}
            onChange={(e) => setFormData({ ...formData, detailsToInclude: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Section 3: Reference Document Upload */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          3. Document de Référence (Facultatif)
        </h4>
        <ReferenceFileUploader
          referenceFile={referenceFile}
          onFileChange={setReferenceFile}
          label="Ajouter un document de référence"
          hint="Importez un document PDF, DOCX ou TXT (max 10 Mo) pour enrichir la génération"
        />
      </div>

      {/* Section 4: Style, Date & Langue */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          4. Style & Formatage
        </h4>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
              {t.labels.tone}
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value as Tone })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm font-medium"
            >
              <option value="formel">{t.tones.formel}</option>
              <option value="neutre">{t.tones.neutre}</option>
              <option value="cordial">{t.tones.cordial}</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
              {t.labels.dateLocation}
            </label>
            <input
              type="text"
              placeholder="Ex: Kinshasa, le 25 Juillet 2026"
              value={formData.dateLocation}
              onChange={(e) => setFormData({ ...formData, dateLocation: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
              {t.labels.outputLanguage}
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm font-medium"
            >
              <option value="fr">Français (RDC)</option>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>Génération en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Générer avec Gemma</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};

