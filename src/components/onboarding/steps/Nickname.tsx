import type { SubmitHandler } from 'react-hook-form';

import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import { ERROR_CODES } from '@/constants/errorCode';
import useProfileMutation from '@/hooks/mutations/mypage/useProfileMutation';
import useProfileForm from '@/hooks/mypage/useProfileForm';
import useMyProfileQuery from '@/hooks/queries/useMyProfileQuery';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';
import { ProfileFormInput } from '@/types/profile';

import styles from './Nickname.module.css';

export default function Nickname() {
  const { setSnackbar, setCurrentStep } = useBoundStore(
    useShallow((state) => ({
      setSnackbar: state.setSnackbar,
      setCurrentStep: state.setCurrentStep,
    }))
  );

  const { data: profileData } = useMyProfileQuery();
  const { fields, nickname, errors, handleSubmit, reset } = useProfileForm();
  const { updateProfileMutate, isUpdateProfilePending } = useProfileMutation();

  const isNicknameDirty = () => {
    return nickname !== profileData?.nickname;
  };

  // 닉네임 세팅
  useEffect(() => {
    if (profileData) {
      reset({
        nickname: profileData.nickname,
      });
    }
  }, [profileData, reset]);

  const onNextStep = () => {
    setCurrentStep('ask_has_resume');
  };

  // 닉네임 설정 폼 제출 핸들러
  const onSubmit: SubmitHandler<Omit<ProfileFormInput, 'email'>> = (data) => {
    updateProfileMutate(
      {
        nickname: data.nickname,
      },
      {
        onError: (error) => {
          if (
            error instanceof HttpError &&
            error.errorCode === ERROR_CODES.REPLAY_REQUIRED
          ) {
            return;
          }
        },
        onSuccess: () => {
          setSnackbar({
            message: '닉네임이 업데이트되었습니다.',
            type: 'success',
          });
          onNextStep();
        },
      }
    );
  };

  const handleNextClick = () => {
    if (isNicknameDirty()) {
      handleSubmit(onSubmit)();
      return;
    }
    onNextStep();
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>닉네임을 입력해주세요.</h1>
        <p className={styles.subTitle}>이메일 알림에 활용해요.</p>
      </div>

      <div className={styles.inputSection}>
        <Input
          id={'nickname'}
          label={'닉네임'}
          field={fields.nickname}
          value={nickname}
          maxLength={12}
          warning={!!errors.nickname}
        />
        {errors.nickname && (
          <ErrorMessage message={errors.nickname?.message || ''} />
        )}
      </div>

      <div className={styles.buttonSection}>
        <Button
          type="button"
          variant={'tertiary'}
          style={{ width: '96px' }}
          disabled={true}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={handleNextClick}
          disabled={isUpdateProfilePending}
          isLoading={isUpdateProfilePending}
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
}
