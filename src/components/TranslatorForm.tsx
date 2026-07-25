import React, { useState } from 'react';
import { 
  Languages, 
  Upload, 
  Sparkles, 
  FileCheck,
  X
} from 'lucide-react';
import { Language, TranslatorPayload, ReferenceFile } from '../types';
import { translations } from '../data/translations';

interface TranslatorFormProps {
  currentLang: Language;
  onSubmit: (data: TranslatorPayload) => void;
  isLoading: boolean;
}

export const TranslatorForm: React.FC<TranslatorFormProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const t = translations[currentLang];

  const [sourceText, setSourceText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<'auto' | Language>('auto');
  const [targetLang, setTargetLang] = useState<Language>(currentLang === 'fr' ? 'en' : 'fr');
  const [referenceFile, setReferenceFile] = useState<ReferenceFile | null>(null);

  const sampleTexts = [
    {
      title: "Lettre FR → EN",
      src: "fr" as Language,
      tgt: "en" as Language,
      text: `Objet : Demande de partenariat stratégique.
Monsieur le Directeur,
J'ai l'honneur de solliciter par la présente une audience auprès de vos services afin de vous présenter notre projet.`
    },
    {
      title: "Contrat EN → FR",
      src: "en" as Language,
      tgt: "fr" as Language,
      text: `COMMERCIAL SUPPLY AND DISTRIBUTION AGREEMENT
This Agreement is entered into between Congo LogiTrans and Global Commodities Ltd.`
    },
    {
      title: "Communiqué FR → SW",
      src: "fr" as Language,
      tgt: "sw" as Language,
      text: `Avis au public et aux opérateurs économiques.
Le Secrétariat Général informe tous les commerçants que les nouvelles modalités entrent en vigueur dès ce lundi.`
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Le fichier dépasse la taille maximale autorisée de 10 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setReferenceFile({
        name: file.name,
        size: file.size,
        type: file.type,
        base64Data
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim() && !referenceFile) {
      alert("Veuillez saisir un texte à traduire ou joindre un fichier de document.");
      return;
    }

    onSubmit({
      sourceText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      referenceFile: referenceFile || undefined,
      preserveFormatting: true
    });
  };

  const handleLoadSample = (sample: typeof sampleTexts[0]) => {
    setSourceText(sample.text);
    setSourceLang(sample.src);
    setTargetLang(sample.tgt);
  };

  const handleReset = () => {
    setSourceText('');
    setReferenceFile(null);
    setSourceLang('auto');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs p-5 sm:p-7 space-y-6 max-w-4xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-700 pb-5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Traduction de Documents (Gemma)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Traduisez vos documents en conservant la structure et le sens d'origine.</p>
          </div>
        </div>

        {/* Sample Pills */}
        <div className="flex items-center space-x-2 pt-2.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Exemples :</span>
          {sampleTexts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700/60 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Language Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Langue Source</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="auto">✨ Détection automatique</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Langue Cible</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as Language)}
              className="w-full px-3 py-2.5 bg-purple-600 text-white font-bold border border-purple-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
        </div>

        {/* Upload File */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              Document (PDF, TXT, DOCX) <span className="text-slate-400 font-normal">(Optionnel)</span>
            </label>
            {referenceFile && (
              <button
                type="button"
                onClick={() => setReferenceFile(null)}
                className="text-xs text-rose-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            )}
          </div>

          {!referenceFile ? (
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 flex items-center justify-center space-x-3 cursor-pointer transition-all">
              <Upload className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Importer un document à traduire</span>
                <span className="text-slate-500 dark:text-slate-400"> (PDF, TXT, max 10 Mo)</span>
              </div>
              <input
                type="file"
                accept=".txt,.pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{referenceFile.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{(referenceFile.size / 1024).toFixed(1)} Ko</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Texte à traduire
          </label>
          <textarea
            rows={7}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Saisissez ou collez ici le texte à traduire..."
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium text-slate-900 dark:text-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
          >
            Réinitialiser
          </button>

          <button
            type="submit"
            disabled={isLoading || (!sourceText.trim() && !referenceFile)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-2 cursor-pointer active:scale-98"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Traduction par Gemma...</span>
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                <span>Traduire avec Gemma →</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
