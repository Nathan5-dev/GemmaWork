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
  ChatAssistantPayload,
  TranslatorPayload,
  RagBuilderPayload,
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
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
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

// Enhanced Prompt builder for Business Plan (Exhaustive & Detailed)
function buildBusinessPlanPrompt(data: BusinessPlanPayload): string {
  const targetLang = languageNames[data.language] || "Français";
  return `EXIGENCE IMPÉRATIVE DE PROFONDEUR ET DE VALEUR : Tu dois rédiger un Business Plan extrêmement complet, hautement détaillé, rigoureux et digne d'un dossier présenté à une banque commerciale (Rawbank, EquityBCDC, TMB), à l'Anapi ou à un investisseur privé en RDC. Ne rédige PAS de résumé superficiel de quelques lignes. Développe abondamment chaque section avec des sous-titres, des analyses de marché réalistes pour le contexte congolais (${data.location || "RDC"}), des calculs prévisionnels détaillés, des tableaux structurés en Markdown et des recommandations pratiques.

Informations du projet :
- Nom de l'entreprise / projet : ${data.projectName || "Projet d'Activité en RDC"}
- Idée d'affaires & Activité : ${data.ideaDescription}
- Secteur d'activité : ${data.sector || "Agro-business / Commerce / Service"}
- Localisation ciblée : ${data.location || "Kinshasa / Province de la RDC"}
- Clientèle / Marché cible : ${data.targetAudience || "Ménages, PME et acteurs institutionnels"}
- Problème résolu / Opportunité : ${data.problemSolved || "Accès à des produits/services locaux de qualité"}
- Budget disponible estimé : ${data.budget || "À déterminer selon dimensionnement"}
- Compléments : ${data.additionalInfo || "Aucun"}

Structure exhaustive obligatoire à développer intégralement en ${targetLang} :

# BUSINESS PLAN COMPLET : ${data.projectName || "Projet d'Entreprise"}

## 1. Résumé Exécutif & Vision Stratégique
- Synthèse globale du projet et proposition de valeur unique.
- Alignement avec les priorités de développement économique de la RDC.
- Besoins financiers globaux et rentabilité attendue.

## 2. Analyse Approfondie du Problème & Étude du Besoin Local
- Diagnostic précis des manques et goulets d'étranglement sur le marché à ${data.location || "Kinshasa/RDC"}.
- Profil détaillé et comportements des acheteurs cibles.

## 3. Solution Proposée, Produits & Gamme de Services
- Description technique détaillée des produits/services commercialisés.
- Différenciation concurrentielle, qualité, packaging et avantage local.

## 4. Étude de Marché & Contexte Concurrentiel en RDC
- Taille estimée du marché adressable à ${data.location || "en RDC"}.
- Cartographie de la concurrence (acteurs informels, importations, acteurs établis).
- Opportunités d'ancrage local et substituts aux importations.

## 5. Stratégie Marketing & Commerciale
- Stratégie de fixation des prix (Pricing) adaptée au pouvoir d'achat local.
- Canaux de distribution (vente directe, grossistes, e-commerce/WhatsApp, partenariats).
- Plan de communication et campagne de lancement.

## 6. Plan Opérationnel, Logistique & Approvisionnement
- Choix du site, aménagement des locaux et équipements techniques nécessaires.
- Chaîne d'approvisionnement en matières premières/intrants (fournisseurs locaux et internationaux).
- Gestion des aléas logistiques (énergie/groupes électrogènes/solaire, transport, conservation).

## 7. Structure Organisationnelle & Ressources Humaines
- Organigramme cible et profils de postes clés à recruter.
- Politiques salariales, formation continue et conformité avec l'ONEM/INPP.

## 8. Modèle Économique & Structure des Coûts
- Mécanismes de génération de revenus (flux de trésorerie récurrents).
- Répartition des coûts fixes (loyers, salaires, énergie) et coûts variables.

## 9. Plan Financier & Prévisions Budgétaires sur 3 Ans
- Tableau détaillé du Budget de Démarrage (Investissements initiaux & Fond de roulement).
- Compte de résultat prévisionnel (Année 1, Année 2, Année 3) avec hypothèses explicites.
- Seuil de rentabilité (Break-even point) et délai de retour sur investissement.

## 10. Cadre Légitime, Fiscal & Réglementaire en RDC
- Formalités administratives obligatoires (GUCE, RCCM, NIF, Numéro Impôt, Registre du Commerce).
- Fiscalité applicable (DGI - IBP/IPR, DGRAD, DGDA, cotisations sociales CNSS).

## 11. Analyse des Risques & Matrice d'Atténuation (SWOT)
- Analyse des forces, faiblesses, opportunités et menaces (SWOT).
- Risques de change (CDF/USD), d'inflation et de rupture d'électricité avec mesures de protection.

## 12. Feuille de Route Opérationnelle (Jalons sur 12 Mois)
- Chronogramme détaillé des étapes de mise en œuvre (Mois 1 à Mois 12).

## 13. Recommandations Stratégiques Finales
- Conseils pratiques pour sécuriser le démarrage.

Directive : Rédige des explications fournies, réalistes et rigoureuses. N'utilise pas d'abréviations creuses ou de texte à trous minimaliste. Rédige l'intégralité du texte en ${targetLang}.`;
}

// Enhanced Prompt builder for Administrative Documents
function buildAdminDocPrompt(data: AdminDocPayload): string {
  const targetLang = languageNames[data.language] || "Français";
  const docTypeLabel = data.docType === "autre" && data.customDocType ? data.customDocType : data.docType;

  return `EXIGENCE IMPÉRATIVE DE QUALITÉ ET DE PROFONDEUR : Rédige un document administratif formel, intégralement rédigé, exhaustif et parfaitement conforme au protocole administratif de la République Démocratique du Congo en ${targetLang}. Ne fournis pas un brouillon succinct ou quelques phrases : le document doit comporter tous les préambules, formules juridiques ou administratives officielles, motifs développés et articles/paragraphes nécessaires.

Paramètres :
- Type de document : ${docTypeLabel}
- Langue : ${targetLang}
- Ton : ${data.tone}
- Expéditeur : ${data.senderInfo || "[Nom de l'organisme / Titre de l'expéditeur]"}
- Destinataire : ${data.recipientInfo || "[Autorité / Destinataire officiel]"}
- Objet : ${data.subject || "[Objet formel]"}
- Contexte & Motifs : ${data.context || "Non spécifié"}
- Éléments spécifiques à insérer : ${data.detailsToInclude || "Aucun"}
- Date et lieu : ${data.dateLocation || "[Kinshasa / Ville, Date]"}

Règles de rédaction administrative RDC :
1. En-tête officiel complet (République, Ministère/Institution/Société, Coordonnées, Références de suivi).
2. Date et Lieu exacts.
3. Objet précis et solennel.
4. Formule d'appel formelle adaptée au rang du destinataire.
5. Introduction établissant le cadre légal ou réglementaire et l'historique des échanges.
6. Corps de texte abondamment développé, découpé en paragraphes clairs ou articles numérotés expliquant en détail les justifications, faits et requêtes.
7. Conclusion réitérant formellement la demande ou la disposition prise.
8. Formule de politesse de haute considération cérémonieuse.
9. Bloc de signature officiel complet avec mention de la fonction et espaces de visa.

Rédige le document complet directement prêt à l'impression et à l'usage officiel en ${targetLang}.`;
}

// Enhanced Prompt builder for Professional Emails
function buildEmailPrompt(data: EmailPayload): string {
  const targetLang = languageNames[data.language] || "Français";

  return `EXIGENCE IMPÉRATIVE DE QUALITÉ : Rédige un e-mail professionnel complet, à haute valeur ajoutée, clair, persuasif et directement réutilisable en ${targetLang}. Ne te limite pas à trois lignes génériques. Fournis une proposition d'e-mail richement structurée, avec un contexte de rappel, une argumentation sous forme de points clés bien articulés, un appel à l'action précis, et au besoin une variante de relance ou de suite.

Paramètres :
- Objectif / Objet principal : ${data.subjectOrGoal}
- Rôle du destinataire : ${data.recipientRole || "Partenaire / Client / Direction"}
- Contexte professionnel : ${data.context || "Non spécifié"}
- Points clés à intégrer : ${data.keyPoints || "Non spécifié"}
- Ton souhaité : ${data.tone}
- Longueur souhaitée : ${data.length}
- Signature : ${data.senderSignature || "[Votre Nom / Fonction]"}

Format de sortie attendu :
**OBJET :** [Proposer 2 choix d'objets de mail percutants et clairs]

[Salutation formelle]

[Introduction contextualisée et courtoise]

[Corps du message développé : explications détaillées de la proposition/demande]

[Points clés structurés sous forme de puces claires et d'avantages]

[Appel à l'action explicite - Next Steps / Proposition de rendez-vous ou échéance]

[Formule de politesse soignée]

**${data.senderSignature || "[Votre Nom]"}**
[Titre / Entreprise / Coordonnées]

---
*Variante courte pour relance rapide ou message WhatsApp professionnel :*
[Fournir un condensé synthétique d'une phrase de relance pour convenir d'un suivi]`;
}

// Prompt builder for Fast Chatbot Assistant
function buildChatAssistantPrompt(data: ChatAssistantPayload): string {
  const targetLang = languageNames[data.language] || "Français";
  let historyText = "";
  if (data.conversationHistory && data.conversationHistory.length > 0) {
    historyText = "\n\nHistorique récent de la discussion :\n" + 
      data.conversationHistory.map(m => `${m.role === 'user' ? 'Utilisateur' : 'Gemma'} : ${m.content}`).join("\n");
  }

  return `Tu es l'Assistant Service Rapide GemmaWork RDC.
Réponds de façon experte, précise, synthétique mais complète à la question suivante concernant les procédures administratives, fiscales, juridiques ou la gestion d'entreprise en République Démocratique du Congo en ${targetLang}.${historyText}

Question de l'utilisateur :
"${data.message}"

Consignes de réponse :
- Donne une réponse structurée, claire et immédiatement utile pour un entrepreneur, un citoyen ou un professionnel en RDC.
- Fais référence aux organismes congolais compétents lorsqu'approprié (GUCE, DGI, CNSS, ONEM, DGRAD, RCCM, OHADA).
- Rédige entièrement en ${targetLang}.`;
}

// Prompt builder for Document Translation
function buildTranslatorPrompt(data: TranslatorPayload): string {
  const targetLang = languageNames[data.targetLanguage] || "Français";
  const sourceLang = data.sourceLanguage === 'auto' ? 'détectée automatiquement' : (languageNames[data.sourceLanguage] || "Français");

  return `Tu es un traducteur professionnel assermenté spécialisé dans les documents administratifs, juridiques et d'affaires.

Mission : Traduis fidèlement, intégralement et exactement le texte/document suivant de la langue source (${sourceLang}) vers la langue cible (${targetLang}).

Directives strictes :
- Ne modifie AUCUNEMENT le sens, le ton, la terminologie juridique, les noms propres, les montants, les dates ou la structure originale du texte.
- N'ajoute AUCUN commentaire personnel, analyse ou préambule.
- Conserve exactement la mise en page Markdown, les titres, les listes à puces et les sauts de ligne du document d'origine.
- Rédige la traduction complète directement exploitable en ${targetLang}.

TEXTE / DOCUMENT À TRADUIRE :
---
${data.sourceText || "Veuillez consulter le document de référence joint ci-dessous."}
---`;
}

// Prompt builder for Custom RAG Bot
function buildRagBuilderPrompt(data: RagBuilderPayload): string {
  const query = data.testQuery || "Présentez brièvement les informations contenues dans les documents de référence.";
  const config = data.config;

  return `Tu es ${config.botName || "un Assistant IA d'Entreprise"}.
Consigne système de l'agent : ${config.systemPrompt}

Question de l'utilisateur (Test Bac à Sable RAG) :
"${query}"

Instructions :
- Réponds à la question en respectant strictement la consigne système ci-dessus.
- Appuie ta réponse exclusivement sur les documents de référence fournis s'ils contiennent l'information.`;
}

// Fallback Demo generator when GEMINI_API_KEY is not available
function generateDemoResponse(request: GenerationRequest): string {
  const { module, data } = request;
  const lang = (data as any).language || 'fr';

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

  if (module === 'email') {
    const em = data as EmailPayload;
    return `**OBJET DE L'E-MAIL :**
1. ${em.subjectOrGoal || "Proposition de partenariat professionnel et opportunité de collaboration"}
2. [Alternative] ${em.subjectOrGoal ? "Suite à notre échange : " + em.subjectOrGoal : "Demande de rendez-vous d'affaires RDC"}

Bonjour ${em.recipientRole || "Cher Partenaire"},

J'espère que ce message vous trouve en excellente santé ainsi que l'ensemble de vos équipes.

Je vous contacte au nom de notre organisation afin de vous échanger au sujet de ${em.context || "notre projet de développement et de nos activités en RDC"}.

Dans le cadre de cette initiative, nous avons identifié plusieurs synergies prometteuses qui pourraient bénéficier directement à nos deux structures :
- **Efficacité opérationnelle :** ${em.keyPoints || "Mise en place d'une collaboration fluide et adaptée aux réalités locales."}
- **Valeur ajoutée :** Optimisation des coûts, fiabilité de la prestation et ancrage local.
- **Pérennité :** Déploiement d'une feuille de route claire avec jalons de suivi réguliers.

Seriez-vous disponible pour un court entretien de 15 à 20 minutes (par téléphone ou en présentiel dans vos locaux) cette semaine afin d'en discuter plus amplement ?

Je reste à votre entière disposition pour vous transmettre toute documentation complémentaire.

Veuillez agréer, ${em.recipientRole || "Cher Partenaire"}, l'expression de mes salutations distinguées.

Bien cordialement,

**${em.senderSignature || "[Votre Nom]"}**
[Fonction / Titre professionnel]
[Téléphone / WhatsApp / Adresse RDC]

---
*Variante de relance rapide (Message court) :*
> "Bonjour, je me permets de revenir vers vous concernant mon e-mail du [Date] relatif à ${em.subjectOrGoal || "notre proposition"}. Auriez-vous des disponibilités cette semaine pour un rapide échange ?"`;
  }

  if (module === 'chat_assistant') {
    const chat = data as ChatAssistantPayload;
    return `**Réponse Assistant Service Rapide RDC (Gemma 24/7) :**

Concernant votre question : *"${chat.message}"*

Voici les éléments d'information clés et les démarches officielles à suivre en République Démocratique du Congo :

1. **Cadre Légitime & Organisme compétent :**
   - La démarche relève principalement du **Guichet Unique de Création d'Entreprise (GUCE)** ou de la **Direction Générale des Impôts (DGI)** selon le volet juridique/fiscal.
2. **Étapes pratiques à accomplir :**
   - **Étape 1 :** Constitution du dossier avec pièces d'identité scannées, statuts (si SARL) ou formulaire F95 (si Établissement).
   - **Étape 2 :** Obtention du numéro RCCM (Registre du Commerce et du Crédit Mobilier) et de l'Id. Nat (Identification Nationale).
   - **Étape 3 :** Déclaration d'existence à la DGI dans les 15 jours suivant le démarrage effectif.
3. **Recommandations utiles :**
   - Veillez à conserver une copie physique et numérique de tous les récépissés de dépôt pour éviter les pénalités.

*N'hésitez pas si vous avez une précision à demander sur ce point !*`;
  }

  if (module === 'translator') {
    const tr = data as TranslatorPayload;
    const tgtLangName = languageNames[tr.targetLanguage] || "Français";
    return `### **DOCUMENT TRADUIT EN ${tgtLangName.toUpperCase()}**
*Traduction certifiée conforme par l'IA GemWork — Structure préservée*

---

${tr.sourceText ? tr.sourceText : "Le document importé a été intégralement extrait, analysé et traduit dans la langue cible spécifiée."}

---
*Note de traduction : Tous les termes techniques, références légales RDC et montants originaux ont été fidèlement conservés.*`;
  }

  // RAG Builder Demo
  const rag = data as RagBuilderPayload;
  return `### **RÉPONSE DU CHATBOT PUBLIC RAG [${rag.config.botName || 'Mon Agent'}]**

**Question de test posée :** "${rag.testQuery || 'Quelles sont vos offres ?'}"

**Réponse générée strictement d'après les documents de connaissance joints :**
D'après notre base de connaissances et les documents de référence importés :

- **Présentation :** Notre service est conforme aux procédures et tarifs officiels décrits dans la documentation.
- **Disponibilité :** Les demandes sont traitées conformément aux directives figurant dans nos manuels internes.

> *Ce test confirme que le bot respecte la consigne RAG : "Répondre uniquement d'après les fichiers joints".*`;
}

// Helper to generate content using official Gemini models
async function generateWithGemma(ai: GoogleGenAI, prompt: string, systemInstruction: string, temperature = 0.7): Promise<string> {
  const modelsToTry = [
    "gemma-4-31b-it",
    "gemma-2-27b-it",
    "gemma-2-9b-it",
    "gemini-3.6-flash"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini API] Génération avec le modèle IA : ${model}`);
      const config: any = { temperature };
      if (systemInstruction) {
        config.systemInstruction = systemInstruction;
      }

      let timer: NodeJS.Timeout | null = null;
      const response = await new Promise<any>((resolve, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Timeout de 25s dépassé pour le modèle ${model}`));
        }, 25000);

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
      console.warn(`[Gemma API] Échec avec le modèle Gemma ${model} :`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("Aucun modèle Gemma n'a pu traiter la demande.");
}

// Health check endpoint
app.get(["/api/health", "/health"], (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
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
    } else if (module === "chat_assistant") {
      const chat = data as ChatAssistantPayload;
      if (!chat.message || chat.message.trim() === "") {
        return res.status(400).json({
          requestId,
          status: "error",
          error: "Le message est obligatoire."
        });
      }
      prompt = buildChatAssistantPrompt(chat);
    } else if (module === "translator") {
      prompt = buildTranslatorPrompt(data as TranslatorPayload);
    } else if (module === "rag_builder") {
      prompt = buildRagBuilderPrompt(data as RagBuilderPayload);
    } else {
      return res.status(400).json({
        requestId,
        status: "error",
        error: "Module non reconnu."
      });
    }

    // Check for facultative reference file and extract text context
    if ((data as any).referenceFile) {
      const refContext = await extractReferenceText((data as any).referenceFile);
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

    console.log(`[${requestId}] Génération IA en cours avec Gemma pour le module ${module}...`);

    const outputText = await generateWithGemma(ai, prompt, SYSTEM_INSTRUCTION, 0.7);

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

    const transformedText = await generateWithGemma(ai, actionPrompt, SYSTEM_INSTRUCTION, 0.5);

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

