import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  MapPin, 
  Zap 
} from 'lucide-react';
import { ModuleType, Language } from '../types';
import { translations } from '../data/translations';

interface HomeHeroProps {
  currentLang: Language;
  onSelectModule: (module: ModuleType) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ currentLang, onSelectModule }) => {
  const t = translations[currentLang];

  return (
    <div className="space-y-12 py-6 sm:py-10 animate-fade-in">
      
      {/* Main Banner / Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Gemma & Google GenAI pour la RDC</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Productivité & Rédaction IA pour les{' '}
          <span className="text-indigo-600">
            Entreprises & Administrations en RDC
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
          {t.subtitle}
        </p>

        {/* Target Badges */}
        <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs text-slate-600 font-medium">
          <span className="px-3.5 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>PME & Startups</span>
          </span>
          <span className="px-3.5 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span>ONG & Associations</span>
          </span>
          <span className="px-3.5 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Étudiants & Administrations</span>
          </span>
          <span className="px-3.5 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>Kinshasa, Lubumbashi, Goma...</span>
          </span>
        </div>

      </div>

      {/* 3 Main Module Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        
        {/* Module 1: Business Plan */}
        <div 
          onClick={() => onSelectModule('business_plan')}
          className="group relative bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg">
                {t.modules.businessPlan.badge}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {t.modules.businessPlan.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {t.modules.businessPlan.desc}
              </p>
            </div>

            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Résumé exécutif & étude de marché RDC</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Modèle économique & hypothèses financières</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Plan d'action priorisé & recommandations</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Commencer le Business Plan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 2: Admin Documents */}
        <div 
          onClick={() => onSelectModule('admin_doc')}
          className="group relative bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg">
                {t.modules.adminDoc.badge}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {t.modules.adminDoc.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {t.modules.adminDoc.desc}
              </p>
            </div>

            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Lettres officielles & demandes de stage / service</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Notes de service, comptes-rendus & attestations</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Formatage strict sans fausses informations</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Rédiger un document</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Email Professionnel */}
        <div 
          onClick={() => onSelectModule('email')}
          className="group relative bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
                {t.modules.email.badge}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {t.modules.email.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {t.modules.email.desc}
              </p>
            </div>

            <ul className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>E-mails persuasifs, cordiaux ou administratifs</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Actions rapides : raccourcir, formaliser, traduire</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Objets d'e-mails optimisés & prêt à l'envoi</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
            <span>Composer un e-mail</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Trust & Features banner */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-slate-900 flex items-center justify-center md:justify-start space-x-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <span>Génération instantanée en Français, English & Swahili</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Choisissez votre langue de travail et exportez vos résultats directement en PDF pour vos présentations aux banques, bailleurs de fonds ou ministères.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => onSelectModule('business_plan')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-all text-xs sm:text-sm flex items-center space-x-2"
            >
              <span>Essayer maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
