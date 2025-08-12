'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import cautionIcon from '@/assets/images/ic_caution.svg';

import { Button } from './Button';
import styles from './ResumeRegistration.module.css';

interface ResumeRegistrationProps {
  hasResume?: boolean;
  resumeId?: number;
  resumeTitle?: string;
  resumeUpdatedAt?: string;
}

export function ResumeRegistration({
  hasResume = false,
  resumeId,
  resumeTitle,
  resumeUpdatedAt,
}: ResumeRegistrationProps) {
  const router = useRouter();

  const handleResumeClick = () => {
    if (hasResume && resumeId) {
      router.push(`/resume/create?id=${resumeId}`);
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
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전 수정`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전 수정`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전 수정`;
    }
  };

  if (hasResume) {
    return (
      <div className={styles.resumeDesktop}>
        <div className={styles.resumeInfo}>
          <div className={styles.resumeTitle}>
            {resumeTitle || '나의 이력서'}
          </div>
          <div className={styles.resumeUpdated}>
            {formatTimeAgo(resumeUpdatedAt)}
          </div>
        </div>
        <div className={styles.btnInstance}>
          <Button variant="primary" onClick={handleResumeClick}>
            이력서 수정
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resumeDesktop}>
      <div className={styles.frame}>
        <Image
          src={cautionIcon}
          alt="Caution"
          width={16}
          height={20}
          className={styles.icon}
        />
        <div className={styles.div}>이력서 등록이 필요해요.</div>
      </div>
      <div className={styles.btnInstance}>
        <Button variant="primary" onClick={handleResumeClick}>
          이력서 등록
        </Button>
      </div>
    </div>
  );
}
