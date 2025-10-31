'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import cautionIcon from '@/assets/images/ic_caution.svg';
import { Button } from '@/components/Button';
import SortDropdown from '@/components/dashboard/SortDropdown';
import TourJobItem from '@/components/tour/TourJobItem';
import useClientMeta from '@/hooks/useClientMeta';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './page.module.css';

function DashboardContent() {
  const router = useRouter();

  // 클라이언트 메타 설정
  useClientMeta(
    '채용공고 대시보드 둘러보기 | 조각조각',
    'AI가 분석할 채용공고를 추가하고 관리합니다.'
  );

  const { setSort, setShowOnly, page, sort, showOnly } = useQueryParams();

  const dummyJds = useBoundStore((state) => state.dummyJds);
  const [jds, setJds] = useState(dummyJds);

  useEffect(() => {
    if (sort || showOnly) {
      let filteredJds = [...dummyJds];
      if (sort === 'createdAt,desc') {
        filteredJds.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sort === 'createdAt,asc') {
        filteredJds.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sort === 'endedAt,asc') {
        filteredJds.sort((a, b) => {
          if (!a.endedAt) return 1; // a가 없으면 뒤로
          if (!b.endedAt) return -1; // b가 없으면 뒤로
          return new Date(a.endedAt).getTime() - new Date(b.endedAt).getTime();
        });
      }

      if (showOnly === 'bookmark') {
        filteredJds = filteredJds.filter((jd) => jd.bookmark === true);
      }
      if (showOnly === 'completed') {
        filteredJds = filteredJds.filter((jd) => jd.applyAt !== null);
      }
      if (showOnly === 'alarm') {
        filteredJds = filteredJds.filter((jd) => jd.alarmOn === true);
      }
      setJds(filteredJds);
    } else {
      setJds(
        [...dummyJds].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }, [dummyJds, sort, showOnly]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.resumeDesktop}>
            <div className={styles.resumeNotice}>
              <Image
                src={cautionIcon}
                alt="Caution"
                width={16}
                height={20}
                className={styles.icon}
              />
              <div className={styles.noticeText}>이력서 등록이 필요해요.</div>
            </div>

            <div className={styles.btnInstance}>
              <Button
                variant="primary"
                onClick={() => {
                  router.push('/tour/resume/create');
                }}
              >
                {'이력서 등록'}
              </Button>
            </div>
          </div>

          {/* 정렬 드롭다운 */}
          <div className={styles.sortContainer}>
            <SortDropdown setSort={setSort} setShowOnly={setShowOnly} />
          </div>

          {/* job list */}
          <div className={styles.jobSection}>
            {jds.map((jd) => (
              <TourJobItem key={jd.jd_id} jd={jd} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default function DashBoardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
