'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import addJobIcon from '@/assets/images/add_job.svg';
import addJobActiveIcon from '@/assets/images/add_job_active.svg';

import styles from './JobAdd.module.css';

interface JobAddProps {
  className?: string;
  hasResume?: boolean;
  onNoResumeClick?: () => void;
}

export function JobAdd({
  className = '',
  hasResume = false,
  onNoResumeClick,
}: JobAddProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!hasResume && onNoResumeClick) {
      onNoResumeClick();
    } else {
      router.push('/job/create');
    }
  };

  return (
    <div
      className={`${styles.jobAdd} ${hasResume ? styles.hasResume : ''} ${className}`}
      onClick={handleClick}
    >
      {/* Desktop version */}
      <div className={styles.desktopContent}>
        <Image
          src={hasResume ? addJobActiveIcon : addJobIcon}
          alt="Add Job"
          width={33.33}
          height={36.67}
          className={styles.desktopIcon}
        />
        <div className={styles.textWrapper}>채용공고 추가하기</div>
      </div>

      {/* Mobile version */}
      <div className={styles.mobileContent}>
        <Image
          src={hasResume ? addJobActiveIcon : addJobIcon}
          alt="Add Job"
          width={26.67}
          height={29.33}
          className={styles.mobileIcon}
        />
        <div className={styles.textWrapper}>채용공고 추가하기</div>
      </div>
    </div>
  );
}
