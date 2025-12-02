/**
 * API Service Layer
 * Handles all communication with the backend API
 */

import type {
  Case,
  ExamFinding,
  StudentSession,
  ExamineRequest,
  SubmitDiagnosisRequest,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0);
  }
}

// ============================================================================
// Cases API
// ============================================================================

export const casesApi = {
  /**
   * Get all available cases
   */
  async getAll(): Promise<Case[]> {
    const response = await fetchAPI<{ success: boolean; data: Case[] }>(
      '/api/cases'
    );
    return response.data;
  },

  /**
   * Get a single case by ID
   */
  async getById(id: string): Promise<Case> {
    const response = await fetchAPI<{ success: boolean; data: Case }>(
      `/api/cases/${id}`
    );
    return response.data;
  },

  /**
   * Perform an examination maneuver
   */
  async examine(
    caseId: string,
    request: ExamineRequest
  ): Promise<ExamFinding> {
    const response = await fetchAPI<{
      success: boolean;
      data: { finding: ExamFinding };
    }>(`/api/cases/${caseId}/examine`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data.finding;
  },

  /**
   * Parse natural language input (Phase 2 feature)
   */
  async parseInput(
    caseId: string,
    input: string
  ): Promise<{ parsed: any; finding?: ExamFinding }> {
    const response = await fetchAPI<{
      success: boolean;
      data: { parsed: any; finding?: ExamFinding };
    }>(`/api/cases/${caseId}/parse-input`, {
      method: 'POST',
      body: JSON.stringify({ input }),
    });
    return response.data;
  },
};

// ============================================================================
// Sessions API
// ============================================================================

export const sessionsApi = {
  /**
   * Create a new examination session
   */
  async create(caseId: string): Promise<StudentSession> {
    const response = await fetchAPI<{
      success: boolean;
      data: { session: StudentSession };
    }>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ caseId }),
    });
    return response.data.session;
  },

  /**
   * Record a performed maneuver
   */
  async recordManeuver(
    sessionId: string,
    findingId: string,
    inputMethod: 'click' | 'text',
    rawInput?: string
  ): Promise<void> {
    await fetchAPI(`/api/sessions/${sessionId}/maneuver`, {
      method: 'POST',
      body: JSON.stringify({ findingId, inputMethod, rawInput }),
    });
  },

  /**
   * Submit diagnosis and complete session
   */
  async submit(
    sessionId: string,
    request: SubmitDiagnosisRequest
  ): Promise<{
    session: StudentSession;
    score: any;
    correctDiagnosis: string;
    keyFindingsMissed: ExamFinding[];
  }> {
    const response = await fetchAPI<{
      success: boolean;
      data: {
        session: StudentSession;
        score: any;
        correctDiagnosis: string;
        keyFindingsMissed: ExamFinding[];
      };
    }>(`/api/sessions/${sessionId}/submit`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
    return response.data;
  },

  /**
   * Get session review
   */
  async getReview(sessionId: string): Promise<StudentSession> {
    const response = await fetchAPI<{
      success: boolean;
      data: { session: StudentSession };
    }>(`/api/sessions/${sessionId}/review`);
    return response.data.session;
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthApi = {
  /**
   * Check API health
   */
  async check(): Promise<{ status: string; message: string }> {
    return fetchAPI<{ status: string; message: string }>('/health');
  },
};

export { ApiError };
