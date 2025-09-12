import { StateCreator } from 'zustand';

import { HttpError } from '@/lib/HttpError';

export interface GlobalErrorSlice {
  error: HttpError | null;
  setError: (error: HttpError | null) => void;
}

export const createGlobalErrorSlice: StateCreator<
  GlobalErrorSlice,
  [],
  [],
  GlobalErrorSlice
> = (set) => ({
  error: null,
  setError: (error) => set({ error }),
});
