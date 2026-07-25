import React, { useState } from 'react';
import { FileSpreadsheet, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { BusinessPlanPayload, Language, ReferenceFile } from '../types';
import { translations } from '../data/translations';
import { sampleBusinessPlans } from '../data/examples';
import { ReferenceFileUploader } from './ReferenceFileUploader';

interface BusinessPlanFormProps {
  currentLang: Language;
  onSubmit: (data: BusinessPlanPayload) => void;
  isLoading: boolean;
}

const drcLocations = [
  "Kinshasa", "Lubumbashi (Haut-Katanga)", "Goma (Nord-Kivu)", 
  "Bukavu (Sud-Kivu)", "Kisangani (Tshopo)", "Mbuji-Mayi (Kasaï-Oriental)", 
  "Matadi (Kongo-Central)", "Kananga (Kasaï-Central)", "Likasi (Haut-Katanga)", 
  "Kolwezi (Lualaba)", "Tshikapa (Kasaï)", "Kikwit (Kwilu)", "Bunia (Ituri)",
  "Mbandaka (Équateur)", "Uvira (Sud-Kivu)", "Beni / Butembo (Nord-Kivu)", "Autre province RDC"
];

const drcSectors = [
  "Agro-alimentaire & Transformation",
  "Commerce & Distribution",
  "Transport & Logistique",
  "Énergie & Solaire",
  "Nouvelles Technologies & Numérique",
  "Éducation & Formation",
  "Santé & Pharmacie",
  "Bâtiment & Travaux Publics (BTP)",
  "Services aux Entreprises & Consulting",
  "Mines & Sous-traitance",
  "Artisanat & Couture",
  "Autre secteur"
];

export const BusinessPlanForm: React.FC<BusinessPlanFormProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const t = translations[currentLang];

  const [formData, setFormData] = useState<BusinessPlanPayload>({
    projectName: '',
    ideaDescription: '',
    sector: '',
    location: 'Kinshasa',
    targetAudience: '',
    problemSolved: '',
    budget: '',
    language: currentLang,
    additionalInfo: ''
  });

  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSample = () => {
    const randomSample = sampleBusinessPlans[Math.floor(Math.random() * sampleBusinessPlans.length)];
    setFormData({
      ...randomSample,
      language: currentLang
    });
    setReferenceFile(null);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ideaDescription || formData.ideaDescription.trim() === '') {
      setValidationError("La description de l'idée d'affaires est obligatoire.");
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
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Générateur de Business Plan</h3>
            <p className="text-xs sm:text-sm text-slate-500">Concepteur guidé adapté au marché et contexte de la RDC</p>
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

      {/* Section 1: Identité du projet */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          1. Présentation de l'Entreprise ou du Projet
        </h4>

        {/* Project Name (Optional) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              Nom du Projet ou de l'Entreprise
            </label>
            <span className="text-[10px] text-slate-400 font-medium">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Manioc Express Kivu, Pharmacie Lumière Kinshasa, Lualaba Logistics..."
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>

        {/* Idea Description (REQUIRED) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center space-x-1">
              <span>Description de l'Idée d'Affaires</span>
              <span className="text-indigo-600 font-bold">*</span>
            </label>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Obligatoire
            </span>
          </div>
          <textarea
            rows={5}
            required
            placeholder="Décrivez votre projet en détail : Que voulez-vous produire, transformer ou vendre ? Comment s'organisera la distribution ou les opérations au quotidien ?"
            value={formData.ideaDescription}
            onChange={(e) => {
              setFormData({ ...formData, ideaDescription: e.target.value });
              if (e.target.value.trim() !== '') setValidationError(null);
            }}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Section 2: Contexte de marché RDC */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          2. Secteur, Localisation & Cibles
        </h4>

        {/* Grid 2 cols: Sector & Location */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                Secteur d'Activité
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            >
              <option value="">Sélectionnez un secteur...</option>
              {drcSectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                Ville / Province en RDC
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            >
              {drcLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid 2 cols: Target Audience & Problem Solved */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                Clientèle / Bénéficiaires Cibles
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Ménages urbains, étudiants, PME, ONG, restaurants..."
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                Problème Résolu
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <input
              type="text"
              placeholder="Ex: Pénurie de produits frais, coût élevé de l'énergie, manque de formation..."
              value={formData.problemSolved}
              onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>
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
          label="Joindre une étude de marché, note ou document (Facultatif)"
          hint="Importez un document PDF, DOCX ou TXT (max 10 Mo) pour nourrir les données du business plan"
        />
      </div>

      {/* Section 4: Budget & Langue */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
          4. Budget & Langue de Rédaction
        </h4>

        {/* Grid 2 cols: Budget & Language */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm">
                Budget Estimé de Démarrage
              </label>
              <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
            </div>
            <input
              type="text"
              placeholder="Ex: 5,000 USD, 15,000 USD, 50,000 USD..."
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center space-x-1">
                <span>{t.labels.outputLanguage}</span>
                <span className="text-indigo-600 font-bold">*</span>
              </label>
            </div>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm font-medium"
            >
              <option value="fr">Français (RDC)</option>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-800 text-xs sm:text-sm">
              Informations Complémentaires
            </label>
            <span className="text-[10px] text-slate-400">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Partenariat prévu avec une coopérative agricole, matériel déjà disponible..."
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 text-slate-900 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span>Génération du Business Plan en cours...</span>
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

