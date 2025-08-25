import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Snackbar from '@/components/Snackbar';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import useJdMutation from '@/hooks/mutations/useJdMutation';
import trackEvent from '@/utils/trackEventGA';

import styles from './JobPostingForm.module.css';

export interface JobPostingFormInput {
  title: string;
  company: string;
  position: string;
  deadline: string;
  description: string;
  url: string;
}

interface Props {
  mode: 'create' | 'edit';
  jobId?: number;
  title?: string;
  company?: string;
  position?: string;
  deadline?: string;
  description?: string;
  url?: string;
}

export default function JobPostingForm({
  mode,
  jobId,
  title,
  company,
  position,
  deadline,
  description,
  url,
}: Props) {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobPostingFormInput>({
    defaultValues: {
      title: title || '',
      company: company || '',
      position: position || '',
      deadline: deadline || '',
      description: description || '',
      url: url || '',
    },
  });

  const fields = {
    title: register('title', {
      required: '공고 제목을 입력해주세요.',
      maxLength: { value: 30, message: '30자 이내로 입력해주세요.' },
      validate: (value) => value.trim() !== '' || '공고 제목을 입력해주세요.',
    }),
    company: register('company', {
      required: '회사명을 입력해주세요.',
      validate: (value) => value.trim() !== '' || '회사명을 입력해주세요.',
    }),
    position: register('position', {
      required: '직무명을 입력해주세요.',
      validate: (value) => value.trim() !== '' || '직무명을 입력해주세요.',
    }),
    deadline: register('deadline'),
    description: register('description', {
      required: '채용공고 내용을 입력해주세요.',
      minLength: { value: 30, message: '공고 내용은 30자 이상이어야 합니다.' },
      maxLength: {
        value: 5000,
        message: '공고 내용은 5000자 이내여야 합니다.',
      },
    }),
    url: register('url'),
  };

  const fieldOrder: (keyof JobPostingFormInput)[] = [
    'title',
    'company',
    'position',
    'deadline',
    'description',
    'url',
  ];

  // 필드 값 실시간 확인
  const formValues = watch();

  const { updateJdMutate, isUpdatePending } = useJdMutation(jobId);

  // edit인 경우에만 체크
  const isFormChanged = () => {
    return !(
      (title === formValues.title.trim() || title === formValues.title) &&
      (company === formValues.company.trim() ||
        company === formValues.company) &&
      (position === formValues.position.trim() ||
        position === formValues.position) &&
      (deadline === formValues.deadline.trim() ||
        deadline === formValues.deadline) &&
      (url === formValues.url.trim() || url === formValues.url)
    );
  };

  const onSubmit: SubmitHandler<JobPostingFormInput> = (data) => {
    if (mode === 'edit') {
      if (!isFormChanged()) {
        setSnackbar({
          isOpen: true,
          message: '변경된 내용이 없습니다.',
          type: 'info',
        });
        return;
      }

      trackEvent({
        event: GAEvent.JobPosting.EDIT,
        event_category: GACategory.JOB_POSTING,
        jobId: jobId,
      });

      updateJdMutate(
        {
          title: data.title,
          companyName: data.company,
          job: data.position,
          link: data.url,
          endDate: data.deadline,
        },
        {
          onSuccess: () => {
            alert('채용공고가 수정되었습니다.');
            router.replace(`/job/${jobId}`);
          },
          onError: () => {
            setSnackbar({
              isOpen: true,
              message: '채용공고 수정 중 오류가 발생했습니다.',
              type: 'error',
            });
          },
        }
      );
    }
  };

  // 폼 validation 오류
  const onError: SubmitErrorHandler<JobPostingFormInput> = (errors) => {
    const firstErrorFieldKey = fieldOrder.find((key) => errors[key]);
    const firstErrorField = errors[firstErrorFieldKey!];

    setSnackbar({
      isOpen: true,
      message: firstErrorField?.message || '알 수 없는 오류가 발생했습니다.',
      type: 'error',
    });

    if (firstErrorField?.ref) {
      // 렌더링 이후에 포커스 이동, 호출 타이밍이 겹쳐 작동안하는 경우 때문에 설정
      setTimeout(() => {
        const ref = firstErrorField.ref as HTMLElement;
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.focus();
      }, 50);
    }
  };

  return (
    <form
      className={styles.jobPostingForm}
      onSubmit={handleSubmit(onSubmit, onError)}
    >
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
        className={`${styles.inputWrapper} ${errors.company ? styles.error : ''}`}
      >
        <input
          {...fields.company}
          type="text"
          className={styles.input}
          placeholder="지원하는 회사 이름"
        />
      </div>

      {/* 직무 이름 */}
      <div
        className={`${styles.inputWrapper} ${errors.position ? styles.error : ''}`}
      >
        <input
          {...fields.position}
          type="text"
          className={styles.input}
          placeholder="지원하는 직무 이름"
        />
      </div>

      {/* 마감일 */}
      <div
        className={`${styles.inputWrapper} ${styles.dateWrapper} ${formValues.deadline ? styles.hasValue : ''}`}
      >
        <input {...fields.deadline} type="date" className={styles.input} />
        {!formValues.deadline && (
          <span className={styles.placeholderText}>
            마감일 설정 (상시채용 시 건너뛰기)
          </span>
        )}
      </div>

      {/* 채용공고 내용 */}
      <div
        className={`${styles.descriptionWrapper} ${errors.description ? styles.error : ''} ${mode === 'edit' ? styles.editMode : ''}`}
      >
        <textarea
          {...fields.description}
          className={styles.description}
          placeholder="채용공고의 내용을 복사/붙여넣기 해주세요."
          disabled={mode === 'edit'}
        />
      </div>

      {/* URL */}
      <div className={styles.inputWrapper}>
        <input
          {...fields.url}
          type="url"
          className={styles.input}
          placeholder="채용공고 URL 주소"
        />
      </div>

      {/* 완료하기 버튼 */}
      <button
        type="submit"
        className={styles.completeButton}
        disabled={isUpdatePending}
      >
        <span className={styles.completeButtonText}>
          {/* {isSubmitting ? 'AI가 분석 중...' : '조각 생성하기'} */}
          {mode === 'edit' &&
            (isUpdatePending ? '수정 중...' : '조각 수정하기')}
        </span>
      </button>
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </form>
  );
}
