import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ModuleNav } from './components/ModuleNav';
import { HelpModal } from './components/HelpModal';
import { HomeHero } from './components/HomeHero';
import { BusinessPlanForm } from './components/BusinessPlanForm';
import { AdminDocForm } from './components/AdminDocForm';
import { EmailForm } from './components/EmailForm';
import { ResultPanel } from './components/ResultPanel';
import { Footer } from './components/Footer';
import { 
  ModuleType, 
  Language, 
  BusinessPlanPayload, 
  AdminDocPayload, 
  EmailPayload, 
  GenerationRequest, 
  GenerationResponse,
  ActiveTab
} from './types';
import { translations } from './data/translations';
import { ArrowLeft, Sparkles, Edit3, FileText, LayoutGrid, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [activeModule, setActiveModule] = useState<ModuleType | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('form');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState<GenerationRequest | null>(null);

  const t = translations[currentLang];

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

  const handleGenerate = async (payloadData: BusinessPlanPayload | AdminDocPayload | EmailPayload) => {
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
        body: JSON.stringify(requestPayload)
      });

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
      setGeneratedContent("⚠️ Une erreur réseau est survenue. Veuillez vérifier votre connexion et réinstaller le dev server.");
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

  const getModuleTitle = () => {
    if (activeModule === 'business_plan') return t.modules.businessPlan.title;
    if (activeModule === 'admin_doc') return t.modules.adminDoc.title;
    if (activeModule === 'email') return t.modules.email.title;
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onOpenHelp={() => setIsHelpOpen(true)}
        isDemoMode={isDemoMode}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {!activeModule ? (
          /* Home Screen with Module Cards */
          <HomeHero
            currentLang={currentLang}
            onSelectModule={handleSelectModule}
          />
        ) : (
          /* Active Module View with Enhanced Responsive Sub-Nav */
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

            {/* TAB CONTENT VIEWS (Responsive 2-column or focused tab view) */}
            <div className="space-y-6">
              
              {/* Show Side-by-Side on wide desktop if preferred, or single tab view */}
              <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
                
                {/* Form Panel (5 cols) */}
                <div className={`col-span-5 ${activeTab === 'result' && !generatedContent ? 'opacity-90' : ''}`}>
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
                </div>

                {/* Result Panel (7 cols) */}
                <div className="col-span-7">
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
                  />
                </div>

              </div>

              {/* Mobile / Tablet Tabbed Display */}
              <div className="block lg:hidden">
                {activeTab === 'form' ? (
                  <div className="space-y-4">
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
                  </div>
                ) : (
                  <div>
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
                    />
                  </div>
                )}
              </div>

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

    </div>
  );
}

