export const ONBOARDING_STEPS = {
  profile: {
    label: '개인정보 입력하기',
    stepNumber: 1,
  },
  ask_has_resume: {
    label: '이력서 확인하기',
    stepNumber: 2,
  },
  ask_create_simple_resume: {
    label: '이력서 만들기',
    stepNumber: 3,
  },
  create_resume: {
    label: '이력서 만들기',
    stepNumber: 3,
  },
} as const;

export const ONBOARDING_STEP_LIST = [
  'profile',
  'ask_has_resume',
  'ask_create_simple_resume',
  'create_resume',
];

export const ONBOARDING_TAB_LIST = ['career', 'education', 'skill', 'content'];
