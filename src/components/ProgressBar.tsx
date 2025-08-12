import React from 'react';

import styles from './ProgressBar.module.css';
import { ProgressSegment } from './ProgressSegment';

interface Props {
  total: number;
  completed: number;
  className?: string;
}

export function ProgressBar({ total, completed, className = '' }: Props) {
  return (
    <div className={`${styles.progressBar} ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <ProgressSegment
          key={index}
          isActive={index < completed}
          className={styles.segmentInstance}
        />
      ))}
    </div>
  );
}
