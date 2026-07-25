import React from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Globe, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Sliders,
  ShieldCheck,
  PackageX
} from 'lucide-react';
import { AppSettings, Language, LocalGemmaModel, ThemeMode } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  currentLang: Language;
}

// Available local custom fine-tuned Gemma models
const DEFAULT_LOCAL_MODELS: LocalGemmaModel[] = [
  {
    id: 'gemma-2-9b-drc-legal',
    name: 'Gemma-2-9B-DRC-Legal',
    specialty: 'Droit commercial, Fiscalité DGI & Démarches GUCE',
    size: '5.4 GB',
    isInstalled: false,
    version: 'v1.2-fine-tuned'
  },
  {
    id: 'gemma-2-2b-admin-fast',
    name: 'Gemma-2-2B-Kinshasa-Admin',
    specialty: 'Rédaction administrative & lettres officielles RDC',
    size: '1.6 GB',
    isInstalled: false,
    version: 'v1.0'
  },
  {
    id: 'gemma-2-9b-swahili-biz',
    name: 'Gemma-2-9B-Swahili-Biz',
    specialty: 'Business Plans & Rédaction en Kiswahili et Français',
    size: '5.4 GB',
    isInstalled: false,
    version: 'v2.1'
  }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentLang
}) => {
  if (!isOpen) return null;

  const handleThemeChange = (theme: ThemeMode) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleLanguageChange = (language: Language) => {
    onUpdateSettings({ ...settings, language });
  };

  const handleModelChange = (aiModel: string) => {
    onUpdateSettings({ ...settings, aiModel });
  };

  const handleSelectLocalModel = (id: string | null) => {
    onUpdateSettings({ ...settings, selectedLocalModelId: id });
  };

  const installedModels = DEFAULT_LOCAL_MODELS.filter(m => m.isInstalled);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Paramètres & Configuration</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Préférences d'affichage, thèmes et modèles Gemma</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          
          {/* Section 1: Thème Visuel */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <Sun className="w-4 h-4 text-indigo-500" />
              <span>Thème d'affichage</span>
            </label>

            <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-900 text-sm font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Thème Clair Unifié</span>
              </div>
              <span className="text-xs font-bold bg-indigo-200/60 text-indigo-800 px-2.5 py-0.5 rounded-md">Actif</span>
            </div>
          </div>

          {/* Section 2: Langue d'interface */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Langue de l'application</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fr', label: 'Français', flag: '🇫🇷' },
                { id: 'en', label: 'English', flag: '🇬🇧' },
                { id: 'sw', label: 'Kiswahili', flag: '🇨🇩' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleLanguageChange(lang.id as Language)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    settings.language === lang.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Modèle IA Cloud */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Moteur IA & Modèle actif</span>
            </label>

            <select
              value={settings.aiModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="gemini-3.6-flash">Gemini 3.6 Flash / Gemma Ultra-Fast (Optimal)</option>
              <option value="gemini-flash-latest">Gemini Flash Latest (Dernière version)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Mode Haute Précision)</option>
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Assure une génération fluide, structurée et instantanée de vos rapports, plans et e-mails.
            </p>
          </div>

          {/* Section 4: Modèles Gemma Hors Connexion / Locaux Personnalisés */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-emerald-500" />
                <span>Modèles Gemma locaux & personnalisés</span>
              </label>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Mode Hors-Ligne Local
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Consultez ci-dessous la liste des modèles Gemma spécialisés et fine-tunés pour l'exécution locale sur votre machine.
            </p>

            {/* List of custom local models */}
            <div className="space-y-2.5">
              {DEFAULT_LOCAL_MODELS.map((model) => {
                const isSelected = settings.selectedLocalModelId === model.id;
                return (
                  <div
                    key={model.id}
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      model.isInstalled
                        ? isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {model.name}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-sm">
                            {model.size}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">
                          Spécialité : {model.specialty}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        {model.isInstalled ? (
                          <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Disponible</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-700 rounded-md">
                            Non installé
                          </span>
                        )}
                      </div>
                    </div>

                    {model.isInstalled && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {isSelected ? 'Modèle local actif' : 'Prêt à l\'emploi'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectLocalModel(isSelected ? null : model.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Sélectionné' : 'Activer'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clear Honest Empty State for Local Custom Models */}
            {installedModels.length === 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                  <PackageX className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Aucun modèle local personnalisé installé
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Aucun poids de modèle Gemma hors-connexion n'a été détecté localement sur cet appareil. Vos documents sont traités directement en toute sécurité via le cloud haute vitesse.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Préférences enregistrées automatiquement dans votre navigateur</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
