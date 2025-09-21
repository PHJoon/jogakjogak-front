import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { type SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import Button from '@/components/common/Button';
import Textarea from '@/components/common/Textarea';
import useCreateResumeMutation from '@/hooks/mutations/resume/useCreateResumeMutation';
import useDebouncedCallback from '@/hooks/useDebouncedCallback';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeFormInput } from '@/types/resume';

import styles from './ContentTab.module.css';

export default function ContentTab() {
  const router = useRouter();
  const ranRef = useRef(false);

  const { setCurrentTab, setContentAnswer, resetOnboardingStore, setSnackbar } =
    useBoundStore(
      useShallow((state) => ({
        setCurrentTab: state.setCurrentTab,
        setContentAnswer: state.setContentAnswer,
        resetOnboardingStore: state.reset,
        setSnackbar: state.setSnackbar,
      }))
    );

  const { control, handleSubmit, register } = useFormContext<ResumeFormInput>();
  const contentWatch = useWatch({ name: 'content', control });

  const { createResumeMutate, isResumeCreating } = useCreateResumeMutation();

  const handleClickPrevious = () => {
    setCurrentTab('skill');
  };

  const handleClickNext = async () => {
    localStorage.removeItem('bound-store');
    await handleSubmit(onSubmit)();
  };

  // 폼 제출
  const onSubmit: SubmitHandler<ResumeFormInput> = (data) => {
    console.log(data);
    useBoundStore.persist.clearStorage();
    resetOnboardingStore();
    router.replace('/dashboard');
    // if (data.isNewcomer === null) return;

    // const formData: ResumeRequestBody = {
    //   isNewcomer: data.isNewcomer,
    //   careerList: data.careerList,
    //   educationList: data.educationList,
    //   content: data.content,
    //   skillList: data.skillList.map((skill) => skill.name),
    // };

    // createResumeMutate(formData, {
    //   onSuccess: () => {
    //     setSnackbar({ message: '이력서가 등록되었어요.', type: 'success' });
    //     router.replace('/dashboard');
    //   },
    //   onError: (error) => {
    //     if (error instanceof HttpError) {
    //       if (error.errorCode === ERROR_CODES.REPLAY_REQUIRED) {
    //         return;
    //       }
    //     }
    //   },
    // });
  };

  const { debounced, cancel } = useDebouncedCallback((value: string) => {
    setContentAnswer(value);
  }, 300);

  useEffect(() => {
    // 첫 랜더링일 때는 실행하지 않음 (기존 답변이 있을 때 덮어쓰는 것을 방지)
    if (!ranRef.current) {
      ranRef.current = true;
      return;
    }
    debounced(contentWatch);
    return cancel;
  }, [contentWatch, debounced, cancel]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>자유로운 내용을 입력해주세요.</h1>
        <p className={styles.subTitle}>
          어필할 수 있는 내용이면 아무거나 좋아요.
        </p>
      </div>

      <div className={styles.inputSection}>
        <Textarea
          id={'content'}
          label={'갖고 있는 이력서가 있다면 복사 붙여넣기를 추천해요.'}
          field={register('content')}
          value={contentWatch}
          maxLength={5000}
          style={{ width: '100%', height: '540px' }}
        />
      </div>
      <div className={styles.stepNavigationButtonGroup}>
        <div className={styles.previousButtonWrapper}>
          <Button
            type="button"
            variant={'tertiary'}
            style={{ width: '100%', height: '100%' }}
            onClick={handleClickPrevious}
          >
            이전
          </Button>
        </div>
        <div className={styles.nextButtonWrapper}>
          <Button
            type="button"
            variant={'primary'}
            style={{ width: '100%', height: '100%' }}
            onClick={handleClickNext}
            disabled={isResumeCreating}
            isLoading={isResumeCreating}
          >
            이력서 완성하기
          </Button>
        </div>
      </div>
    </div>
  );
}
