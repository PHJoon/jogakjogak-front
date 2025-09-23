'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import addJobIcon from '@/assets/images/add_job.svg';
import addJobActiveIcon from '@/assets/images/add_job_active.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import { useBoundStore } from '@/stores/useBoundStore';
import trackEvent from '@/utils/trackEventGA';

import styles from './JobItemAdd.module.css';

interface Props {
  jdsCount: number;
}

export default function JobItemAdd({ jdsCount }: Props) {
  const router = useRouter();
  const resume = useBoundStore((state) => state.resume);
  const hasResume = !!resume;
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const handleClick = () => {
    trackEvent({
      event: GAEvent.JobPosting.CREATE_PAGE_VIEW,
      event_category: GACategory.JOB_POSTING,
    });
    if (!hasResume && jdsCount === 1) {
      setSnackbar({
        message: '채용공고를 추가하기 전에 먼저 이력서를 등록해주세요.',
        type: 'info',
      });
    } else {
      router.push('/job/create');
    }
  };

  return (
    <>
      <div
        className={`${styles.jobAdd} ${hasResume ? styles.hasResume : ''}`}
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
    </>
  );
}
