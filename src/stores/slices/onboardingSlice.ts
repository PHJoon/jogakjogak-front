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
  setHasResumeAnswer: (answer: boolean | null) => void;
  wantsToCreateSimpleResume: boolean | null;
  setWantsToCreateSimpleResume: (answer: boolean | null) => void;
  hasExperienceAnswer: boolean | null;
  setHasExperienceAnswer: (answer: boolean | null) => void;
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
  setHasResumeAnswer: (answer) => set({ hasResumeAnswer: answer }),
  wantsToCreateSimpleResume: null,
  setWantsToCreateSimpleResume: (answer) =>
    set({ wantsToCreateSimpleResume: answer }),
  hasExperienceAnswer: null,
  setHasExperienceAnswer: (answer) => set({ hasExperienceAnswer: answer }),
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
