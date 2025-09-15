import { StateCreator } from 'zustand';

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
  wantsToCreateSimpleResume: boolean | null;
  setWantsToCreateSimpleResume: Setter<
    OnboardingSlice['wantsToCreateSimpleResume']
  >;
  hasExperienceAnswer: boolean | null;
  setHasExperienceAnswer: Setter<OnboardingSlice['hasExperienceAnswer']>;
  experienceAnswer: {
    company: string;
    responsibilities: string;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean;
  }[];
  setExperienceAnswer: Setter<OnboardingSlice['experienceAnswer']>;
  educationAnswer: {
    level: string;
    status: string;
    major: string;
  }[];
  setEducationAnswer: Setter<OnboardingSlice['educationAnswer']>;
  skillsAnswer: string[];
  setSkillsAnswer: Setter<OnboardingSlice['skillsAnswer']>;
  etcAnswer: string;
  setEtcAnswer: Setter<OnboardingSlice['etcAnswer']>;
}

export const createOnboardingSlice: StateCreator<
  OnboardingSlice,
  [],
  [],
  OnboardingSlice
> = (set) => ({
  currentStep: 'profile',
  setCurrentStep: (step) => set({ currentStep: step }),
  currentTab: 'experience',
  setCurrentTab: (tab) => set({ currentTab: tab }),
  hasResumeAnswer: null,
  setHasResumeAnswer: (updater) =>
    set((state) => ({
      hasResumeAnswer:
        typeof updater === 'function'
          ? updater(state.hasResumeAnswer)
          : updater,
    })),
  wantsToCreateSimpleResume: null,
  setWantsToCreateSimpleResume: (updater) =>
    set((state) => ({
      wantsToCreateSimpleResume:
        typeof updater === 'function'
          ? updater(state.wantsToCreateSimpleResume)
          : updater,
    })),
  hasExperienceAnswer: null,
  setHasExperienceAnswer: (updater) =>
    set((state) => ({
      hasExperienceAnswer:
        typeof updater === 'function'
          ? updater(state.hasExperienceAnswer)
          : updater,
    })),
  experienceAnswer: [],
  setExperienceAnswer: (updater) =>
    set((state) => ({
      experienceAnswer:
        typeof updater === 'function'
          ? updater(state.experienceAnswer)
          : updater,
    })),
  educationAnswer: [],
  setEducationAnswer: (updater) =>
    set((state) => ({
      educationAnswer:
        typeof updater === 'function'
          ? updater(state.educationAnswer)
          : updater,
    })),
  skillsAnswer: [],
  setSkillsAnswer: (updater) =>
    set((state) => ({
      skillsAnswer:
        typeof updater === 'function' ? updater(state.skillsAnswer) : updater,
    })),
  etcAnswer: '',
  setEtcAnswer: (updater) =>
    set((state) => ({
      etcAnswer:
        typeof updater === 'function' ? updater(state.etcAnswer) : updater,
    })),
});
