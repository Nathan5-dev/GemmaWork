import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { translations } from '../data/translations';

interface ChatAssistantViewProps {
  currentLang: Language;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  currentLang
}) => {
  const t = translations[currentLang];
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Bonjour ! Je suis votre **Assistant Gemma IA**. 

Je réponds instantanément à vos questions administratives, fiscales, juridiques ou professionnelles :

• **Création d'entreprise :** Guichet Unique (GUCE), RCCM, Statuts SARL / Établissement
• **Fiscalité & Taxes :** DGI (IBP, IPR, TVA), DGRAD, DGDA, déclarations
• **Droit du Travail :** Code du Travail, contrat, préavis, CNSS, INPP
• **Rédaction & Courriers :** Modèles de lettres, notes de service et contrats

*Posez votre question ci-dessous pour démarrer.*`,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'chat_assistant',
          data: {
            message: query,
            conversationHistory: messages.slice(-6),
            language: currentLang
          }
        })
      });

      const result = await response.json();

      if (result.content) {
        const assistantMsg: ChatMessage = {
          id: 'asst_' + Date.now(),
          role: 'assistant',
          content: result.content,
          timestamp: Date.now()
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Réponse vide");
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `⚠️ Une erreur est survenue lors de la communication avec le moteur Gemma IA. Veuillez réessayer.`,
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: `Conversation réinitialisée. Posez votre question au moteur Gemma IA.`,
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden flex flex-col max-w-4xl mx-auto h-[680px] max-h-[80vh]">
      
      {/* Simple Clean Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm sm:text-base text-white">Assistant Service Gemma IA</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Gemma 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Génération de réponses professionnelles instantanées</p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          title="Réinitialiser la discussion"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Effacer</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                  isAssistant
                    ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                    : 'bg-indigo-600 text-white font-medium rounded-tr-xs'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content}
                </div>

                {/* Footer Copy for Assistant */}
                {isAssistant && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Réponse Gemma IA</span>
                    </span>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 shadow-xs rounded-tl-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span className="font-semibold">Génération de la réponse par le moteur Gemma IA...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Posez votre question professionnelle..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium transition-all focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-98"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
