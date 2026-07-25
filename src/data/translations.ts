import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  subtitle: string;
  selectLanguage: string;
  help: string;
  home: string;
  demoModeBadge: string;
  demoModeTooltip: string;
  modules: {
    businessPlan: {
      title: string;
      desc: string;
      badge: string;
    };
    adminDoc: {
      title: string;
      desc: string;
      badge: string;
    };
    email: {
      title: string;
      desc: string;
      badge: string;
    };
    chatAssistant: {
      title: string;
      desc: string;
      badge: string;
    };
    translator: {
      title: string;
      desc: string;
      badge: string;
    };
    ragBuilder: {
      title: string;
      desc: string;
      badge: string;
    };
  };
  actions: {
    generate: string;
    generating: string;
    copy: string;
    copied: string;
    edit: string;
    preview: string;
    downloadPdf: string;
    downloading: string;
    trySample: string;
    reset: string;
    regenerate: string;
    shorten: string;
    expand: string;
    formalize: string;
    translateTo: string;
    backToHome: string;
  };
  labels: {
    required: string;
    optional: string;
    outputLanguage: string;
    tone: string;
    length: string;
    location: string;
    sector: string;
    budget: string;
    projectName: string;
    ideaDesc: string;
    targetAudience: string;
    problemSolved: string;
    additionalInfo: string;
    docType: string;
    senderInfo: string;
    recipientInfo: string;
    subject: string;
    context: string;
    detailsToInclude: string;
    dateLocation: string;
    recipientRole: string;
    keyPoints: string;
    senderSignature: string;
    customDocType: string;
  };
  tones: {
    formel: string;
    neutre: string;
    cordial: string;
    persuasif: string;
    direct: string;
  };
  docTypes: {
    lettre_officielle: string;
    demande: string;
    rapport_court: string;
    attestation: string;
    note_service: string;
    lettre_motivation: string;
    autre: string;
  };
  lengths: {
    courte: string;
    standard: string;
    detaillee: string;
  };
  results: {
    placeholderTitle: string;
    placeholderDesc: string;
    disclaimer: string;
    hypothesisNotice: string;
    editModeHint: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "GemWork",
    tagline: "Assistant IA de productivité pour la RDC",
    subtitle: "Créez vos documents professionnels en quelques minutes avec l'IA.",
    selectLanguage: "Langue de l'interface",
    help: "Aide & Guide",
    home: "Accueil",
    demoModeBadge: "Mode Démo",
    demoModeTooltip: "Génère des réponses d'exemple de haute qualité sans clé API configurée.",
    modules: {
      businessPlan: {
        title: "Business Plan IA",
        desc: "Transformez votre idée d'activité en un projet d'affaires structuré, crédible et adapté à la RDC.",
        badge: "PME & Startups"
      },
      adminDoc: {
        title: "Documents Administratifs IA",
        desc: "Rédigez des lettres officielles, demandes, notes de service et attestations conformes.",
        badge: "Administration & ONG"
      },
      email: {
        title: "E-mail Professionnel IA",
        desc: "Composez des messages clairs et percutants pour vos partenaires, clients ou autorités.",
        badge: "Productivité Rapide"
      },
      chatAssistant: {
        title: "Assistant Service Rapide",
        desc: "Posez vos questions administratives, fiscales et juridiques RDC et obtenez des réponses instantanées.",
        badge: "Chatbot Instantané"
      },
      translator: {
        title: "Traducteur de Documents",
        desc: "Traduisez fidèlement vos fichiers et textes (Français, English, Swahili) sans altérer leur structure.",
        badge: "Fidélité & Format"
      },
      ragBuilder: {
        title: "Créateur Chatbot Public RAG",
        desc: "Configurez un agent IA répondant exclusivement d'après vos propres documents d'entreprise.",
        badge: "Base Connaissances RAG"
      }
    },
    actions: {
      generate: "Générer le document",
      generating: "Génération par Gemma en cours...",
      copy: "Copier le texte",
      copied: "Copié dans le presse-papier !",
      edit: "Mode Édition",
      preview: "Aperçu mis en page",
      downloadPdf: "Exporter en PDF",
      downloading: "Préparation du PDF...",
      trySample: "Charger un exemple congolais",
      reset: "Réinitialiser",
      regenerate: "Relancer la génération",
      shorten: "Raccourcir",
      expand: "Développer",
      formalize: "Rendre plus formel",
      translateTo: "Traduire en",
      backToHome: "Retour à l'accueil"
    },
    labels: {
      required: "Obligatoire",
      optional: "Optionnel",
      outputLanguage: "Langue du document généré",
      tone: "Ton de rédaction",
      length: "Longueur souhaitée",
      location: "Ville / Province ciblée (RDC)",
      sector: "Secteur d'activité",
      budget: "Budget estimé disponible",
      projectName: "Nom du projet ou de l'entreprise",
      ideaDesc: "Description de l'idée d'affaires ou du projet",
      targetAudience: "Clientèle ou bénéficiaires visés",
      problemSolved: "Problème résolu / Besoin identifié",
      additionalInfo: "Informations complémentaires utiles",
      docType: "Type de document administratif",
      senderInfo: "Expéditeur (Nom, Titre ou Organisation)",
      recipientInfo: "Destinataire (Nom, Fonction ou Organisation)",
      subject: "Objet du document",
      context: "Contexte de la démarche",
      detailsToInclude: "Éléments clés à inclure",
      dateLocation: "Date et lieu d'émission",
      recipientRole: "Destinataire ou rôle du destinataire",
      keyPoints: "Points essentiels à aborder",
      senderSignature: "Nom de signature / Expéditeur",
      customDocType: "Précisez le type de document"
    },
    tones: {
      formel: "Formel / Officiel",
      neutre: "Neutre / Professionnel",
      cordial: "Cordial / Chaleureux",
      persuasif: "Persuasif / Commercial",
      direct: "Direct / Synthétique"
    },
    docTypes: {
      lettre_officielle: "Lettre officielle administrative",
      demande: "Demande (de stage, subside, autorisation, service)",
      rapport_court: "Rapport court / Compte-rendu",
      attestation: "Attestation / Certificat",
      note_service: "Note de service interne",
      lettre_motivation: "Lettre de motivation",
      autre: "Autre document sur-mesure"
    },
    lengths: {
      courte: "Courte (~ 150 mots)",
      standard: "Standard (~ 300 mots)",
      detaillee: "Détaillée (~ 500 mots)"
    },
    results: {
      placeholderTitle: "Votre document généré apparaîtra ici",
      placeholderDesc: "Remplissez le formulaire à gauche et cliquez sur « Générer le document » pour obtenir votre texte prêt à l'emploi.",
      disclaimer: "Les faits, chiffres et références réglementaires spécifiques doivent être vérifiés par l'utilisateur avant transmission officielle.",
      hypothesisNotice: "Note : Certaines informations absentes du formulaire ont été complétées sous forme d'hypothèses à vérifier.",
      editModeHint: "Vous pouvez modifier directement le texte ci-dessous avant d'exporter ou de copier."
    }
  },
  en: {
    appName: "GemWork",
    tagline: "AI Productivity Assistant",
    subtitle: "Create your professional documents in minutes with AI.",
    selectLanguage: "Interface Language",
    help: "Help & Guide",
    home: "Home",
    demoModeBadge: "Demo Mode",
    demoModeTooltip: "Generates high quality sample outputs without an API key configured.",
    modules: {
      businessPlan: {
        title: "AI Business Plan",
        desc: "Turn your business idea into a structured, credible business proposal adapted to the DRC context.",
        badge: "SMEs & Startups"
      },
      adminDoc: {
        title: "AI Administrative Documents",
        desc: "Draft compliant official letters, applications, memos, and attestations.",
        badge: "Administration & NGOs"
      },
      email: {
        title: "AI Professional Email",
        desc: "Compose clear and impactful messages for partners, clients, or institutional authorities.",
        badge: "Fast Productivity"
      },
      chatAssistant: {
        title: "Fast Service Assistant",
        desc: "Ask your DRC administrative, tax, and legal questions for instant authoritative answers.",
        badge: "Instant Chatbot"
      },
      translator: {
        title: "Document Translator",
        desc: "Faithfully translate your files and text (French, English, Swahili) while preserving layout.",
        badge: "Exact Translation"
      },
      ragBuilder: {
        title: "Custom Public RAG Bot Builder",
        desc: "Set up a custom AI chatbot that answers strictly based on your uploaded company documents.",
        badge: "RAG Knowledge Base"
      }
    },
    actions: {
      generate: "Generate Document",
      generating: "Generating with Gemma...",
      copy: "Copy Text",
      copied: "Copied to clipboard!",
      edit: "Edit Mode",
      preview: "Formatted Preview",
      downloadPdf: "Export as PDF",
      downloading: "Preparing PDF...",
      trySample: "Load Congolese Example",
      reset: "Reset",
      regenerate: "Regenerate",
      shorten: "Shorten",
      expand: "Expand",
      formalize: "Make Formal",
      translateTo: "Translate to",
      backToHome: "Back to Home"
    },
    labels: {
      required: "Required",
      optional: "Optional",
      outputLanguage: "Output Document Language",
      tone: "Writing Tone",
      length: "Desired Length",
      location: "Target City / Province (DRC)",
      sector: "Industry Sector",
      budget: "Estimated Available Budget",
      projectName: "Project / Company Name",
      ideaDesc: "Description of the Business Idea",
      targetAudience: "Target Audience or Beneficiaries",
      problemSolved: "Problem Solved / Key Need",
      additionalInfo: "Additional Useful Information",
      docType: "Administrative Document Type",
      senderInfo: "Sender (Name, Title, or Org)",
      recipientInfo: "Recipient (Name, Role, or Org)",
      subject: "Document Subject / Subject line",
      context: "Context or Purpose",
      detailsToInclude: "Key Details to Include",
      dateLocation: "Date and Place of Emission",
      recipientRole: "Recipient or Recipient Role",
      keyPoints: "Key Points to Cover",
      senderSignature: "Signature Name / Sender",
      customDocType: "Specify Document Type"
    },
    tones: {
      formel: "Formal / Official",
      neutre: "Neutral / Professional",
      cordial: "Cordial / Warm",
      persuasif: "Persuasive / Sales",
      direct: "Direct / Concise"
    },
    docTypes: {
      lettre_officielle: "Official Administrative Letter",
      demande: "Request / Application (Internship, Grant, Service)",
      rapport_court: "Short Report / Minutes",
      attestation: "Attestation / Certificate",
      note_service: "Internal Service Note / Memo",
      lettre_motivation: "Cover Letter",
      autre: "Custom Document"
    },
    lengths: {
      courte: "Short (~ 150 words)",
      standard: "Standard (~ 300 words)",
      detaillee: "Detailed (~ 500 words)"
    },
    results: {
      placeholderTitle: "Your generated document will appear here",
      placeholderDesc: "Fill out the form on the left and click 'Generate Document' to obtain your ready-to-use text.",
      disclaimer: "Specific facts, statistics, and legal references should be verified by the user before official transmission.",
      hypothesisNotice: "Note: Missing information from the form has been formulated as placeholders/hypotheses for verification.",
      editModeHint: "You can edit the text directly below before copying or exporting."
    }
  },
  sw: {
    appName: "GemWork",
    tagline: "Msaidizi wa AI wa uzalishaji na biashara",
    subtitle: "Tengeneza nyaraka zako za kitaalamu kwa dakika chache ukitumia AI.",
    selectLanguage: "Lugha ya Mfumo",
    help: "Msaada na Mwongozo",
    home: "Nyumbani",
    demoModeBadge: "Hali ya Onyesho",
    demoModeTooltip: "Inatengeneza majibu ya mfano bila haja ya funguo ya API.",
    modules: {
      businessPlan: {
        title: "Mpango wa Biashara (AI)",
        desc: "Badilisha wazo lako la biashara kuwa mradi uliojipanga vyema kulingana na Kongo.",
        badge: "Biashara Ndogo & Startups"
      },
      adminDoc: {
        title: "Nyaraka za Kiserikali (AI)",
        desc: "Andika barua rasmi, maombi, ripoti fupi na vyeti vinavyokubalika.",
        badge: "Utawala & Mashirika"
      },
      email: {
        title: "Barua Pepe ya Kitaalamu (AI)",
        desc: "Tengeneza ujumbe wazi na wenye nguvu kwa washirika, wateja au mamlaka.",
        badge: "Uzalishaji wa Haraka"
      },
      chatAssistant: {
        title: "Msaidizi wa Huduma ya Haraka",
        desc: "Uliza maswali ya kiserikali, kodi na sheria katika RDC na upate majibu ya papo hapo.",
        badge: "Chatbot ya Haraka"
      },
      translator: {
        title: "Mtafsiri wa Nyaraka",
        desc: "Tafsiri faili na maandishi yako kwa usahihi (Kifaransa, Kiingereza, Kiswahili) bila kubadilisha muundo.",
        badge: "Utafsiri wa Kweli"
      },
      ragBuilder: {
        title: "Mjenzi wa Chatbot ya Umma RAG",
        desc: "Tengeneza chatbot ya AI inayojibu maswali kwa kutumia nyaraka zako za kampuni pekee.",
        badge: "Hifadhi ya Nyaraka RAG"
      }
    },
    actions: {
      generate: "Tengeneza Hati",
      generating: "Inatengeneza kupitia Gemma...",
      copy: "Kiliandika Maandishi",
      copied: "Imenakiliwa kwenye hifadhi!",
      edit: "Hali ya Kuhariri",
      preview: "Onyesho la Hati",
      downloadPdf: "Pakua kama PDF",
      downloading: "Inatayarisha PDF...",
      trySample: "Pakia Mfano wa Kongo",
      reset: "Weka Upya",
      regenerate: "Tengeneza Tena",
      shorten: "Fupisha",
      expand: " Ongeza Maelezo",
      formalize: "Fanya iwe Rasmi zaidi",
      translateTo: "Tafsiri kwa",
      backToHome: "Rudi Nyumbani"
    },
    labels: {
      required: "Inahitajika",
      optional: "Hiari",
      outputLanguage: "Lugha ya Hati Inayotoka",
      tone: "Sauti ya Uandishi",
      length: "Urefu Unaoitaji",
      location: "Mji / Mkoa (RDC)",
      sector: "Sekta ya Biashara",
      budget: "Bajeti Inayopatikana",
      projectName: "Jina la Mradi au Kampuni",
      ideaDesc: "Maelezo ya Wazo la Biashara",
      targetAudience: "Wateja au Walengwa",
      problemSolved: "Tatizo Linatatsuliwa / Hitaji",
      additionalInfo: "Maelezo Zaidi Yanayosaidia",
      docType: "Aina ya Hati ya Kiserikali",
      senderInfo: "Mtumaji (Jina, Cheo au Shirika)",
      recipientInfo: "Mpokeaji (Jina, Cheo au Shirika)",
      subject: "Lengo / Mada ya Hati",
      context: "Muktadha wa Ombi",
      detailsToInclude: "Mambo Muhimu ya Kuweka",
      dateLocation: "Tarehe na Mahali",
      recipientRole: "Mpokeaji au Cheo chake",
      keyPoints: "Hoja Kuu za Kueleza",
      senderSignature: "Jina la Mtumaji / Saini",
      customDocType: "Taja Aina ya Hati"
    },
    tones: {
      formel: "Rasmi / Ya Kiserikali",
      neutre: "Kawaida / Kitaalamu",
      cordial: "Ya Kirafiki / Chuchu",
      persuasif: "Ya Kushawishi",
      direct: "Ya Moja kwa Moja"
    },
    docTypes: {
      lettre_officielle: "Barua Rasmi ya Serikali",
      demande: "Ombi (Kazi, Mafunzo, Msaada)",
      rapport_court: "Ripoti Fupi",
      attestation: "Hati ya Udhibitisho",
      note_service: "Tangazo la Ndani",
      lettre_motivation: "Barua ya Maombi ya Kazi",
      autre: "Hati Nyingine"
    },
    lengths: {
      courte: "Fupi (~ Maneno 150)",
      standard: "Kawaida (~ Maneno 300)",
      detaillee: "Ndefu (~ Maneno 500)"
    },
    results: {
      placeholderTitle: "Hati yako iliyotengenezwa itaonekana hapa",
      placeholderDesc: "Jaza fomu upande wa kushoto kisha ubonyeze 'Tengeneza Hati'.",
      disclaimer: "Tafadhali hakikisha taarifa zote kabla ya kutuma rasmi.",
      hypothesisNotice: "Maelezo ambayo hayakujazwa yamewekwa kama nadharia ya kukaguliwa.",
      editModeHint: "Unaweza kuhariri maandishi haya kabla ya kupakua au kunakili."
    }
  }
};
