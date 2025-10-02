'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import JobPostingForm from '@/components/job/form/JobPostingForm';
import LoadingModal from '@/components/LoadingModal';
import useCreateJdMutation from '@/hooks/mutations/job/useCreateJdMutation';
import useJdQuery from '@/hooks/queries/useJdQuery';
import useClientMeta from '@/hooks/useClientMeta';
import { JobPostingFormInput } from '@/types/jds';

import styles from './page.module.css';

export default function CreateJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawJobId = searchParams.get('id');
  const jobId =
    rawJobId !== null && rawJobId.trim() !== '' && !isNaN(Number(rawJobId))
      ? Number(rawJobId)
      : null;
  const { data, isLoading, isError, error } = useJdQuery({ jobId });
  const [nextJdId, setNextJdId] = useState<number | null>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const { createJdMutate, isCreatePending, isCreateSuccess } =
    useCreateJdMutation();

  const onCreate = (data: JobPostingFormInput) => {
    createJdMutate(data, {
      onSuccess: (data) => {
        setNextJdId(data.jd_id);
      },
      onError: () => {
        setShowLoadingModal(false);
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleCompleteAnimationEnd = () => {
    if (nextJdId) {
      router.replace(`/job/${nextJdId}`);
    }
  };

  // 클라이언트 메타 설정
  useClientMeta(
    `채용공고 등록 | 조각조각`,
    'AI가 분석할 채용공고를 등록합니다.'
  );

  useEffect(() => {
    if (isCreatePending) {
      setShowLoadingModal(true);
      return;
    }

    if (isError || error) {
      setShowLoadingModal(false);
      return;
    }
  }, [isCreatePending, isError, error]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.backButton} onClick={handleBack}>
              <Image
                src={arrowBackIcon}
                alt="뒤로가기"
                width={15.57}
                height={15.16}
              />
            </button>
            <h1 className={styles.title}>채용공고 등록하기</h1>
          </div>

          <JobPostingForm
            mode={'create'}
            originData={
              jobId && data && !isLoading && !isError && !error
                ? {
                    title: data.title,
                    companyName: data.companyName,
                    job: data.job,
                    endDate: data.endedAt?.split('T')[0] || '',
                    content: data.content,
                    link: data.jdUrl,
                  }
                : undefined
            }
            onCreate={onCreate}
            isPending={isCreatePending}
          />
        </div>
      </main>
      <LoadingModal
        isOpen={showLoadingModal}
        onClose={() => setShowLoadingModal(false)}
        isComplete={isCreateSuccess}
        onCompleteAnimationEnd={handleCompleteAnimationEnd}
      />
    </>
  );
}
