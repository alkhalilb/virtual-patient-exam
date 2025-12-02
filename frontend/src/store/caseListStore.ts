import { create } from 'zustand';
import type { Case } from '../types';
import { casesApi } from '../services/api';

interface CaseListState {
  cases: Case[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCases: () => Promise<void>;
}

export const useCaseListStore = create<CaseListState>((set) => ({
  cases: [],
  isLoading: false,
  error: null,

  fetchCases: async () => {
    set({ isLoading: true, error: null });
    try {
      const cases = await casesApi.getAll();
      set({ cases, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
