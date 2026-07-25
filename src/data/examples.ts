import { BusinessPlanPayload, AdminDocPayload, EmailPayload } from '../types';

export const sampleBusinessPlans: BusinessPlanPayload[] = [
  {
    projectName: "Manioc Express Kivu",
    ideaDescription: "Transformation moderne et distribution rapide de farine de manioc panifiable purifiée et empaquetée dans des sachets biodégradables de 1kg, 5kg et 25kg pour les ménages et boulangeries urbaines.",
    sector: "Agro-alimentaire & Transformation",
    location: "Goma, Nord-Kivu",
    targetAudience: "Ménages urbains, boulangeries artisanales et supermarchés de Goma et Bukavu.",
    problemSolved: "Rupture fréquente de farine de manioc de qualité hygiénique supérieure et réduction de la dépendance au blé d'importation coûteux.",
    budget: "12,000 USD",
    language: "fr",
    additionalInfo: "Partenariat prévu avec des coopératives agricoles de Rutshuru et Masisi."
  },
  {
    projectName: "Eco-Taxi Ndjili",
    ideaDescription: "Flotte de tricycles électriques à recharge solaire pour le transport urbain écologique de passagers et petites marchandises dans la commune de Ndjili et Tshangu à Kinshasa.",
    sector: "Transport & Énergie Renouvelable",
    location: "Kinshasa (Tshangu)",
    targetAudience: "Habitants, commerçants des marchés de Ndjili et banlieues de Kinshasa.",
    problemSolved: "Pollution sonore et de l'air, coût élevé des carburants fossiles et pénurie de transports abordables dans les zones périurbaines.",
    budget: "25,000 USD",
    language: "fr",
    additionalInfo: "Installation de 2 stations pilotes de recharge à panneaux solaires."
  },
  {
    projectName: "TechLab Katanga",
    ideaDescription: "Centre de formation pratique et d'incubation en codage informatique, réparation de smartphone/PC et maintenance solaire pour jeunes diplômés.",
    sector: "Éducation & Nouvelles Technologies",
    location: "Lubumbashi, Haut-Katanga",
    targetAudience: "Étudiants, jeunes chercheurs d'emploi et PME locales.",
    problemSolved: "Inadéquation entre l'enseignement théorique universitaire et les besoins technologiques des entreprises de la région minière.",
    budget: "18,000 USD",
    language: "fr",
    additionalInfo: "Mentorat assuré par des ingénieurs locaux et certification rapide."
  }
];

export const sampleAdminDocs: AdminDocPayload[] = [
  {
    docType: "demande",
    language: "fr",
    senderInfo: "Mulamba Jean-Paul, Étudiant en L2 Génie Électrique à l'Université de Kinshasa (UNIKIN)",
    recipientInfo: "Monsieur le Directeur Général de la SNEL (Société Nationale d'Électricité)",
    subject: "Demande de stage académique de deux mois au sein du Département de Distribution",
    context: "Stage obligatoire de fin de cycle universitaire visant à concrétiser les connaissances théoriques en réseaux électriques.",
    detailsToInclude: "Période souhaitée : du 1er septembre au 31 octobre 2026. Disponibilité immédiate. Attestation de l'université ci-jointe.",
    tone: "formel",
    dateLocation: "Kinshasa, le 25 Juillet 2026"
  },
  {
    docType: "lettre_officielle",
    language: "fr",
    senderInfo: "ONG Action Climat RDC - Bukavu",
    recipientInfo: "Monsieur le Chef de Division Provinciale de l'Environnement et Développement Durable",
    subject: "Notification du lancement du projet de reboisement communautaire dans le territoire de Kabare",
    context: "Projet financé dans le cadre de la protection des bassins versants contre l'érosion des sols.",
    detailsToInclude: "Objectif : plantation de 50 000 plants d'arbres. Invitation à la cérémonie officielle d'inauguration du mardi 12 août 2026.",
    tone: "formel",
    dateLocation: "Bukavu, le 25 Juillet 2026"
  },
  {
    docType: "attestation",
    language: "fr",
    senderInfo: "Direction des Ressources Humaines - Société Kivu Agro Sarl",
    recipientInfo: "À qui de droit",
    subject: "Attestation de fin de service et de bonne conduite",
    context: "Délivrance sur demande de l'intéressé suite à la fin régulière de son contrat à durée déterminée.",
    detailsToInclude: "Agent : Mme Kabedi Grace, poste : Supervisrice de collecte agricole de Janvier 2024 à Juin 2026. Services rendus avec professionnalisme.",
    tone: "neutre",
    dateLocation: "Goma, le 25 Juillet 2026"
  }
];

export const sampleEmails: EmailPayload[] = [
  {
    subjectOrGoal: "Demande d'audience officielle pour présentation de projet de numérisation",
    recipientRole: "Directeur Informatique de la REGIDESO Kinshasa",
    context: "Développement d'une application mobile permettant aux abonnés de signaler les fuites d'eau et consulter leurs factures à distance.",
    keyPoints: "Présentation d'une démo de 15 minutes, possibilité de test pilote sans frais engagés pour l'administration.",
    language: "fr",
    tone: "formel",
    length: "standard",
    senderSignature: "Kambale Serge, CEO de Mwinda Tech"
  },
  {
    subjectOrGoal: "Relance cordiale concernant le paiement de la facture de prestation N° 2026-042",
    recipientRole: "Chef de Département Finance chez Katanga Mining Logistics",
    context: "Prestation de maintenance informatique effectuée au début du mois de Juin 2026, échéance dépassée de 15 jours.",
    keyPoints: "Rappel des références de la facture, proposition d'assistance si besoin de précisions, demande de confirmation de la date d'exécution du virement.",
    language: "fr",
    tone: "cordial",
    length: "courte",
    senderSignature: "Ngalula Mireille, Gestionnaire de Compte"
  },
  {
    subjectOrGoal: "Partnership proposal for youth entrepreneurship workshop",
    recipientRole: "Program Officer at USAID / DRC Education Office",
    context: "Organizing a 3-day boot camp for 100 young women entrepreneurs in Kisangani.",
    keyPoints: "Brief introduction of our NGO, alignment with USAID education goals, request for technical sponsorship and mentorship participation.",
    language: "en",
    tone: "persuasif",
    length: "standard",
    senderSignature: "Kasongo David, Partnership Director"
  }
];
