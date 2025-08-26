'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import JobPostingForm from '@/components/job/form/JobPostingForm';
import LoadingModal from '@/components/LoadingModal';
import Snackbar from '@/components/Snackbar';
import { useCreateJdMutation } from '@/hooks/mutations/useJdMutation';
import useClientMeta from '@/hooks/useClientMeta';
import { JobPostingFormInput } from '@/types/jds';

import styles from './page.module.css';

export default function CreateJobPage() {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });
  const [nextJdId, setNextJdId] = useState<number | null>(null);

  const { createJdMutate, isCreatePending, isCreateSuccess } =
    useCreateJdMutation();

  const onCreate = (data: JobPostingFormInput) => {
    createJdMutate(data, {
      onSuccess: (data) => {
        setNextJdId(data.jd_id);
      },
      onError: (error) => {
        setSnackbar({
          isOpen: true,
          message: error.message || '채용공고 등록 중 오류가 발생했습니다.',
          type: 'error',
        });
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

  return (
    <>
      <Header backgroundColor="white" showLogout={true} />
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
            onCreate={onCreate}
            isPending={isCreatePending}
          />
        </div>
      </main>
      <Footer />
      <LoadingModal
        isOpen={isCreatePending}
        isComplete={isCreateSuccess}
        onCompleteAnimationEnd={handleCompleteAnimationEnd}
      />
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
      />
    </>
  );
}
