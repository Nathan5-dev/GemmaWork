import React, { useState } from 'react';
import { 
  Bot, 
  Upload, 
  Code, 
  Send, 
  Layers, 
  X,
  FileCheck,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { Language, RagBotConfig, ReferenceFile } from '../types';
import { translations } from '../data/translations';

interface RagBuilderFormProps {
  currentLang: Language;
  onSubmit: (config: RagBotConfig, testQuery?: string) => void;
  isLoading: boolean;
}

export const RagBuilderForm: React.FC<RagBuilderFormProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const t = translations[currentLang];

  const [botName, setBotName] = useState('Assistant Client & FAQ Entreprise');
  const [systemPrompt, setSystemPrompt] = useState('Tu es un assistant IA public pour mon entreprise. Réponds exclusivement et strictement en te basant sur les documents de référence fournis. Si la réponse ne figure pas dans les documents, indique poliment : "Désolé, cette information n\'est pas disponible dans nos documents de référence."');
  const [welcomeMessage, setWelcomeMessage] = useState('Bonjour ! Bienvenue sur notre service client. Comment puis-je vous assister aujourd\'hui ?');
  const [knowledgeFiles, setKnowledgeFiles] = useState<ReferenceFile[]>([]);
  const [testQuery, setTestQuery] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Le fichier ${file.name} dépasse 10 Mo.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setKnowledgeFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type,
 base64Data
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setKnowledgeFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const embedScriptCode = `<script 
  src="https://gemwork.ai/v1/widget.js" 
  data-bot-id="bot_${Math.abs(botName.length * 997).toString(16)}"
  data-lang="${currentLang}">
</script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(embedScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleTestBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim() && knowledgeFiles.length === 0) {
      alert("Veuillez importer au moins un document de connaissance ou saisir une question de test.");
      return;
    }

    onSubmit({
      botName,
      systemPrompt,
      welcomeMessage,
      knowledgeFiles,
      isPublic: true,
      allowedDomains: '*'
    }, testQuery);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs p-5 sm:p-7 space-y-6 max-w-4xl mx-auto transition-colors">
      
      {/* Banner */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Créateur de Bot Public RAG (Gemma)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configurez votre agent IA personnalisé basé sur vos propres documents d'entreprise.</p>
        </div>
      </div>

      <form onSubmit={handleTestBot} className="space-y-5">
        
        {/* Section 1: Identity */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>1. Configuration & Consignes du Bot</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom du Chatbot</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Ex: Assistant Service Client"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message d'accueil</label>
              <input
                type="text"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Ex: Bonjour ! Comment puis-je vous aider ?"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Consigne RAG stricte</label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Section 2: Knowledge Base Files */}
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Fichiers de Connaissance ({knowledgeFiles.length})</span>
            </h3>
          </div>

          <label className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 bg-white dark:bg-slate-800 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all">
            <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Importer des documents PDF, TXT ou DOCX</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Taille max : 10 Mo par fichier</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {knowledgeFiles.length > 0 && (
            <div className="space-y-2 pt-1">
              {knowledgeFiles.map((f, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{f.name}</p>
                      <p className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(1)} Ko</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Embed Widget Snippet */}
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>3. Code Widget à intégrer</span>
          </h3>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl text-xs font-mono flex items-center justify-between overflow-x-auto">
            <code>{embedScriptCode}</code>
            <button
              type="button"
              onClick={handleCopyScript}
              className="ml-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Section 4: Sandbox Question Test */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Question de test (Bac à sable RAG)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Saisissez une question basée sur vos documents..."
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-50 active:scale-98"
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Exécuter RAG →</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
