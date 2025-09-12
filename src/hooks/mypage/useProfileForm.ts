import { useForm } from 'react-hook-form';

import { ProfileFormInput } from '@/types/profile';

export default function useProfileForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<ProfileFormInput>({
    defaultValues: {
      nickname: '',
      email: '',
    },
  });

  const fields = {
    nickname: register('nickname', {
      required: '닉네임을 입력해주세요.',
      maxLength: { value: 12, message: '닉네임은 12자 이내로 입력해주세요.' },
      minLength: { value: 4, message: '닉네임은 4자 이상이어야 합니다.' },
      validate: (value) =>
        /^[가-힣a-zA-Z0-9 ]+$/.test(value) ||
        '닉네임에는 한글, 영문, 숫자만 사용할 수 있습니다.',
    }),
    email: register('email'),
  };

  const nickname = watch('nickname');
  const email = watch('email');

  return {
    fields,
    nickname,
    email,
    errors,
    handleSubmit,
    setValue,
    reset,
    control,
  };
}
