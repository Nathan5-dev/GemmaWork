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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-7 max-w-4xl mx-auto">
      
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">E-mail Professionnel</h3>
            <p className="text-xs sm:text-sm text-slate-500">Rédacteur rapide, percutant et poli</p>
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

      {/* Section 1: Objectif et Destinataire */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          1. Objectif & Destinataire
        </h4>

        {/* Subject or Goal (REQUIRED) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center space-x-1">
              <span>Objet ou Objectif Principal</span>
              <span className="text-indigo-600 font-bold">*</span>
            </label>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Obligatoire
            </span>
          </div>
          <input
            type="text"
            required
            placeholder="Ex: Demande de rendez-vous pour présentation de logiciel, Relance de facture..."
            value={formData.subjectOrGoal}
            onChange={(e) => {
              setFormData({ ...formData, subjectOrGoal: e.target.value });
              if (e.target.value.trim() !== '') setValidationError(null);
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>

        {/* Recipient Role */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              Rôle / Fonction du Destinataire
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Directeur des Ressources Humaines, Partenaire commercial, Client..."
            value={formData.recipientRole}
            onChange={(e) => setFormData({ ...formData, recipientRole: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Section 2: Contexte et Points Clés */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          2. Contexte & Argumentation
        </h4>

        {/* Context */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              {t.labels.context}
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <textarea
            rows={3}
            placeholder="Expliquez le contexte (ex: Suite à notre entretien téléphonique de mardi dernier, je vous recontacte au sujet...)"
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm leading-relaxed"
          />
        </div>

        {/* Key Points */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              Points Essentiels à Aborder
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <textarea
            rows={2}
            placeholder="Ex: Proposer un appel de 15 minutes ce jeudi matin, joindre la devis révisé, confirmer la disponibilité..."
            value={formData.keyPoints}
            onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
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
          label="Joindre un document de référence"
          hint="Importez un document PDF, DOCX ou TXT (max 10 Mo) pour baser la rédaction de l'e-mail"
        />
      </div>

      {/* Section 4: Ton, Longueur, Langue & Signature */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          4. Style & Signature
        </h4>

        {/* Grid 3 cols: Tone, Length, Language */}
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
              <option value="persuasif">{t.tones.persuasif}</option>
              <option value="direct">{t.tones.direct}</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-800 text-xs sm:text-sm block mb-1.5">
              {t.labels.length}
            </label>
            <select
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value as EmailLength })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm font-medium"
            >
              <option value="courte">{t.lengths.courte}</option>
              <option value="standard">{t.lengths.standard}</option>
              <option value="detaillee">{t.lengths.detaillee}</option>
            </select>
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

        {/* Sender Signature */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              {t.labels.senderSignature}
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Kambale Serge, Fondateur de Mwinda Tech (Goma)"
            value={formData.senderSignature}
            onChange={(e) => setFormData({ ...formData, senderSignature: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
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
              <span>Rédaction en cours...</span>
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

