import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { 
  GenerationRequest, 
  GenerationResponse, 
  BusinessPlanPayload, 
  AdminDocPayload, 
  EmailPayload, 
  QuickActionPayload,
  Language,
  ReferenceFile
} from "./src/types";

dotenv.config();

process.on("unhandledRejection", (reason) => {
  console.error("[Process] Rejection non gérée évitée :", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[Process] Exception non capturée évitée :", err);
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Enable CORS for Vercel deployment
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// System prompt as required by specification
const SYSTEM_INSTRUCTION = `Tu es GemmaWork RDC, un assistant IA de productivité et de business destiné aux PME, ONG, startups, étudiants, entrepreneurs et administrations de la République démocratique du Congo. Tu produis des business plans, des documents administratifs et des e-mails professionnels en français, en anglais ou en swahili. Respecte strictly la langue, le ton, le type de document et le format demandés. Écris avec clarté, professionnalisme et sens pratique. Adapte les exemples au contexte congolais lorsque cela est pertinent, mais n’invente jamais de faits, de chiffres, de lois, de coordonnées ou de sources. Lorsqu’une donnée manque, indique une hypothèse ou un espace réservé. Fournis uniquement le contenu demandé, bien structuré et immédiatement exploitable.`;

/**
 * Extracts text context from an optional reference document (PDF, DOCX, TXT max 10MB)
 * Processed strictly in-memory and immediately cleaned up.
 */
async function extractReferenceText(refFile?: ReferenceFile): Promise<string> {
  if (!refFile || !refFile.base64Data) return "";
  
  if (refFile.size > 10 * 1024 * 1024) {
    console.warn(`[RefFile] Fichier ${refFile.name} dépasse la limite de 10 Mo.`);
    return "";
  }

  try {
    const base64Str = refFile.base64Data.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Str, "base64");
    const nameLower = refFile.name.toLowerCase();
    const mimeLower = (refFile.type || "").toLowerCase();

    let text = "";

    if (nameLower.endsWith(".pdf") || mimeLower.includes("pdf")) {
      let pdfParse: any;
      try {
        const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js" as any);
        pdfParse = pdfParseModule.default || pdfParseModule;
      } catch (_) {
        try {
          const pdfParseModule = await import("pdf-parse");
          pdfParse = (pdfParseModule as any).default || pdfParseModule;
        } catch (_) {
          console.warn("[RefFile] Impossible de charger pdf-parse.");
        }
      }
      if (pdfParse) {
        const parsed = await pdfParse(buffer);
        text = parsed.text || "";
      }
    } else if (nameLower.endsWith(".docx") || mimeLower.includes("wordprocessingml")) {
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || "";
      } catch (e) {
        console.warn("[RefFile] Impossible de lire le fichier docx :", e);
      }
    } else {
      text = buffer.toString("utf-8");
    }

    const cleanText = text.replace(/[\r\n]{3,}/g, "\n\n").trim();
    if (!cleanText) return "";

    const maxChars = 20000;
    const truncated = cleanText.length > maxChars ? cleanText.slice(0, maxChars) + "\n...[Texte du document tronqué pour optimisation]" : cleanText;

    console.log(`[RefFile] Extraits ${cleanText.length} caractères depuis le fichier ${refFile.name}.`);

    return `\n\n--- DOCUMENT DE RÉFÉRENCE FOURNI PAR L'UTILISATEUR (Fichier : ${refFile.name}) ---\nUtilise les informations de ce document comme contexte prioritaire et référence explicite pour enrichir la génération :\n\n${truncated}\n--- FIN DU DOCUMENT DE RÉFÉRENCE ---\n`;
  } catch (err: any) {
    console.error("[RefFile] Erreur lors de l'extraction du document de référence :", err?.message || err);
    return "";
  }
}

// Lazy initialize Gemini client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Language name map for prompt building
const languageNames: Record<Language, string> = {
  fr: "Français",
  en: "English",
  sw: "Kiswahili"
};

// Prompt builder for Business Plan
function buildBusinessPlanPrompt(data: BusinessPlanPayload): string {
  const targetLang = languageNames[data.language] || "Français";
  return `Génère un Business Plan complet, professionnel et directement exploitable rédigé en ${targetLang}.

Informations fournies par l'utilisateur :
- Nom du projet / entreprise : ${data.projectName || "Non spécifié (créer un nom suggéré ou utiliser [Nom du projet])"}
- Description de l'idée d'affaires : ${data.ideaDescription}
- Secteur d'activité : ${data.sector || "Non spécifié"}
- Ville / Province en RDC : ${data.location || "République Démocratique du Congo (RDC)"}
- Clientèle / Bénéficiaires visés : ${data.targetAudience || "Non spécifié"}
- Problème résolu : ${data.problemSolved || "Non spécifié"}
- Budget disponible estimé : ${data.budget || "Non spécifié"}
- Informations complémentaires : ${data.additionalInfo || "Aucune"}

Format de sortie attendu (utilises des titres Markdown clairs, des puces et des tableaux simples si opportun) :
# BUSINESS PLAN : ${data.projectName || "Projet d'Entreprise"}

## 1. Résumé Exécutif
## 2. Problème Identifié et Analyse du Besoin
## 3. Solution Proposée & Proposition de Valeur
## 4. Analyse du Marché Cible & Contexte Local (RDC / ${data.location || "RDC"})
## 5. Offre de Produits ou Services
## 6. Modèle Économique (Génération de revenus)
## 7. Stratégie Marketing et Commerciale
## 8. Plan Opérationnel et Logistique
## 9. Ressources Nécessaires (Humaines, Matérielles, Financières)
## 10. Hypothèses Financières Simples (Budget & Prévisions)
## 11. Analyse des Risques et Mesures d'Atténuation
## 12. Plan d'Action Priorisé (3 étapes clés)
## 13. Recommandations Stratégiques

Directives strictes :
- N'invente pas de statistiques nationales ou de chiffres exacts présentés comme certains.
- Si une donnée manque (par exemple le budget ou la clientèle), identifie-la clairement avec la mention '[Hypothèse : ...]' et invite l'utilisateur à vérifier.
- Adapte le ton au contexte de la RDC.
- Rédige entièrement en ${targetLang}.`;
}

// Prompt builder for Administrative Documents
function buildAdminDocPrompt(data: AdminDocPayload): string {
  const targetLang = languageNames[data.language] || "Français";
  const docTypeLabel = data.docType === "autre" && data.customDocType ? data.customDocType : data.docType;

  return `Rédige un document administratif formel et conforme de type "${docTypeLabel}" en ${targetLang}.

Données fournies :
- Type de document : ${docTypeLabel}
- Langue : ${targetLang}
- Ton souhaité : ${data.tone}
- Expéditeur : ${data.senderInfo || "[Nom / Organisation de l'expéditeur]"}
- Destinataire : ${data.recipientInfo || "[Nom / Fonction du destinataire]"}
- Objet : ${data.subject || "[Objet du document]"}
- Contexte : ${data.context || "Non spécifié"}
- Éléments spécifiques à inclure : ${data.detailsToInclude || "Aucun détail supplémentaire"}
- Date et lieu : ${data.dateLocation || "[Lieu et Date]"}

Structure attendue pour le document :
- En-tête avec coordonnées ou espaces réservés
- Date et Lieu
- Objet explicite
- Formule d'appel formelle
- Introduction contextualisée
- Corps de texte structuré et clair
- Conclusion et demande précise
- Formule de politesse appropriée au ton ${data.tone}
- Espace de signature (Nom, Titre)

Règles impératives :
- N'invente AUCUN nom propre, fonction, référence juridique ou coordonnées non fournis. Utilise des crochets d'espace réservé comme [Nom complet], [Référence légale] ou [Adresse] là où c'est nécessaire.
- Rédige le document complet directement réutilisable.
- Rédige entièrement en ${targetLang}.`;
}

// Prompt builder for Professional Emails
function buildEmailPrompt(data: EmailPayload): string {
  const targetLang = languageNames[data.language] || "Français";

  return `Rédige un e-mail professionnel clair, concis et directement envoyable en ${targetLang}.

Données fournies :
- Objet ou objectif de l'e-mail : ${data.subjectOrGoal}
- Destinataire / Rôle : ${data.recipientRole || "Partenaire / Client / Collaborateur"}
- Contexte : ${data.context || "Non spécifié"}
- Points essentiels à aborder : ${data.keyPoints || "Non spécifié"}
- Ton : ${data.tone}
- Longueur souhaitée : ${data.length}
- Signature : ${data.senderSignature || "[Votre Nom]"}

Format de sortie attendu :
**Objet :** [Proposer un objet de mail percutant et professionnel]

[Salutation]

[Introduction courte]

[Message principal & argumentation selon le ton ${data.tone}]

[Appel à l'action clair (Next step)]

[Formule de politesse]

[Signature]

Règles :
- L'e-mail doit être immédiatement prêt à copier-coller.
- Rédige entièrement en ${targetLang}.`;
}

// Fallback Demo generator when GEMINI_API_KEY is not available
function generateDemoResponse(request: GenerationRequest): string {
  const { module, data } = request;
  const lang = data.language || 'fr';

  if (module === 'business_plan') {
    const bp = data as BusinessPlanPayload;
    const name = bp.projectName || "Projet d'Activité RDC";
    const loc = bp.location || "Kinshasa / Goma";
    const sec = bp.sector || "Agro-transformation & Commerce";

    return `# BUSINESS PLAN : ${name}
*Généré par GemmaWork RDC — Mode Démonstration*

## 1. Résumé Exécutif
Le projet **${name}**, localisé à **${loc}**, s'inscrit dans le secteur **${sec}**. Il vise à répondre directement aux besoins locaux en proposant une offre de qualité, accessible et adaptée aux réalités socio-économiques de la République Démocratique du Congo.

## 2. Problème Identifié et Analyse du Besoin
- **Problème :** ${bp.problemSolved || "Accès limité à des produits/services fiables et abordables sur le marché local."}
- **Contexte local :** Forte demande urbaine combinée à des ruptures fréquentes d'approvisionnement ou une qualité inégale des offres existantes.

## 3. Solution Proposée & Proposition de Valeur
- **Description :** ${bp.ideaDescription}
- **Proposition de valeur :** Produit/service disponible localement, respectant les normes d'hygiène/qualité, avec une politique de prix compétitive.

## 4. Analyse du Marché Cible
- **Zone géographique :** ${loc}
- **Clientèle visée :** ${bp.targetAudience || "Ménages, petites entreprises et institutions locales."}
- **Opportunité :** Marché en forte croissance stimulé par l'urbanisation et la recherche de solutions de proximité.

## 5. Modèle Économique & Ventes
- **Génération de revenus :** Vente directe et contrats d'approvisionnement réguliers.
- **Budget initial estimé :** ${bp.budget || "[Hypothèse : 5,000 USD à ajuster selon le dimensionnement]"}

## 6. Opérations & Logistique
- Approvisionnement auprès des producteurs/fournisseurs locaux.
- Stockage sécurisé et distribution directe.

## 7. Risques Majeurs & Atténuation
- **Risque de hausse des coûts d'énergie/transport :** *Atténuation :* Partenariats logistiques groupés et stock de précaution.
- **Risque de fluctuation des prix :** *Atténuation :* Diversification de la gamme de produits.

## 8. Plan d'Action Priorisé
1. **Mois 1 :** Finalisation de l'enregistrement administratif et aménagement du local.
2. **Mois 2 :** Lancement de la campagne de sensibilisation locale et premier stock.
3. **Mois 3 :** Évaluation des premières ventes et fidélisation de la clientèle.

> *Note de validation : Les données financières réelles devront être validées selon les coûts locaux à la date de démarrage.*`;
  }

  if (module === 'admin_doc') {
    const doc = data as AdminDocPayload;
    const docTitle = doc.docType === 'autre' && doc.customDocType ? doc.customDocType : doc.docType.toUpperCase().replace('_', ' ');

    return `**${doc.senderInfo || "[Nom de l'Expéditeur / Organisation]"}**
${doc.dateLocation || "Kinshasa, le [Date]"}

**À :** ${doc.recipientInfo || "[Nom & Fonction du Destinataire]"}

---

### **OBJET : ${doc.subject || "Demande administrative officielle"}**

${doc.recipientInfo ? "Monsieur / Madame le Destinataire," : "Monsieur / Madame,"}

Par la présente, je viens auprès de votre haute bienveillance solliciter votre attention concernant ${doc.context || "la démarche visée en objet"}.

${doc.detailsToInclude ? `En effet, ${doc.detailsToInclude}` : "Il sied de noter que cette démarche s'inscrit dans le cadre strict du respect des règles en vigueur et vise à renforcer nos relations de collaboration."}

Compte tenu de l'importance de ce dossier, je reste à votre entière disposition pour tout renseignement complémentaire ou entretien qu'il vous plairait de m'accorder.

Dans l'attente d'une suite favorable à ma demande, je vous prie d'agréer, ${doc.recipientInfo ? "Monsieur / Madame le Destinataire" : "Monsieur / Madame"}, l'expression de mes sentiments respectueux et dévoués.


________________________________________
**${doc.senderInfo || "[Nom & Signature de l'Expéditeur]"}**
[Fonction / Titre]`;
  }

  // Email
  const em = data as EmailPayload;
  return `**Objet :** ${em.subjectOrGoal || "Proposition de collaboration professionnelle"}

Bonjour ${em.recipientRole || "Cher Partenaire"},

Je vous contacte concernant ${em.context || "notre projet d'activités"}.

${em.keyPoints || "Je souhaitais vous partager nos éléments clés afin de faire progresser notre échange et convenir des prochaines étapes."}

Aimeriez-vous fixer un court échange (téléphonique ou en présentiel) cette semaine pour en discuter de vive voix ?

Je reste à votre disposition.

Bien cordialement,

**${em.senderSignature || "[Votre Nom]"}**`;
}

// Helper to generate content trying Gemma and Gemini models in order with safe timeout
async function generateWithGemini(ai: GoogleGenAI, prompt: string, systemInstruction: string, temperature = 0.7): Promise<string> {
  const modelsToTry = ["gemma-4-31b-it", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemma/Gemini API] Tentative de génération avec le modèle : ${model}`);
      const config: any = { temperature };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      let timer: NodeJS.Timeout | null = null;
      const response = await new Promise<any>((resolve, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timeout de 6.5s dépassé pour le modèle ${model}`));
        }, 6500);

        ai.models.generateContent({
          model,
          contents: prompt,
          config,
        })
        .then((res) => {
          if (timer) clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          if (timer) clearTimeout(timer);
          reject(err);
        });
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemma/Gemini API] Échec avec ${model} :`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("Aucun modèle IA valide n'a pu traiter la demande dans le temps imparti.");
}

// Health check endpoint
app.get(["/api/health", "/health"], (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({ status: "ok", mode: hasKey ? "live" : "demo" });
});

// Main Generation API endpoint
app.post(["/api/generate", "/generate"], async (req, res) => {
  const requestId = "req_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  
  try {
    const { module, data } = req.body as GenerationRequest;

    if (!module || !data) {
      return res.status(400).json({
        requestId,
        status: "error",
        error: "Paramètres manquants dans la requête."
      });
    }

    // Build prompt based on module
    let prompt = "";
    if (module === "business_plan") {
      const bp = data as BusinessPlanPayload;
      if (!bp.ideaDescription || bp.ideaDescription.trim() === "") {
        return res.status(400).json({
          requestId,
          status: "error",
          error: "La description de l'idée d'affaires est obligatoire."
        });
      }
      prompt = buildBusinessPlanPrompt(bp);
    } else if (module === "admin_doc") {
      prompt = buildAdminDocPrompt(data as AdminDocPayload);
    } else if (module === "email") {
      const em = data as EmailPayload;
      if (!em.subjectOrGoal || em.subjectOrGoal.trim() === "") {
        return res.status(400).json({
          requestId,
          status: "error",
          error: "L'objet ou l'objectif de l'e-mail est obligatoire."
        });
      }
      prompt = buildEmailPrompt(em);
    } else {
      return res.status(400).json({
        requestId,
        status: "error",
        error: "Module non reconnu."
      });
    }

    // Check for facultative reference file and extract text context
    if (data.referenceFile) {
      const refContext = await extractReferenceText(data.referenceFile);
      if (refContext) {
        prompt += refContext;
      }
    }

    const ai = getGenAI();

    // Fallback to demo mode if no valid API key is present
    if (!ai) {
      console.log(`[${requestId}] GEMINI_API_KEY absent. Utilisation du mode démonstration.`);
      const content = generateDemoResponse({ module, data });
      return res.json({
        requestId,
        content,
        status: "demo",
        isDemoMode: true,
        message: "Clé API non configurée — Résultat généré en mode démonstration locale."
      } as GenerationResponse);
    }

    console.log(`[${requestId}] Génération IA en cours pour le module ${module}...`);

    const outputText = await generateWithGemini(ai, prompt, SYSTEM_INSTRUCTION, 0.7);

    if (!outputText) {
      console.warn(`[${requestId}] Réponse vide de Gemini. Bascule sur le générateur de secours.`);
      const fallbackContent = generateDemoResponse({ module, data });
      return res.json({
        requestId,
        content: fallbackContent,
        status: "demo",
        isDemoMode: true
      } as GenerationResponse);
    }

    return res.json({
      requestId,
      content: outputText,
      status: "success",
      isDemoMode: false
    } as GenerationResponse);

  } catch (error: any) {
    console.error(`[${requestId}] Erreur lors de la génération :`, error?.message || error);
    
    // Provide robust fallback on AI call failure
    try {
      const { module, data } = req.body as GenerationRequest;
      if (module && data) {
        const fallbackContent = generateDemoResponse({ module, data });
        return res.json({
          requestId,
          content: fallbackContent,
          status: "demo",
          isDemoMode: true,
          message: "Mode de secours activé en raison d'une indisponibilité temporaire du service IA."
        } as GenerationResponse);
      }
    } catch (_) {}

    return res.status(500).json({
      requestId,
      status: "error",
      error: "Une erreur est survenue lors du traitement par l'assistant. Veuillez réessayer."
    });
  }
});

// Quick Email Actions Endpoint (Shorten, Expand, Formalize, Translate)
app.post(["/api/email-action", "/email-action"], async (req, res) => {
  const requestId = "req_act_" + Date.now().toString(36);

  try {
    const { content, action, targetLanguage } = req.body as QuickActionPayload;

    if (!content || !action) {
      return res.status(400).json({ status: "error", error: "Texte et action requis." });
    }

    let actionPrompt = "";
    if (action === "shorten") {
      actionPrompt = `Réécris le texte/e-mail suivant pour le rendre plus court, concis et direct sans perdre son sens principal :\n\n${content}`;
    } else if (action === "expand") {
      actionPrompt = `Développe le texte/e-mail suivant avec plus de détails, d'explications et de formules professionnelles appropriées :\n\n${content}`;
    } else if (action === "formalize") {
      actionPrompt = `Rends le texte/e-mail suivant très formel, poli et adapté à une administration ou haute direction :\n\n${content}`;
    } else if (action === "translate") {
      const langName = targetLanguage ? languageNames[targetLanguage] : "Français";
      actionPrompt = `Traduis fidèlement le texte/e-mail suivant en ${langName} en conservant la structure et le ton professionnel :\n\n${content}`;
    }

    const ai = getGenAI();

    if (!ai) {
      // Simple local transformation in demo mode
      let transformed = content;
      if (action === "shorten") {
        transformed = content.split("\n\n").slice(0, 3).join("\n\n") + "\n\n[Version raccourcie en mode démo]";
      } else if (action === "expand") {
        transformed = content + "\n\n*Note d'extension : Nous restons à votre entière disposition pour fournir toute pièce justificative additionnelle.*";
      } else if (action === "formalize") {
        transformed = content.replace(/Bonjour/g, "Monsieur / Madame le Directeur").replace(/Cordialement/g, "Veuillez agréer l'expression de ma très haute considération");
      } else if (action === "translate") {
        transformed = `[Traduction ${targetLanguage || 'EN'} (Mode Démo)]\n\n` + content;
      }
      return res.json({ requestId, content: transformed, status: "demo", isDemoMode: true });
    }

    const transformedText = await generateWithGemini(ai, actionPrompt, SYSTEM_INSTRUCTION, 0.5);

    return res.json({
      requestId,
      content: transformedText || content,
      status: "success",
      isDemoMode: false
    });

  } catch (err: any) {
    console.error("Erreur dans /api/email-action :", err?.message || err);
    return res.status(500).json({ status: "error", error: "Échec du traitement rapide de l'action." });
  }
});

// Global Express Error Handler to prevent raw 500 HTML responses on Vercel
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Express Error Handler]", err);
  if (!res.headersSent) {
    res.status(200).json({
      status: "demo",
      isDemoMode: true,
      content: "Une erreur temporaire est survenue côté serveur. Le document de secours a été généré.",
      message: err?.message || "Erreur serveur"
    });
  }
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`GemmaWork RDC server listening on http://0.0.0.0:${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

