import React from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Edit3, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { ModuleType, ActiveTab, Language } from '../types';
import { translations } from '../data/translations';

interface ModuleNavProps {
  currentLang: Language;
  activeModule: ModuleType;
  onSelectModule: (module: ModuleType | null) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasGeneratedContent: boolean;
}

export const ModuleNav: React.FC<ModuleNavProps> = ({
  currentLang,
  activeModule,
  onSelectModule,
  activeTab,
  onTabChange,
  hasGeneratedContent
}) => {
  const t = translations[currentLang];

  const modules = [
    {
      id: 'business_plan' as ModuleType,
      title: 'Business Plan',
      shortTitle: 'Business Plan',
      icon: FileSpreadsheet,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'admin_doc' as ModuleType,
      title: 'Doc Administratif',
      shortTitle: 'Doc Admin',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'email' as ModuleType,
      title: 'E-mail Professionnel',
      shortTitle: 'E-mail Pro',
      icon: Mail,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  const currentModuleObj = modules.find(m => m.id === activeModule) || modules[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 sm:p-4 space-y-3 sm:space-y-0 transition-all">
      
      {/* DESKTOP & TABLET LAYOUT */}
      <div className="hidden md:flex items-center justify-between gap-4">
        
        {/* Left Section: Back to Home + Module Quick Selector Pills */}
        <div className="flex items-center space-x-3">
          
          {/* Back Home Button */}
          <button
            onClick={() => onSelectModule(null)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer shrink-0"
            title="Retourner à l'accueil"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Accueil</span>
          </button>

          <div className="h-6 w-px bg-slate-200 shrink-0"></div>

          {/* Quick Module Switcher Pills */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSelectModule(m.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-900 shadow-xs border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{m.title}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Section: Workspace View Switcher (Form vs Result) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => onTabChange('form')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Formulaire</span>
          </button>

          <button
            onClick={() => onTabChange('result')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer relative ${
              activeTab === 'result'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'result' ? 'text-indigo-200' : 'text-indigo-600'}`} />
            <span>Résultat / Éditeur</span>
            {hasGeneratedContent && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white absolute -top-1 -right-1 animate-pulse"></span>
            )}
          </button>
        </div>

      </div>

      {/* MOBILE LAYOUT (OPTIMIZED FOR TOUCH & COMPACT SCREENS) */}
      <div className="block md:hidden space-y-3">
        
        {/* Row 1: Back + Module Dropdown Switcher */}
        <div className="flex items-center justify-between gap-2">
          
          <button
            onClick={() => onSelectModule(null)}
            className="flex items-center space-x-1 px-2.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl transition-all min-h-[44px] cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Accueil</span>
          </button>

          {/* Custom Select / Module Dropdown for Mobile */}
          <div className="relative flex-1 min-w-0">
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 min-h-[44px] focus-within:ring-2 focus-within:ring-indigo-500">
              <currentModuleObj.icon className="w-4 h-4 text-indigo-600 mr-2 shrink-0" />
              <select
                value={activeModule}
                onChange={(e) => onSelectModule(e.target.value as ModuleType)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none appearance-none pr-6 cursor-pointer truncate"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Row 2: Full Width Mobile Tab Toggle (Formulaire | Résultat) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 min-h-[44px]">
          <button
            onClick={() => onTabChange('form')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
              activeTab === 'form'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-4 h-4 text-indigo-600" />
            <span>Formulaire</span>
          </button>

          <button
            onClick={() => onTabChange('result')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all min-h-[38px] cursor-pointer relative ${
              activeTab === 'result'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'result' ? 'text-indigo-200' : 'text-indigo-600'}`} />
            <span>Résultat</span>
            {hasGeneratedContent && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1 right-2"></span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
