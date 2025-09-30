import Image from 'next/image';
import React from 'react';

import progressIcon from '@/assets/images/ic_progress.svg';

import styles from './ProgressBar.module.css';

function ProgressSegment({
  isActive = false,
  isActiveLast = false,
  className = '',
  isDayover = false,
}: {
  isActive?: boolean;
  isActiveLast?: boolean;
  className?: string;
  isDayover?: boolean;
}) {
  return (
    <div
      className={`${styles.segment} ${isActive ? styles.active : styles.default} ${isDayover ? styles.dayover : ''} ${className}`}
    >
      {isActiveLast && isActive && !isDayover && (
        <Image
          src={progressIcon}
          alt={'progress active icon'}
          width={20}
          height={20}
          className={styles.activeLast}
        />
      )}
    </div>
  );
}

interface Props {
  total: number;
  completed: number;
  className?: string;
  isDayover?: boolean;
}

export function ProgressBar({
  total,
  completed,
  className = '',
  isDayover = false,
}: Props) {
  return (
    <div className={`${styles.progressBar} ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <ProgressSegment
          key={index}
          isActive={index < completed}
          isActiveLast={index === completed - 1}
          className={styles.segmentInstance}
          isDayover={isDayover}
        />
      ))}
    </div>
  );
}
