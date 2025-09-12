import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createGlobalErrorSlice,
  GlobalErrorSlice,
} from './slices/globalErrorSlice';
import { createResumeSlice, ResumeSlice } from './slices/resumeSlice';
import { createSnackbarSlice, SnackbarSlice } from './slices/snackbarSlice';

type BoundStore = ResumeSlice & SnackbarSlice & GlobalErrorSlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createResumeSlice(...args),
      ...createSnackbarSlice(...args),
      ...createGlobalErrorSlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({}),
    }
  )
);
