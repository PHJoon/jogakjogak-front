'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import cautionIcon from '@/assets/images/ic_caution.svg';
import { Button } from '@/components/Button';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { useBoundStore } from '@/stores/useBoundStore';
import trackEvent from '@/utils/trackEventGA';

import styles from './ResumeRegistration.module.css';

export default function ResumeRegistration() {
  const router = useRouter();
  const resume = useBoundStore((state) => state.resume);
  const hasResume = !!resume;

  const handleResumeClick = () => {
    trackEvent({
      event: hasResume
        ? GAEvent.Resume.EDIT_PAGE_VIEW
        : GAEvent.Resume.CREATE_PAGE_VIEW,
      event_category: GACategory.RESUME,
    });
    if (hasResume) {
      router.push(`/resume/create?id=${resume.resumeId}`);
    } else {
      router.push('/resume/create');
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전 수정`;
    }
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전 수정`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전 수정`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전 수정`;
  };

  return (
    <div className={styles.resumeDesktop}>
      {resume ? (
        <div className={styles.resumeInfo}>
          <div className={styles.resumeTitle}>
            {resume.title || '나의 이력서'}
          </div>
          <div className={styles.resumeUpdated}>
            {formatTimeAgo(resume.updatedAt)}
          </div>
        </div>
      ) : (
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
      )}
      <div className={styles.btnInstance}>
        <Button variant="primary" onClick={handleResumeClick}>
          {resume ? '이력서 수정' : '이력서 등록'}
        </Button>
      </div>
    </div>
  );
}
