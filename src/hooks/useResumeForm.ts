import { useFieldArray, useForm } from 'react-hook-form';

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
    id: number;
    name: string;
  }[];
  etc: string;
}

export default function useResumeForm() {
  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ResumeFormInput>({
    mode: 'onChange',
    defaultValues: {
      experiences: [],
      education: [],
      skills: [],
      etc: '',
    },
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experiences',
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  });

  const {
    fields: skillsFields,
    append: appendSkills,
    remove: removeSkills,
  } = useFieldArray({
    control,
    name: 'skills',
  });

  return {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    getValues,
    setValue,
    trigger,
    errors,
    experienceFields,
    appendExperience,
    removeExperience,
    educationFields,
    appendEducation,
    removeEducation,
    skillsFields,
    appendSkills,
    removeSkills,
  };
}
