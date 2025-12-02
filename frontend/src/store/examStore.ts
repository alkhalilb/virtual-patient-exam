import { create } from 'zustand';
import type { Case, ExamFinding, StudentSession, PerformedManeuver } from '../types';
import { casesApi, sessionsApi } from '../services/api';

interface ExamState {
  // Current case data
  currentCase: Case | null;
  currentSession: StudentSession | null;

  // Examination state
  performedFindings: ExamFinding[];
  currentFinding: ExamFinding | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCase: (caseId: string) => Promise<void>;
  startSession: (caseId: string) => Promise<void>;
  performExamination: (
    region: string,
    maneuver: string,
    target?: string,
    location?: string
  ) => Promise<void>;
  submitDiagnosis: (diagnosis: string) => Promise<any>;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  // Initial state
  currentCase: null,
  currentSession: null,
  performedFindings: [],
  currentFinding: null,
  isLoading: false,
  error: null,

  // Load case data
  loadCase: async (caseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const caseData = await casesApi.getById(caseId);
      set({ currentCase: caseData, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Start a new examination session
  startSession: async (caseId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Load case if not already loaded
      if (!get().currentCase || get().currentCase?.id !== caseId) {
        await get().loadCase(caseId);
      }

      // Create new session
      const session = await sessionsApi.create(caseId);
      set({
        currentSession: session,
        performedFindings: [],
        currentFinding: null,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Perform an examination maneuver
  performExamination: async (
    region: string,
    maneuver: string,
    target?: string,
    location?: string
  ) => {
    const { currentCase, currentSession } = get();

    if (!currentCase || !currentSession) {
      set({ error: 'No active session' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Get finding from API
      const finding = await casesApi.examine(currentCase.id, {
        region: region as any,
        maneuver: maneuver as any,
        target,
        location,
      });

      // Record maneuver in session (only if not a "normal" finding)
      if (finding.id !== 'normal') {
        await sessionsApi.recordManeuver(
          currentSession.id,
          finding.id,
          'click'
        );
      }

      // Update state
      set((state) => ({
        currentFinding: finding,
        performedFindings: finding.id !== 'normal'
          ? [...state.performedFindings, finding]
          : state.performedFindings,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Submit diagnosis and complete session
  submitDiagnosis: async (diagnosis: string) => {
    const { currentSession } = get();

    if (!currentSession) {
      set({ error: 'No active session' });
      throw new Error('No active session');
    }

    set({ isLoading: true, error: null });

    try {
      const result = await sessionsApi.submit(currentSession.id, {
        diagnosis,
      });

      set({ isLoading: false });
      return result;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reset examination state
  resetExam: () => {
    set({
      currentCase: null,
      currentSession: null,
      performedFindings: [],
      currentFinding: null,
      error: null,
    });
  },
}));
