import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Indent, 
  Outdent, 
  Table, 
  Undo, 
  Redo, 
  FileText, 
  Loader2, 
  Palette, 
  Highlighter, 
  FileCheck,
  Scissors,
  Maximize2,
  ShieldCheck,
  Globe,
  Edit3,
  ArrowLeft
} from 'lucide-react';
import { ModuleType, Language } from '../types';
import { translations } from '../data/translations';
import { exportToPDF } from '../utils/pdfExport';
import { exportToDocx } from '../utils/docxExport';

interface ResultPanelProps {
  currentLang: Language;
  moduleType: ModuleType;
  content: string;
  isGenerating: boolean;
  isDemoMode?: boolean;
  onUpdateContent: (newContent: string) => void;
  onRegenerate: () => void;
  onQuickAction?: (action: 'shorten' | 'expand' | 'formalize' | 'translate', targetLang?: Language) => void;
  isActionLoading?: boolean;
  onGoToForm?: () => void;
}

// Convert markdown output from Gemma into rich HTML for the A4 editor
function markdownToHtml(md: string): string {
  if (!md) return '<p><br></p>';
  
  if (md.trim().startsWith('<') && (md.includes('</') || md.includes('/>'))) {
    return md;
  }

  const lines = md.split('\n');
  let html = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = null;
      }
      html += '<p><br></p>';
      continue;
    }

    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');

    if (line.startsWith('# ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h1 style="font-size: 22px; font-weight: bold; margin-top: 16px; margin-bottom: 8px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">${line.substring(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h2 style="font-size: 17px; font-weight: bold; margin-top: 14px; margin-bottom: 6px; color: #1e3a8a;">${line.substring(3)}</h2>`;
    } else if (line.startsWith('### ')) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h3 style="font-size: 15px; font-weight: bold; margin-top: 12px; margin-bottom: 4px; color: #334155;">${line.substring(4)}</h3>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ul style="list-style-type: disc; padding-left: 24px; margin-bottom: 8px;">';
        inList = true;
        listType = 'ul';
      }
      html += `<li style="margin-bottom: 4px;">${line.substring(2)}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        if (inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ol style="list-style-type: decimal; padding-left: 24px; margin-bottom: 8px;">';
        inList = true;
        listType = 'ol';
      }
      html += `<li style="margin-bottom: 4px;">${line.replace(/^\d+\.\s/, '')}</li>`;
    } else {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>';
        inList = false;
        listType = null;
      }
      html += `<p style="margin-bottom: 8px; line-height: 1.6; color: #334155;">${line}</p>`;
    }
  }

  if (inList) {
    html += listType === 'ul' ? '</ul>' : '</ol>';
  }

  return html;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  currentLang,
  moduleType,
  content,
  isGenerating,
  isDemoMode,
  onUpdateContent,
  onRegenerate,
  onQuickAction,
  isActionLoading,
  onGoToForm
}) => {
  const t = translations[currentLang];
  const editorRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffff00');

  useEffect(() => {
    if (editorRef.current && content) {
      const html = markdownToHtml(content);
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html;
      }
    }
  }, [content]);

  const executeCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onUpdateContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      onUpdateContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: left;">Article / Désignation</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">Quantité</th>
            <th style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">Prix Unitaire ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Élément 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">1</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">100.00</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Élément 2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center;">2</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">250.00</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCmd('insertHTML', tableHtml);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = editorRef.current ? editorRef.current.innerText : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Échec de la copie :", err);
    }
  };

  const getDocumentTitle = () => {
    const text = editorRef.current?.innerText || content;
    const firstLine = text.split('\n')[0]?.trim();
    if (firstLine && firstLine.length < 60) return firstLine;

    return moduleType === 'business_plan' 
      ? 'Business Plan' 
      : moduleType === 'admin_doc' 
      ? 'Document Administratif' 
      : 'Email Professionnel';
  };

  const handleDownloadPDF = () => {
    const title = getDocumentTitle();
    const html = editorRef.current ? editorRef.current.innerHTML : markdownToHtml(content);
    exportToPDF(title, html, title);
  };

  const handleDownloadDocx = () => {
    const title = getDocumentTitle();
    const html = editorRef.current ? editorRef.current.innerHTML : markdownToHtml(content);
    exportToDocx(html, title);
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center shadow-xs min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 border-2 border-white dark:border-slate-800">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        </div>

        <div className="space-y-1 max-w-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Rédaction avec Gemma...</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Génération en cours du document selon vos critères...
          </p>
        </div>

        <div className="w-48 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-2/3 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!content || content.trim() === '') {
    return (
      <div className="bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center">
          <FileText className="w-7 h-7" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{t.results.placeholderTitle}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.results.placeholderDesc}
          </p>
        </div>

        {onGoToForm && (
          <button
            onClick={onGoToForm}
            className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Remplir le formulaire</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[600px] transition-colors">
      
      {/* Top Main Bar with Export Buttons & Return Button */}
      <div className="bg-slate-900 text-white p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          {onGoToForm && (
            <button
              onClick={onGoToForm}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="Retourner au formulaire de saisie"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modifier le formulaire</span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs sm:text-sm font-bold text-slate-200 hidden sm:inline">
              Document Généré par Gemma
            </span>
          </div>
        </div>

        {/* Action Buttons: Copier, Régénérer, PDF, Word */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>

          <button
            onClick={onRegenerate}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Régénérer</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Word</span>
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-indigo-50 dark:bg-indigo-950/60 border-b border-indigo-100 dark:border-indigo-900 px-4 py-2 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span><strong>Mode Démonstration :</strong> Document rédigé selon les normes administratives et commerciales.</span>
          </div>
        </div>
      )}

      {/* Quick Actions Bar for Email */}
      {moduleType === 'email' && onQuickAction && (
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300 mr-1 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Ajustements intelligents :</span>
          </span>

          <button
            disabled={isActionLoading}
            onClick={() => onQuickAction('shorten')}
            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Scissors className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Raccourcir</span>
          </button>

          <button
            disabled={isActionLoading}
            onClick={() => onQuickAction('expand')}
            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Développer</span>
          </button>

          <button
            disabled={isActionLoading}
            onClick={() => onQuickAction('formalize')}
            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg font-medium text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>Rendre plus formel</span>
          </button>

          <div className="flex items-center space-x-1 ml-auto">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              disabled={isActionLoading}
              onChange={(e) => {
                if (e.target.value) {
                  onQuickAction('translate', e.target.value as Language);
                  e.target.value = '';
                }
              }}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="">Traduire en...</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          {isActionLoading && (
            <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin ml-2" />
          )}
        </div>
      )}

      {/* RICH TEXT EDITOR TOOLBAR */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-2 text-xs select-none">
        
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <button
            type="button"
            onClick={() => executeCmd('undo')}
            title="Annuler"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('redo')}
            title="Rétablir"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector: Titres (H1, H2, H3, P) */}
        <div className="border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <select
            onChange={(e) => executeCmd('formatBlock', e.target.value)}
            className="px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="<p>">Texte normal</option>
            <option value="<h1>">Titre 1 (H1)</option>
            <option value="<h2>">Titre 2 (H2)</option>
            <option value="<h3>">Titre 3 (H3)</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <select
            onChange={(e) => executeCmd('fontSize', e.target.value)}
            className="px-2 py-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="3">Taille normal</option>
            <option value="1">Très petit</option>
            <option value="2">Petit</option>
            <option value="4">Moyen</option>
            <option value="5">Grand</option>
            <option value="6">Très grand</option>
          </select>
        </div>

        {/* Bold, Italic, Underline */}
        <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <button
            type="button"
            onClick={() => executeCmd('bold')}
            title="Gras"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('italic')}
            title="Italique"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded italic text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('underline')}
            title="Souligné"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded underline text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color & Highlight Color */}
        <div className="flex items-center space-x-1 border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <label className="flex items-center space-x-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Couleur du texte">
            <Palette className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                executeCmd('foreColor', e.target.value);
              }}
              className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>

          <label className="flex items-center space-x-1 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer" title="Surlignage">
            <Highlighter className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                executeCmd('hiliteColor', e.target.value);
              }}
              className="w-4 h-4 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>
        </div>

        {/* Alignment */}
        <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <button
            type="button"
            onClick={() => executeCmd('justifyLeft')}
            title="Aligner à gauche"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyCenter')}
            title="Centrer"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyRight')}
            title="Aligner à droite"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyFull')}
            title="Justifier"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Indentation */}
        <div className="flex items-center space-x-0.5 border-r border-slate-200 dark:border-slate-700 pr-1.5">
          <button
            type="button"
            onClick={() => executeCmd('insertUnorderedList')}
            title="Liste à puces"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('insertOrderedList')}
            title="Liste numérotée"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('outdent')}
            title="Diminuer le retrait"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('indent')}
            title="Augmenter le retrait"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="flex items-center space-x-0.5">
          <button
            type="button"
            onClick={insertTable}
            title="Insérer un tableau simple"
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 flex items-center space-x-1 cursor-pointer"
          >
            <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline text-xs font-semibold">Tableau</span>
          </button>
        </div>

      </div>

      {/* A4 PAGE CANVAS DISPLAY */}
      <div className="p-4 sm:p-8 overflow-x-auto flex justify-center bg-slate-200/70 dark:bg-slate-950/70 min-h-[650px] flex-1">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl rounded-xs p-8 sm:p-14 leading-relaxed font-sans focus:outline-none relative">
          
          {/* Subtle A4 Header Watermark */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6 text-[10px] uppercase font-bold tracking-widest text-slate-400 select-none">
            <span>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</span>
            <span>GEMWORK • ÉDITEUR A4</span>
          </div>

          {/* EDITABLE A4 CONTENT CONTAINER */}
          <div
            ref={editorRef}
            contentEditable={true}
            onInput={handleEditorInput}
            suppressContentEditableWarning={true}
            className="outline-none min-h-[220mm] text-sm text-slate-800 space-y-3 focus:outline-none"
          />

          {/* Subtle A4 Footer */}
          <div className="border-t border-slate-100 pt-4 mt-8 text-center text-[10px] text-slate-400 select-none">
            Document généré et édité via GemWork — Confidentiel
          </div>

        </div>
      </div>

      {/* Footer / Disclaimer */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p className="max-w-xl text-[11px] leading-tight">
          {t.results.disclaimer}
        </p>
        <span className="text-[11px] font-semibold text-slate-400">
          Éditeur interactif A4 • Sauvegarde automatique
        </span>
      </div>

    </div>
  );
};
