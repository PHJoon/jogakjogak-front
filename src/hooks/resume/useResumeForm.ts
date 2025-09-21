import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import {
  isValidBooleanNull,
  isValidCareerList,
  isValidEducationList,
  isValidSkillList,
  useBoundStore,
} from '@/stores/useBoundStore';
import { ResumeFormInput, Career } from '@/types/resume';

interface Props {
  isOnboarding?: boolean;
}

export default function useResumeForm({ isOnboarding = false }: Props = {}) {
  const {
    isNewcomerAnswer,
    careerListAnswer,
    educationListAnswer,
    skillListAnswer,
    contentAnswer,
  } = useBoundStore(
    useShallow((state) => ({
      isNewcomerAnswer: state.isNewcomerAnswer,
      careerListAnswer: state.careerListAnswer,
      educationListAnswer: state.educationListAnswer,
      skillListAnswer: state.skillListAnswer,
      contentAnswer: state.contentAnswer,
    }))
  );

  const defaultValues: ResumeFormInput = isOnboarding
    ? {
        isNewcomer: isValidBooleanNull(isNewcomerAnswer)
          ? isNewcomerAnswer
          : null,
        careerList: isValidCareerList(careerListAnswer) ? careerListAnswer : [],
        educationList: isValidEducationList(educationListAnswer)
          ? educationListAnswer
          : [],
        skillList: isValidSkillList(skillListAnswer) ? skillListAnswer : [],
        content: typeof contentAnswer === 'string' ? contentAnswer : '',
      }
    : {
        isNewcomer: null,
        careerList: [],
        educationList: [],
        skillList: [],
        content: '',
      };

  const methods = useForm<ResumeFormInput>({
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  return { methods };
}
