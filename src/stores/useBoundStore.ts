import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  createGlobalErrorSlice,
  GlobalErrorSlice,
} from './slices/globalErrorSlice';
import {
  createOnboardingSlice,
  OnboardingSlice,
} from './slices/onboardingSlice';
import { createResumeSlice, ResumeSlice } from './slices/resumeSlice';
import { createSnackbarSlice, SnackbarSlice } from './slices/snackbarSlice';

type BoundStore = ResumeSlice &
  SnackbarSlice &
  GlobalErrorSlice &
  OnboardingSlice;

export const useBoundStore = create<BoundStore>()(
  persist(
    (...args) => ({
      ...createResumeSlice(...args),
      ...createSnackbarSlice(...args),
      ...createGlobalErrorSlice(...args),
      ...createOnboardingSlice(...args),
    }),
    {
      name: 'bound-store',
      partialize: (state) => ({
        currentStep: state.currentStep,
        currentTab: state.currentTab,
        hasResumeAnswer: state.hasResumeAnswer,
        wantsToCreateSimpleResume: state.wantsToCreateSimpleResume,
        hasExperienceAnswer: state.hasExperienceAnswer,
        experienceAnswer: state.experienceAnswer,
        educationAnswer: state.educationAnswer,
        skillsAnswer: state.skillsAnswer,
        etcAnswer: state.etcAnswer,
      }),
    }
  )
);
