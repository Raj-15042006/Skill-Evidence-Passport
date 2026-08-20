export type Role = 'student' | 'verifier' | 'recruiter' | 'admin';

export type EvidenceType = 
  | 'REPOSITORY'
  | 'DOCUMENT'
  | 'PROJECT_URL'
  | 'CERTIFICATE'
  | 'VIDEO_DEMO'
  | 'CODE_SNIPPET';

export type EvidenceStatus = 
  | 'SUBMITTED'
  | 'AI_SCREENED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_INFO';

export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description: string;
  weight?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  domain?: string;
  taxonomyVersion: number;
  description: string;
  icon: string;
  keywords?: string[];
  rubricCriteria: RubricCriterion[];
}

export interface AIScoreResult {
  confidenceScore: number; // 0 to 1
  suggestedLevel: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  similarityFlag: boolean;
  rubricSuggestions: Record<string, number>;
  summary: string;
  modelVersion?: string;
  executionSource?: 'python-ml' | 'client-rules';
}

export interface VerificationDecision {
  id: string;
  evidenceId: string;
  verifierId: string;
  verifierName: string;
  verifierAvatar: string;
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_INFO';
  proficiencyLevel: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  rubricScores: Record<string, number>;
  totalScore: number;
  comments: string;
  decidedAt: string;
  overrodeAISuggestion?: boolean;
  overrideReason?: string;
}

export interface CertificateIssuerInfo {
  issuerId: string;
  issuerName: string;
  category: 'MNC' | 'PLATFORM' | 'INDIAN_UNIVERSITY' | 'GLOBAL_UNIVERSITY';
  logoUrl: string;
  brandColor: string;
  credentialId: string;
  signatureStatus: string;
  verificationEndpoint: string;
}

export interface Evidence {
  id: string;
  userId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  department: string;
  skillId: string;
  skillName: string;
  skillCategory: string;
  type: EvidenceType;
  title: string;
  description: string;
  fileRef: string;
  externalUrl?: string;
  status: EvidenceStatus;
  submittedAt: string;
  updatedAt: string;
  contentHash: string;
  aiScore?: AIScoreResult;
  verification?: VerificationDecision;
  needsInfoComment?: string;
  issuerInfo?: CertificateIssuerInfo; // Authenticated MNC / University Issuer Details
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  department?: string;
  graduationYear?: number;
  bio?: string;
  institution?: string;
  title?: string;
}

export interface PortfolioSettings {
  id: string;
  userId: string;
  shareableSlug: string;
  isPublic: boolean;
  visibleFields: {
    showEmail: boolean;
    showDepartment: boolean;
    showGraduationYear: boolean;
    showTimeline: boolean;
  };
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  entityType: string;
  entityId: string;
  payloadSummary: string;
  timestamp: string;
  prevHash: string;
  hash: string;
}

export interface TelemetryMetrics {
  totalSubmissions: number;
  pendingQueueDepth: number;
  approvedCount: number;
  rejectedCount: number;
  needsInfoCount: number;
  avgTurnaroundHours: number;
  aiScoringLatencyMs: number;
  aiVerifierAgreementRate: number;
  auditLedgerStatus: 'HEALTHY' | 'TAMPERED';
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  description?: string;
  requiredSkills: {
    skillId: string;
    skillName?: string;
    minLevel: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
    minimumLevel?: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
    weight: number;
  }[];
}
