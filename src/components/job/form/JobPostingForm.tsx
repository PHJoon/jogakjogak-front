import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJobPostingForm from '@/hooks/job/useJobPostingForm';
import { useBoundStore } from '@/stores/useBoundStore';
import { JobPostingFormInput } from '@/types/jds';
import trackEvent from '@/utils/trackEventGA';

import styles from './JobPostingForm.module.css';

interface Props {
  mode: 'create' | 'edit';
  jobId?: number;
  originData?: JobPostingFormInput;
  onCreate?: (data: JobPostingFormInput) => void;
  onUpdate?: (data: JobPostingFormInput) => void;
  isPending: boolean;
}

export default function JobPostingForm({
  mode,
  jobId,
  originData,
  onCreate,
  onUpdate,
  isPending,
}: Props) {
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const { fields, fieldOrder, errors, formValues, handleSubmit, setValue } =
    useJobPostingForm();

  // edit인 경우에만 체크
  const isFormChanged = () => {
    return !(
      (originData?.title === formValues.title.trim() ||
        originData?.title === formValues.title) &&
      (originData?.companyName === formValues.companyName.trim() ||
        originData?.companyName === formValues.companyName) &&
      (originData?.job === formValues.job.trim() ||
        originData?.job === formValues.job) &&
      (originData?.endDate === formValues.endDate.trim() ||
        originData?.endDate === formValues.endDate) &&
      (originData?.link === formValues.link.trim() ||
        originData?.link === formValues.link)
    );
  };

  // 폼 제출
  const onSubmit: SubmitHandler<JobPostingFormInput> = (data) => {
    // GA 이벤트 전송
    trackEvent({
      event:
        mode === 'create' ? GAEvent.JobPosting.CREATE : GAEvent.JobPosting.EDIT,
      event_category: GACategory.JOB_POSTING,
      jobId: mode === 'edit' ? jobId : undefined,
    });

    if (mode === 'create') {
      onCreate?.(data);
    }

    if (mode === 'edit') {
      if (!isFormChanged()) {
        setSnackbar({
          message: '변경된 내용이 없습니다.',
          type: 'info',
        });
        return;
      }
      onUpdate?.(data);
    }
  };

  // 폼 validation 오류
  const onError: SubmitErrorHandler<JobPostingFormInput> = (errors) => {
    const firstErrorFieldKey = fieldOrder.find((key) => errors[key]);
    const firstErrorField = errors[firstErrorFieldKey!];

    setSnackbar({
      message: firstErrorField?.message || '알 수 없는 오류가 발생했습니다.',
      type: 'error',
    });

    if (firstErrorField?.ref) {
      // 렌더링 이후에 포커스 이동, 호출 타이밍이 겹쳐 작동안하는 경우 때문에 설정
      setTimeout(() => {
        const ref = firstErrorField.ref as HTMLElement;
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.focus();
      }, 0);
    }
  };

  // 기존 값으로 세팅
  useEffect(() => {
    if (originData) {
      setValue('title', originData.title || '');
      setValue('companyName', originData.companyName || '');
      setValue('job', originData.job || '');
      setValue('endDate', originData.endDate || '');
      setValue('content', originData.content || '');
      setValue('link', originData.link || '');
    }
  }, [originData, setValue]);

  return (
    <>
      <form
        className={styles.jobPostingForm}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <fieldset className={styles.fieldset} disabled={isPending}>
          {/* 채용공고 제목 */}
          <div
            className={`${styles.inputWrapper} ${styles.titleWrapper} ${errors.title ? styles.error : ''}`}
          >
            <input
              {...fields.title}
              type="text"
              className={styles.titleInput}
              placeholder="채용공고 제목을 입력해주세요."
              maxLength={30}
            />
            <div className={styles.counter}>{formValues.title.length}/30</div>
          </div>

          {/* 회사 이름 */}
          <div
            className={`${styles.inputWrapper} ${errors.companyName ? styles.error : ''}`}
          >
            <input
              {...fields.companyName}
              type="text"
              className={styles.input}
              placeholder="지원하는 회사 이름"
            />
          </div>

          {/* 직무 이름 */}
          <div
            className={`${styles.inputWrapper} ${errors.job ? styles.error : ''}`}
          >
            <input
              {...fields.job}
              type="text"
              className={styles.input}
              placeholder="지원하는 직무 이름"
            />
          </div>

          {/* 마감일 */}
          <div
            className={`${styles.inputWrapper} ${styles.dateWrapper} ${formValues.endDate ? styles.hasValue : ''}`}
          >
            <input {...fields.endDate} type="date" className={styles.input} />
            {!formValues.endDate && (
              <span className={styles.placeholderText}>
                마감일 설정 (상시채용 시 건너뛰기)
              </span>
            )}
          </div>

          {/* 채용공고 내용 */}
          <div
            className={`${styles.descriptionWrapper} ${errors.content ? styles.error : ''} ${mode === 'edit' ? styles.editMode : ''}`}
          >
            <textarea
              {...fields.content}
              className={styles.description}
              placeholder="채용공고의 내용을 복사/붙여넣기 해주세요."
              disabled={mode === 'edit'}
            />
          </div>

          {/* URL */}
          <div className={styles.inputWrapper}>
            <input
              {...fields.link}
              type="url"
              className={styles.input}
              placeholder="채용공고 URL 주소"
            />
          </div>

          {/* 완료하기 버튼 */}
          <button
            type="submit"
            className={styles.completeButton}
            disabled={isPending}
          >
            <span className={styles.completeButtonText}>
              {mode === 'edit' && (isPending ? '수정 중...' : '조각 수정하기')}
              {mode === 'create' &&
                (isPending ? 'AI가 분석 중...' : '조각 생성하기')}
            </span>
          </button>
        </fieldset>
      </form>
    </>
  );
}
