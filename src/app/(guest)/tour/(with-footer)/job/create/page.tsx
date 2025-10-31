'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import JobPostingForm from '@/components/job/form/JobPostingForm';
import LoadingModal from '@/components/LoadingModal';
import useClientMeta from '@/hooks/useClientMeta';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './page.module.css';

export default function CreateJobPage() {
  const router = useRouter();
  const setSnackbar = useBoundStore((state) => state.setSnackbar);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [onClick, setOnClick] = useState<boolean>(false);

  const handleBack = () => {
    router.back();
  };

  // 클라이언트 메타 설정
  useClientMeta(
    `채용공고 등록 둘러보기 | 조각조각`,
    'AI가 분석할 채용공고를 등록합니다.'
  );

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
            originData={undefined}
            onCreate={() => {
              setShowLoadingModal(true);
              setOnClick(true);
              setTimeout(() => {
                setOnClick(false);
              }, 3000);
            }}
            isPending={false}
          />
        </div>
      </main>
      <LoadingModal
        isOpen={showLoadingModal}
        onClose={() => setShowLoadingModal(false)}
        isComplete={onClick}
        onCompleteAnimationEnd={() => {
          setSnackbar({
            message: '둘러보기에서는 채용공고를 등록할 수 없습니다.',
            type: 'info',
          });
        }}
      />
    </>
  );
}
