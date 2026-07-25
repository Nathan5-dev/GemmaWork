import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  ArrowRight, 
  Sparkles,
  MessageSquareText,
  Languages,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ModuleType, Language } from '../types';
import { translations } from '../data/translations';

interface HomeHeroProps {
  currentLang: Language;
  onSelectModule: (module: ModuleType) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ currentLang, onSelectModule }) => {
  const t = translations[currentLang];

  const scrollToModules = () => {
    const el = document.getElementById('main-modules-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSelectModule('business_plan');
    }
  };

  const modulesList = [
    {
      id: 'business_plan' as ModuleType,
      title: 'Business Plan',
      description: 'Gemma structure votre étude de marché, vos prévisions financières et la stratégie opérationnelle de votre entreprise.',
      icon: FileSpreadsheet,
      badge: 'Finances & Stratégie',
      color: 'amber',
      detail: 'Modèles financiers, prévisions de trésorerie & analyse SWOT.'
    },
    {
      id: 'admin_doc' as ModuleType,
      title: 'Documents administratifs',
      description: 'Gemma rédige vos lettres officielles, notes de service, demandes administratives et attestations réglementaires.',
      icon: FileText,
      badge: 'Rédaction Officielle',
      color: 'blue',
      detail: 'Style protocolaire, formules de politesse & conformité juridique.'
    },
    {
      id: 'email' as ModuleType,
      title: 'E-mails professionnels',
      description: 'Gemma compose des e-mails clairs, persuasifs et courtois pour toutes vos correspondances commerciales.',
      icon: Mail,
      badge: 'Communication',
      color: 'emerald',
      detail: 'Tons ajustables, relances partenariats & réponses officielles.'
    },
    {
      id: 'chat_assistant' as ModuleType,
      title: 'Assistant Service Rapide',
      description: 'Interrogez directement l\'IA Gemma 24/7 pour obtenir des conseils administratifs, fiscaux et juridiques instantanés.',
      icon: MessageSquareText,
      badge: 'Chat IA Instantané',
      color: 'cyan',
      detail: 'Réponses instantanées, conseils pratiques & assistance juridique.'
    },
    {
      id: 'translator' as ModuleType,
      title: 'Traduction de Documents',
      description: 'Gemma traduit fidèlement vos contrats, rapports et courriers en Français, Anglais et Kiswahili tout en conservant le format.',
      icon: Languages,
      badge: 'Multilingue',
      color: 'purple',
      detail: 'Préservation de la mise en page A4 & fidélité contextuelle.'
    },
    {
      id: 'rag_builder' as ModuleType,
      title: 'Créateur de Bot Public RAG',
      description: 'Entraînez un assistant virtuel sur mesure basé sur Gemma en y important directement vos propres fichiers et règlements.',
      icon: Bot,
      badge: 'Base de Connaissances',
      color: 'rose',
      detail: 'Indexation de vos PDF/Word pour réponses sur mesure.'
    }
  ];

  return (
    <div className="py-6 sm:py-10 animate-fade-in space-y-12">
      
      {/* Main Hero Header */}
      <div className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>Propulsé par le modèle Gemma (Google AI)</span>
        </div>

        {/* Main Title Requested */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Exploitez la puissance de l'IA pour booster votre productivité
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
          GemWork est votre plateforme d'intelligence artificielle dédiée aux professionnels, entrepreneurs et administrations. Automatisez la production de vos documents complexes en toute sécurité et avec une précision rédactionnelle remarquable.
        </p>

        {/* Primary CTA Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={scrollToModules}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm sm:text-base inline-flex items-center space-x-2.5 cursor-pointer active:scale-98"
          >
            <span>Découvrir les modules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight features bar */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs font-bold text-slate-700">
          <div className="flex items-center justify-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rédaction instantanée</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Format A4 Éditable & Export PDF/Word</span>
          </div>
          <div className="flex items-center justify-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Modèle Gemma Intégré</span>
          </div>
        </div>
      </div>

      {/* 6 Modules Grid with Detailed Descriptions */}
      <div id="main-modules-grid" className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Les 6 Modules de la Plateforme</h2>
            <p className="text-xs text-slate-500 font-medium">Découvrez comment l'IA Gemma vous accompagne dans chaque tâche</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
            6 Outils Spécialisés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulesList.map((m) => {
            const Icon = m.icon;
            return (
              <div 
                key={m.id}
                onClick={() => onSelectModule(m.id)}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                      {m.description}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] font-medium text-slate-600 flex items-start space-x-2">
                    <Zap className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Avantage Gemma :</strong> {m.detail}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                  <span>Accéder au module</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

