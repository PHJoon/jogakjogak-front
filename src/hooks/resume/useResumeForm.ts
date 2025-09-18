import { useForm } from 'react-hook-form';

import { ResumeFormInput } from '@/types/resume';

export default function useResumeForm() {
  const methods = useForm<ResumeFormInput>({
    mode: 'onChange',
    defaultValues: {
      isNewcomer: null,
      careerList: [],
      educationList: [],
      skillList: [],
      content: '',
    },
  });

  return { methods };
}
