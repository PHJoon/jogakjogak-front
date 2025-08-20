import { StateCreator } from 'zustand';

import { Resume } from '@/types/jds';

export interface ResumeSlice {
  resume: Resume | null;
  setResume: (resume: Resume | null) => void;
}

export const createResumeSlice: StateCreator<
  ResumeSlice,
  [],
  [],
  ResumeSlice
> = (set) => ({
  resume: null,
  setResume: (resume) => set({ resume }),
});
