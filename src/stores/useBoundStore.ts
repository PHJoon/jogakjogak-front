import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createResumeSlice, ResumeSlice } from './slices/resumeSlice';

type BoundStore = ResumeSlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createResumeSlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({}),
    }
  )
);
