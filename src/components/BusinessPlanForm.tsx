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
  "Mbandaka (Équateur)", "Uvira (Sud-Kivu)", "Beni / Butembo (Nord-Kivu)", "Autre province"
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-8 shadow-xs space-y-6 max-w-4xl mx-auto transition-colors">
      
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg sm:text-xl">Générateur de Business Plan</h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Rédacteur guidé structuré pour vos projets d'affaires</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSample}
          className="flex items-center justify-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-200 dark:border-amber-800 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Exemple pré-rempli</span>
        </button>
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm rounded-xl flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Section 1: Identité du projet */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold text-xs flex items-center justify-center">1</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Présentation du Projet
          </h4>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">
              Nom du Projet ou de l'Entreprise
            </label>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{t.labels.optional}</span>
          </div>
          <input
            type="text"
            placeholder="Ex: Agence Numérique, Pharmacie Lumière, Agro-Express..."
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs flex items-center space-x-1">
              <span>Description de l'Idée d'Affaires</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">*</span>
            </label>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
              Obligatoire
            </span>
          </div>
          <textarea
            rows={4}
            required
            placeholder="Décrivez votre projet en détail : Que voulez-vous produire, transformer ou vendre ?"
            value={formData.ideaDescription}
            onChange={(e) => {
              setFormData({ ...formData, ideaDescription: e.target.value });
              if (e.target.value.trim() !== '') setValidationError(null);
            }}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Section 2: Secteur et Cible */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold text-xs flex items-center justify-center">2</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Secteur & Localisation
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">Secteur d'Activité</label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Sélectionnez un secteur...</option>
              {drcSectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">Ville / Région</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {drcLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">Clientèle Cible</label>
            <input
              type="text"
              placeholder="Ex: Particuliers, PME, étudiants..."
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-xs">Budget Estimé</label>
            <input
              type="text"
              placeholder="Ex: 5,000 $, 20,000 $..."
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Document de Référence */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700/80 pb-2.5">
          <span className="w-5 h-5 rounded bg-amber-600 text-white font-bold text-xs flex items-center justify-center">3</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
            Fichier de Référence (Facultatif)
          </h4>
        </div>
        <ReferenceFileUploader
          referenceFile={referenceFile}
          onFileChange={setReferenceFile}
          label="Joindre une étude de marché ou note d'intention"
          hint="PDF, DOCX ou TXT (max 10 Mo)"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-60 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Génération du Business Plan en cours...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Générer le Business Plan (Gemma)</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
