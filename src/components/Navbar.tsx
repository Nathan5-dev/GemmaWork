import React from 'react';
import { Sparkles, HelpCircle, Settings, ChevronDown, Layers } from 'lucide-react';
import { Language, ModuleType } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeModule: ModuleType | null;
  onSelectModule: (module: ModuleType | null) => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  isDemoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  activeModule,
  onSelectModule,
  onOpenHelp,
  onOpenSettings,
  isDemoMode
}) => {
  const t = translations[currentLang];

  const modulesList: { id: ModuleType; title: string }[] = [
    { id: 'business_plan', title: t.modules.businessPlan.title },
    { id: 'admin_doc', title: t.modules.adminDoc.title },
    { id: 'email', title: t.modules.email.title },
    { id: 'chat_assistant', title: t.modules.chatAssistant?.title || "Assistant Service" },
    { id: 'translator', title: t.modules.translator?.title || "Traduction Doc" },
    { id: 'rag_builder', title: t.modules.ragBuilder?.title || "Bot Public RAG" }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSelectModule(null)}
              className="flex items-center space-x-2.5 group focus:outline-none rounded-xl p-1 text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                  GemWork
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                  IA
                </span>
              </div>
            </button>

            {/* Quick Module Switcher Dropdown (when inside a module) */}
            <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onSelectModule(null)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeModule === null
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Accueil
              </button>

              <div className="relative group">
                <div className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Modules</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Hover Dropdown */}
                <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-56 z-50 animate-fade-in">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-1.5 space-y-0.5">
                    {modulesList.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onSelectModule(m.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                          activeModule === m.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{m.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Controls: Demo mode, Help, Settings */}
          <div className="flex items-center space-x-2.5">
            
            {isDemoMode && (
              <div 
                title={t.demoModeTooltip}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{t.demoModeBadge}</span>
              </div>
            )}

            {/* Help Button */}
            <button
              onClick={onOpenHelp}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
              title={t.help}
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">{t.help}</span>
            </button>

            {/* Settings Icon Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Paramètres & Modèles Gemma"
              aria-label="Paramètres"
            >
              <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
