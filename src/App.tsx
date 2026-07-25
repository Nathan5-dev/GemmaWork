import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ModuleNav } from './components/ModuleNav';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { HomeHero } from './components/HomeHero';
import { BusinessPlanForm } from './components/BusinessPlanForm';
import { AdminDocForm } from './components/AdminDocForm';
import { EmailForm } from './components/EmailForm';
import { ChatAssistantView } from './components/ChatAssistantView';
import { TranslatorForm } from './components/TranslatorForm';
import { RagBuilderForm } from './components/RagBuilderForm';
import { ResultPanel } from './components/ResultPanel';
import { Footer } from './components/Footer';
import { 
  ModuleType, 
  Language, 
  GenerationRequest, 
  GenerationResponse,
  ActiveTab,
  AppSettings,
  ThemeMode
} from './types';
import { translations } from './data/translations';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  // Load settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedLang = (localStorage.getItem('gemwork_lang') as Language) || 'fr';
    const savedModel = localStorage.getItem('gemwork_model') || 'gemini-3.6-flash';
    const savedLocalModel = localStorage.getItem('gemwork_local_model') || null;

    return {
      theme: 'light',
      language: savedLang,
      aiModel: savedModel,
      selectedLocalModelId: savedLocalModel
    };
  });

  const [currentLang, setCurrentLang] = useState<Language>(settings.language);
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<GenerationRequest | null>(null);

  // Force light theme on document root element
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Keep currentLang synced with settings language
  useEffect(() => {
    setCurrentLang(settings.language);
  }, [settings.language]);

  // Save settings to localStorage
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gemwork_theme', newSettings.theme);
    localStorage.setItem('gemwork_lang', newSettings.language);
    localStorage.setItem('gemwork_model', newSettings.aiModel);
    if (newSettings.selectedLocalModelId) {
      localStorage.setItem('gemwork_local_model', newSettings.selectedLocalModelId);
    } else {
      localStorage.removeItem('gemwork_local_model');
    }
  };

  // Check health on load
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.mode === 'demo') {
          setIsDemoMode(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectModule = (module: ModuleType | null) => {
    setActiveModule(module);
    setActiveTab('form');
    setGeneratedContent('');
    setLastPayload(null);
  };

  const handleGenerate = async (payloadData: any) => {
    if (!activeModule) return;

    const requestPayload: GenerationRequest = {
      module: activeModule,
      data: payloadData
    };

    setLastPayload(requestPayload);
    setIsGenerating(true);
    // Switch to result tab automatically when generation begins
    setActiveTab('result');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestPayload,
          model: settings.aiModel
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Réponse API non JSON reçue :", text.substring(0, 300));
        throw new Error(`Erreur serveur (Code ${res.status}). Assurez-vous que l'API est accessible.`);
      }

      const data: GenerationResponse = await res.json();

      if (data.status === 'success' || data.status === 'demo') {
        setGeneratedContent(data.content || '');
        if (data.isDemoMode) {
          setIsDemoMode(true);
        }
      } else {
        setGeneratedContent(`⚠️ Erreur : ${data.error || "Impossible de générer le document."}`);
      }
    } catch (err: any) {
      console.error("Erreur d'appel API :", err);
      setGeneratedContent(`⚠️ Erreur lors de la génération : ${err?.message || "Impossible de contacter l'API"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickAction = async (action: 'shorten' | 'expand' | 'formalize' | 'translate', targetLang?: Language) => {
    if (!generatedContent) return;

    setIsActionLoading(true);

    try {
      const res = await fetch('/api/email-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: generatedContent,
          action,
          targetLanguage: targetLang
        })
      });

      const data = await res.json();
      if (data.content) {
        setGeneratedContent(data.content);
        if (data.isDemoMode) {
          setIsDemoMode(true);
        }
      }
    } catch (err) {
      console.error("Erreur d'action rapide :", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastPayload) {
      handleGenerate(lastPayload.data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors">
      
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={(lang) => handleUpdateSettings({ ...settings, language: lang })}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {!activeModule ? (
          /* Home Screen with Clean Hero & 3 Main Module Cards */
          <HomeHero
            currentLang={currentLang}
            onSelectModule={handleSelectModule}
          />
        ) : (
          /* Active Module View with Navigation Sub-Nav */
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Navigation & Tab Bar Header */}
            <ModuleNav
              currentLang={currentLang}
              activeModule={activeModule}
              onSelectModule={handleSelectModule}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              hasGeneratedContent={!!generatedContent}
            />

            {/* TAB CONTENT VIEWS */}
            <div className="space-y-6">

              {/* View 1: FORM / INPUT TAB */}
              {activeTab === 'form' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Banner when a document has already been generated */}
                  {generatedContent && activeModule !== 'chat_assistant' && (
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-200/90 dark:border-emerald-800/80 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Un document a été généré pour ce module</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300">Vous pouvez modifier les champs ci-dessous ou consulter le résultat.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('result')}
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer shadow-2xs active:scale-98"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span>Voir le résultat →</span>
                      </button>
                    </div>
                  )}

                  {/* Active Form / Interactive Module */}
                  {activeModule === 'business_plan' && (
                    <BusinessPlanForm
                      currentLang={currentLang}
                      onSubmit={handleGenerate}
                      isLoading={isGenerating}
                    />
                  )}

                  {activeModule === 'admin_doc' && (
                    <AdminDocForm
                      currentLang={currentLang}
                      onSubmit={handleGenerate}
                      isLoading={isGenerating}
                    />
                  )}

                  {activeModule === 'email' && (
                    <EmailForm
                      currentLang={currentLang}
                      onSubmit={handleGenerate}
                      isLoading={isGenerating}
                    />
                  )}

                  {activeModule === 'chat_assistant' && (
                    <ChatAssistantView currentLang={currentLang} />
                  )}

                  {activeModule === 'translator' && (
                    <TranslatorForm
                      currentLang={currentLang}
                      onSubmit={handleGenerate}
                      isLoading={isGenerating}
                    />
                  )}

                  {activeModule === 'rag_builder' && (
                    <RagBuilderForm
                      currentLang={currentLang}
                      onSubmit={handleGenerate}
                      isLoading={isGenerating}
                    />
                  )}
                </div>
              )}

              {/* View 2: RESULT TAB */}
              {activeTab === 'result' && (
                <div className="animate-fade-in">
                  <ResultPanel
                    currentLang={currentLang}
                    moduleType={activeModule}
                    content={generatedContent}
                    isGenerating={isGenerating}
                    isDemoMode={isDemoMode}
                    onUpdateContent={setGeneratedContent}
                    onRegenerate={handleRegenerate}
                    onQuickAction={handleQuickAction}
                    isActionLoading={isActionLoading}
                    onGoToForm={() => setActiveTab('form')}
                  />
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        currentLang={currentLang}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentLang={currentLang}
      />

    </div>
  );
}
