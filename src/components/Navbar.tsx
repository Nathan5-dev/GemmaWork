import React from 'react';
import { Sparkles, HelpCircle, Globe, Building2, ChevronRight } from 'lucide-react';
import { Language, ModuleType } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeModule: ModuleType | null;
  onSelectModule: (module: ModuleType | null) => void;
  onOpenHelp: () => void;
  isDemoMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeModule,
  onSelectModule,
  onOpenHelp,
  isDemoMode
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectModule(null)}
              className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">GemmaWork</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md">
                    RDC
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Assistant IA PME & Administration
                </p>
              </div>
            </button>

            {activeModule && (
              <div className="hidden md:flex items-center space-x-2 text-xs text-slate-500 border-l border-slate-200 pl-4 ml-2">
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {t.modules[activeModule === 'business_plan' ? 'businessPlan' : activeModule === 'admin_doc' ? 'adminDoc' : 'email'].title}
                </span>
              </div>
            )}
          </div>

          {/* Right Controls: Demo badge, Language switcher, Help button */}
          <div className="flex items-center space-x-3">
            
            {isDemoMode && (
              <div 
                title={t.demoModeTooltip}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-full"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{t.demoModeBadge}</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200/80">
              <Globe className="w-4 h-4 text-slate-500 mr-1.5 shrink-0" />
              <select
                aria-label={t.selectLanguage}
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1 py-0.5"
              >
                <option value="fr" className="bg-white text-slate-900">FR - Français</option>
                <option value="en" className="bg-white text-slate-900">EN - English</option>
                <option value="sw" className="bg-white text-slate-900">SW - Kiswahili</option>
              </select>
            </div>

            {/* Help Button */}
            <button
              onClick={onOpenHelp}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">{t.help}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
