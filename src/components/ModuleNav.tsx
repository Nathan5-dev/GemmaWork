import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Edit3, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  ChevronDown,
  MessageSquareText,
  Languages,
  Bot
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const modules = [
    {
      id: 'business_plan' as ModuleType,
      title: 'Business Plan',
      icon: FileSpreadsheet
    },
    {
      id: 'admin_doc' as ModuleType,
      title: 'Documents administratifs',
      icon: FileText
    },
    {
      id: 'email' as ModuleType,
      title: 'E-mails professionnels',
      icon: Mail
    },
    {
      id: 'chat_assistant' as ModuleType,
      title: 'Assistant Service Rapide',
      icon: MessageSquareText
    },
    {
      id: 'translator' as ModuleType,
      title: 'Traduction de Documents',
      icon: Languages
    },
    {
      id: 'rag_builder' as ModuleType,
      title: 'Créateur de Bot RAG',
      icon: Bot
    }
  ];

  const currentModuleObj = modules.find(m => m.id === activeModule) || modules[0];
  const CurrentIcon = currentModuleObj.icon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs p-3 sm:p-3.5 transition-all">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Left: Back to Home + Compact Module Switcher */}
        <div className="flex items-center space-x-2.5">
          {/* Back Home Button */}
          <button
            onClick={() => onSelectModule(null)}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl transition-all cursor-pointer shrink-0"
            title="Retourner à l'accueil"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Accueil</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

          {/* Module Dropdown Switcher */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white hover:border-indigo-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2 truncate">
                <CurrentIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">{currentModuleObj.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute left-0 top-full mt-1.5 w-60 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 space-y-1 animate-fade-in"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {modules.map((m) => {
                  const Icon = m.icon;
                  const isActive = activeModule === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onSelectModule(m.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{m.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Integrated Workspace Tabs (Formulaire | Résultat) - Visible ONLY in document generation modules */}
        {activeModule !== 'chat_assistant' && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 shrink-0">
            <button
              onClick={() => onTabChange('form')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Formulaire</span>
            </button>

            <button
              onClick={() => onTabChange('result')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer relative ${
                activeTab === 'result'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'result' ? 'text-indigo-200' : 'text-indigo-500'}`} />
              <span>Résultat / Éditeur</span>
              {hasGeneratedContent && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 absolute -top-0.5 -right-0.5 animate-pulse"></span>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
