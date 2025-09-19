import { StateCreator } from 'zustand';

import { Career, Education } from '@/types/resume';

import { ResumeTabs } from './../../constants/onboardingStep';

type Setter<T> = (value: T | ((prev: T) => T)) => void;

export interface OnboardingSlice {
  currentStep:
    | 'profile'
    | 'ask_has_resume'
    | 'ask_create_simple_resume'
    | 'create_resume';
  setCurrentStep: (step: OnboardingSlice['currentStep']) => void;
  currentTab: (typeof ResumeTabs)[number];
  setCurrentTab: (tab: OnboardingSlice['currentTab']) => void;
  hasResumeAnswer: boolean | null;
  setHasResumeAnswer: Setter<OnboardingSlice['hasResumeAnswer']>;
  createSimpleResumeAnswer: boolean | null;
  setCreateSimpleResumeAnswer: Setter<
    OnboardingSlice['createSimpleResumeAnswer']
  >;
  isNewcomerAnswer: boolean | null;
  setIsNewcomerAnswer: Setter<OnboardingSlice['isNewcomerAnswer']>;
  careerListAnswer: Career[];
  setCareerListAnswer: Setter<OnboardingSlice['careerListAnswer']>;
  educationListAnswer: Education[];
  setEducationListAnswer: Setter<OnboardingSlice['educationListAnswer']>;
  skillListAnswer: {
    id: string;
    name: string;
  }[];
  setSkillListAnswer: Setter<OnboardingSlice['skillListAnswer']>;
  contentAnswer: string;
  setContentAnswer: Setter<OnboardingSlice['contentAnswer']>;
}

export const createOnboardingSlice: StateCreator<
  OnboardingSlice,
  [],
  [],
  OnboardingSlice
> = (set) => ({
  currentStep: 'profile',
  setCurrentStep: (step) => set({ currentStep: step }),
  currentTab: 'career',
  setCurrentTab: (tab) => set({ currentTab: tab }),
  hasResumeAnswer: null,
  setHasResumeAnswer: (updater) =>
    set((state) => ({
      hasResumeAnswer:
        typeof updater === 'function'
          ? updater(state.hasResumeAnswer)
          : updater,
    })),
  createSimpleResumeAnswer: null,
  setCreateSimpleResumeAnswer: (updater) =>
    set((state) => ({
      createSimpleResumeAnswer:
        typeof updater === 'function'
          ? updater(state.createSimpleResumeAnswer)
          : updater,
    })),
  isNewcomerAnswer: null,
  setIsNewcomerAnswer: (updater) =>
    set((state) => ({
      isNewcomerAnswer:
        typeof updater === 'function'
          ? updater(state.isNewcomerAnswer)
          : updater,
    })),
  careerListAnswer: [],
  setCareerListAnswer: (updater) =>
    set((state) => ({
      careerListAnswer:
        typeof updater === 'function'
          ? updater(state.careerListAnswer)
          : updater,
    })),
  educationListAnswer: [],
  setEducationListAnswer: (updater) =>
    set((state) => ({
      educationListAnswer:
        typeof updater === 'function'
          ? updater(state.educationListAnswer)
          : updater,
    })),
  skillListAnswer: [],
  setSkillListAnswer: (updater) =>
    set((state) => ({
      skillListAnswer:
        typeof updater === 'function'
          ? updater(state.skillListAnswer)
          : updater,
    })),
  contentAnswer: '',
  setContentAnswer: (updater) =>
    set((state) => ({
      contentAnswer:
        typeof updater === 'function' ? updater(state.contentAnswer) : updater,
    })),
});
