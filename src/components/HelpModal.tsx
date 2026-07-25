import React from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, BookOpen, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, currentLang }) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Guide & Aide — GemmaWork RDC</h2>
              <p className="text-xs text-slate-400">Comment utiliser l'assistant IA de productivité</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-slate-300">
          
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/80">
            <h3 className="font-semibold text-white flex items-center space-x-2 text-base mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Qu'est-ce que GemmaWork RDC ?</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              GemmaWork RDC est un outil d'intelligence artificielle fondé sur le modèle Gemma de Google. Il est spécialement conçu pour accélérer la rédaction professionnelle des entrepreneurs, PME, ONG, étudiants et administrations en République Démocratique du Congo.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs text-slate-400">
              Les 3 Modules Principaux
            </h4>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <p className="font-medium text-indigo-400 text-xs mb-1">1. Business Plan IA</p>
                <p className="text-xs text-slate-400">Structure les idées d'affaires avec prévisions financières basiques et analyse de marché en RDC.</p>
              </div>
              <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <p className="font-medium text-indigo-300 text-xs mb-1">2. Documents Administratifs</p>
                <p className="text-xs text-slate-400">Génère des lettres officielles, demandes, notes de service et attestations conformes.</p>
              </div>
              <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl">
                <p className="font-medium text-indigo-200 text-xs mb-1">3. E-mail Professionnel</p>
                <p className="text-xs text-slate-400">Rédige des e-mails clairs avec boutons d'actions rapides (raccourcir, formaliser, traduire).</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-800 pt-4">
            <h4 className="font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Engagements & Sécurité des données</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Sans hallucination de données :</strong> L'IA n'invente jamais de numéros de téléphone, noms ou références administratives. Si une donnée manque, elle place des espaces réservés comme <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">[Nom]</code> ou des hypothèses.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multi-langue :</strong> Vous pouvez générer vos documents en français, anglais ou swahili à tout moment.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Export & Copie :</strong> Tout texte généré est modifiable directement avant d'être copié ou téléchargé en format PDF.</span>
              </li>
            </ul>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-4 text-xs text-indigo-200 flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-indigo-100 font-medium mb-0.5">Adaptation au contexte congolais</strong>
              <span>Les modèles prennent en compte les spécificités des villes (Kinshasa, Lubumbashi, Goma, Bukavu, Kisangani, etc.), les nomenclatures administratives et les us professionnels de la RDC.</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-xs"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
