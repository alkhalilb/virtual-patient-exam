/**
 * Shared TypeScript types for Virtual Patient Physical Examination Simulator
 * These types are based on the specification and will be shared between frontend and backend
 */

export type BodyRegion =
  | 'head'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'back'
  | 'upper_extremity_left'
  | 'upper_extremity_right'
  | 'lower_extremity_left'
  | 'lower_extremity_right';

export type ManeuverType =
  | 'inspect'
  | 'auscultate'
  | 'percuss'
  | 'palpate'
  | 'special_test'
  | 'measure';

export type FindingType = 'audio' | 'image' | 'video' | 'text';

export interface Demographics {
  age: number;
  sex: string;
  chiefComplaint: string;
}

export interface History {
  hpi: string;
  pmh: string[];
  medications: string[];
  allergies: string[];
  socialHistory: string;
  familyHistory: string;
}

export interface VitalSigns {
  bp: string;
  hr: number;
  rr: number;
  temp: number;
  spo2: number;
}

export interface ExamFinding {
  id: string;
  region: BodyRegion;
  maneuver: ManeuverType;
  target?: string; // e.g., "mitral_area", "right_lower_lobe"
  location?: string; // specific location within region
  findingType: FindingType;
  mediaUrl?: string;
  description: string;
  isAbnormal: boolean;
}

export interface Case {
  id: string;
  title: string;
  // Flat structure matching Prisma model
  age: number;
  sex: string;
  chiefComplaint: string;
  hpi: string;
  pmh: string[];
  medications: string[];
  allergies: string[];
  socialHistory: string;
  familyHistory: string;
  bp: string;
  hr: number;
  rr: number;
  temp: number;
  spo2: number;
  findings?: ExamFinding[];
  diagnosis: string;
  keyFindings: string[];
}

export interface PerformedManeuver {
  findingId: string;
  timestamp: Date;
  inputMethod: 'click' | 'text';
  rawInput?: string; // if text input, store original
}

export interface SessionScore {
  completeness: number; // 0-100
  efficiency: number; // 0-100
  diagnosisAccuracy: number; // 0-100
  overallScore: number; // 0-100
  feedback: string[];
}

export interface StudentSession {
  id: string;
  caseId: string;
  startTime: Date;
  endTime?: Date;
  maneuversPerformed: PerformedManeuver[];
  submittedDiagnosis?: string;
  score?: SessionScore;
}

export interface ParsedManeuver {
  region: BodyRegion;
  maneuver: ManeuverType;
  target?: string;
  location?: string;
  confidence: number;
  clarificationNeeded?: string;
}

// API Request/Response types
export interface ExamineRequest {
  region: BodyRegion;
  maneuver: ManeuverType;
  target?: string;
  location?: string;
}

export interface ExamineResponse {
  finding: ExamFinding;
  sessionId: string;
}

export interface ParseInputRequest {
  input: string;
  caseId: string;
}

export interface ParseInputResponse {
  parsed: ParsedManeuver;
  finding?: ExamFinding;
}

export interface SubmitDiagnosisRequest {
  diagnosis: string;
}

export interface SubmitDiagnosisResponse {
  score: SessionScore;
  correctDiagnosis: string;
  keyFindingsMissed: ExamFinding[];
  session: StudentSession;
}
