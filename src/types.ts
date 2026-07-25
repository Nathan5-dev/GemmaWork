export type ModuleType = 'business_plan' | 'admin_doc' | 'email' | 'chat_assistant' | 'translator' | 'rag_builder';

export type Language = 'fr' | 'en' | 'sw';

export interface ReferenceFile {
  name: string;
  size: number;
  type: string;
  base64Data?: string; // base64 encoded payload for file uploading
}

export interface BusinessPlanPayload {
  projectName?: string;
  ideaDescription: string;
  sector?: string;
  location?: string;
  targetAudience?: string;
  problemSolved?: string;
  budget?: string;
  language: Language;
  additionalInfo?: string;
  referenceFile?: ReferenceFile;
}

export type AdminDocType = 
  | 'lettre_officielle'
  | 'demande'
  | 'rapport_court'
  | 'attestation'
  | 'note_service'
  | 'lettre_motivation'
  | 'autre';

export type Tone = 'formel' | 'neutre' | 'cordial' | 'persuasif' | 'direct';

export interface AdminDocPayload {
  docType: AdminDocType;
  customDocType?: string;
  language: Language;
  senderInfo?: string;
  recipientInfo?: string;
  subject?: string;
  context?: string;
  detailsToInclude?: string;
  tone: Tone;
  dateLocation?: string;
  referenceFile?: ReferenceFile;
}

export type EmailLength = 'courte' | 'standard' | 'detaillee';

export interface EmailPayload {
  subjectOrGoal: string;
  recipientRole?: string;
  context?: string;
  keyPoints?: string;
  language: Language;
  tone: Tone;
  length: EmailLength;
  senderSignature?: string;
  referenceFile?: ReferenceFile;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatAssistantPayload {
  message: string;
  conversationHistory?: ChatMessage[];
  language: Language;
  category?: 'administrative' | 'business' | 'tax_legal' | 'general';
}

export interface TranslatorPayload {
  sourceText?: string;
  sourceLanguage: 'auto' | Language;
  targetLanguage: Language;
  referenceFile?: ReferenceFile;
  preserveFormatting?: boolean;
}

export interface RagBotConfig {
  botName: string;
  systemPrompt: string;
  welcomeMessage: string;
  knowledgeFiles: ReferenceFile[];
  isPublic: boolean;
  allowedDomains?: string;
}

export interface RagBuilderPayload {
  config: RagBotConfig;
  testQuery?: string;
}

export interface GenerationRequest {
  module: ModuleType;
  data: BusinessPlanPayload | AdminDocPayload | EmailPayload | ChatAssistantPayload | TranslatorPayload | RagBuilderPayload;
}

export interface QuickActionPayload {
  content: string;
  action: 'shorten' | 'expand' | 'formalize' | 'translate';
  targetLanguage?: Language;
}

export interface GenerationResponse {
  requestId: string;
  content: string;
  status: 'success' | 'demo' | 'error';
  isDemoMode?: boolean;
  message?: string;
  error?: string;
}

export type ActiveTab = 'form' | 'result';

export type ThemeMode = 'light' | 'dark';

export interface LocalGemmaModel {
  id: string;
  name: string;
  specialty: string;
  size: string;
  isInstalled: boolean;
  version?: string;
}

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  aiModel: string;
  selectedLocalModelId: string | null;
}

