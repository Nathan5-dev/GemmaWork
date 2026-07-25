export type ModuleType = 'business_plan' | 'admin_doc' | 'email';

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

export interface GenerationRequest {
  module: ModuleType;
  data: BusinessPlanPayload | AdminDocPayload | EmailPayload;
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

