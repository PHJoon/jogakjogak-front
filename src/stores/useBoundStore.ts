import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  ONBOARDING_STEP_LIST,
  ONBOARDING_TAB_LIST,
} from '@/constants/onboarding';
import { EDUCATION_LEVELS, EDUCATION_STATUSES } from '@/constants/resume';
import { Career, Education } from '@/types/resume';

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

export const DEFAULT_STEP = 'profile' as const;
export const DEFAULT_TAB = 'career' as const;
export const isValidStep = (
  step: unknown
): step is OnboardingSlice['currentStep'] => {
  return typeof step === 'string' && ONBOARDING_STEP_LIST.includes(step);
};

export const isValidTab = (
  tab: unknown
): tab is OnboardingSlice['currentTab'] => {
  return typeof tab === 'string' && ONBOARDING_TAB_LIST.includes(tab);
};

export const isValidBooleanNull = (value: unknown): value is boolean => {
  return typeof value === 'boolean' || value === null;
};

export const isValidCareerList = (value: unknown): value is Career[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Career).companyName === 'string' &&
      typeof (item as Career).joinedAt === 'string' &&
      typeof (item as Career).quitAt === 'string' &&
      typeof (item as Career).workPerformance === 'string' &&
      typeof (item as Career).working === 'boolean'
  );
};

export const isValidEducationList = (value: unknown): value is string[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Education).level === 'string' &&
      EDUCATION_LEVELS.values().some(
        (level) => level.value === (item as Education).level
      ) &&
      typeof (item as Education).majorField === 'string' &&
      typeof (item as Education).status === 'string' &&
      EDUCATION_STATUSES.values().some(
        (status) => status.value === (item as Education).status
      )
  );
};

export const isValidSkillList = (
  value: unknown
): value is { id: string; name: string }[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { id: string; name: string }).id === 'string' &&
      typeof (item as { id: string; name: string }).name === 'string'
  );
};

type BoundStore = ResumeSlice &
  SnackbarSlice &
  GlobalErrorSlice &
  OnboardingSlice;

type Persisted = Pick<
  BoundStore,
  | 'currentStep'
  | 'currentTab'
  | 'hasResumeAnswer'
  | 'createSimpleResumeAnswer'
  | 'isNewcomerAnswer'
  | 'careerListAnswer'
  | 'educationListAnswer'
  | 'skillListAnswer'
  | 'contentAnswer'
>;

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
      partialize: (state): Persisted => ({
        currentStep: state.currentStep,
        currentTab: state.currentTab,
        hasResumeAnswer: state.hasResumeAnswer,
        createSimpleResumeAnswer: state.createSimpleResumeAnswer,
        isNewcomerAnswer: state.isNewcomerAnswer,
        careerListAnswer: state.careerListAnswer,
        educationListAnswer: state.educationListAnswer,
        skillListAnswer: state.skillListAnswer,
        contentAnswer: state.contentAnswer,
      }),
      version: 1,
      migrate: (state, fromVersion) => {
        const persistedState = (state ?? {}) as Partial<Persisted>;
        if (fromVersion === 0) {
          if (!isValidStep(persistedState.currentStep)) {
            persistedState.currentStep = DEFAULT_STEP;
          }
          if (!isValidTab(persistedState.currentTab)) {
            persistedState.currentTab = DEFAULT_TAB;
          }
        }
        return persistedState as Persisted;
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!isValidStep(state.currentStep)) {
          state.setCurrentStep(DEFAULT_STEP);
        }
        if (!isValidTab(state.currentTab)) {
          state.setCurrentTab(DEFAULT_TAB);
        }
        if (!isValidBooleanNull(state.hasResumeAnswer)) {
          state.setHasResumeAnswer(null);
        }
        if (!isValidBooleanNull(state.createSimpleResumeAnswer)) {
          state.setCreateSimpleResumeAnswer(null);
        }
        if (!isValidBooleanNull(state.isNewcomerAnswer)) {
          state.setIsNewcomerAnswer(null);
        }
        if (!isValidCareerList(state.careerListAnswer)) {
          state.setCareerListAnswer([]);
        }
        if (!isValidEducationList(state.educationListAnswer)) {
          state.setEducationListAnswer([]);
        }
        if (!isValidSkillList(state.skillListAnswer)) {
          state.setSkillListAnswer([]);
        }
        if (typeof state.contentAnswer !== 'string') {
          state.setContentAnswer('');
        }
      },
    }
  )
);
