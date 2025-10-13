import { useForm } from 'react-hook-form';

import { JobPostingFormInput } from '@/types/jds';

export default function useJobPostingForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<JobPostingFormInput>({
    defaultValues: {
      title: '',
      companyName: '',
      job: '',
      endDate: '',
      content: '',
      link: '',
    },
  });

  const fields = {
    title: register('title', {
      required: '공고 제목을 입력해주세요.',
      maxLength: { value: 30, message: '30자 이내로 입력해주세요.' },
      validate: (value) => value.trim() !== '' || '공고 제목을 입력해주세요.',
    }),
    companyName: register('companyName', {
      required: '회사명을 입력해주세요.',
      validate: (value) => value.trim() !== '' || '회사명을 입력해주세요.',
    }),
    job: register('job', {
      required: '직무명을 입력해주세요.',
      validate: (value) => value.trim() !== '' || '직무명을 입력해주세요.',
    }),
    endDate: register('endDate'),
    content: register('content', {
      required: '채용공고 내용을 입력해주세요.',
      minLength: {
        value: 200,
        message: '공고 내용은 200자 이상이어야 합니다.',
      },
      maxLength: {
        value: 5000,
        message: '공고 내용은 5000자 이내여야 합니다.',
      },
    }),
    link: register('link'),
  };

  const fieldOrder: (keyof JobPostingFormInput)[] = [
    'title',
    'companyName',
    'job',
    'endDate',
    'content',
    'link',
  ];

  // 필드 값 실시간 확인
  const formValues = watch();

  return {
    fields,
    fieldOrder,
    formValues,
    errors,
    handleSubmit,
    setValue,
  };
}
