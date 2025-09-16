import { useForm } from 'react-hook-form';

export interface ResumeFormInput {
  experiences: {
    company: string;
    responsibilities: string;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean;
  }[];
  education: {
    level: string;
    status: string;
    major: string;
  }[];
  skills: {
    id: string;
    name: string;
  }[];
  etc: string;
}

export default function useResumeForm() {
  const methods = useForm<ResumeFormInput>({
    mode: 'onChange',
    defaultValues: {
      experiences: [],
      education: [],
      skills: [],
      etc: '',
    },
  });

  return { methods };
}
