import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createFeedbackSurveySlice,
  FeedbackSurveySlice,
} from './slices/feedbackSurveySlice';
import { createResumeSlice, ResumeSlice } from './slices/resumeSlice';

type BoundStore = FeedbackSurveySlice & ResumeSlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createFeedbackSurveySlice(...args),
      ...createResumeSlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({}),
    }
  )
);
