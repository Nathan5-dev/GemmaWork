import React from 'react';
import { Sparkles, Building2, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">GemWork</span>
              <p className="text-[11px] text-slate-400">Assistant IA de productivité et de rédaction professionnelle</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>Kinshasa • Lubumbashi • Goma • Bukavu • Kisangani</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} GemWork — Propulsé par l'IA Gemma & Google GenAI</p>
          <p>Conçu pour les PME, ONG, startups, étudiants et administrations congolaises</p>
        </div>

      </div>
    </footer>
  );
};
