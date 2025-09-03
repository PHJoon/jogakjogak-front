import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createResumeSlice, ResumeSlice } from './slices/resumeSlice';
import { createSnackbarSlice, SnackbarSlice } from './slices/snackbarSlice';

type BoundStore = ResumeSlice & SnackbarSlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createResumeSlice(...args),
      ...createSnackbarSlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({}),
    }
  )
);
