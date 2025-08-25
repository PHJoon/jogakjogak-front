'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FormContentLoading from '@/components/job/form/FormContentLoading';
import JobPostingForm from '@/components/job/form/JobPostingForm';
import useJdQuery from '@/hooks/queries/useJdQuery';
import useClientMeta from '@/hooks/useClientMeta';

import styles from './page.module.css';

function JobEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawJobId = searchParams.get('id');
  const jobId =
    rawJobId !== null && rawJobId.trim() !== '' && !isNaN(Number(rawJobId))
      ? Number(rawJobId)
      : null;

  const { data, isLoading, isError, error } = useJdQuery(jobId);

  const handleBack = () => {
    router.back();
  };

  // 클라이언트 메타 설정
  useClientMeta(
    `채용공고 등록 | 조각조각`,
    'AI가 분석할 채용공고를 등록합니다.'
  );

  // jobId가 숫자가 아니거나 비어있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (!jobId) {
      router.replace('/dashboard');
    }
  }, [jobId, router]);

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
            <h1 className={styles.title}>채용공고 수정하기</h1>
          </div>

          {isLoading && <FormContentLoading />}

          {!isLoading && !isError && data && (
            <JobPostingForm
              mode={'edit'}
              jobId={jobId as number}
              title={data.title}
              company={data.companyName}
              position={data.job}
              deadline={
                data.endedAt?.split('T')[0] ? data.endedAt.split('T')[0] : ''
              }
              description={data.content}
              url={data.jdUrl}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function JobEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobEditPageContent />
    </Suspense>
  );
}
