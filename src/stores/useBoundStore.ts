import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createFeedbackSurveySlice,
  FeedbackSurveySlice,
} from './slices/feedbackSurveySlice';

type BoundStore = FeedbackSurveySlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createFeedbackSurveySlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({}),
    }
  )
);
