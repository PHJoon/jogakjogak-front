import React from 'react';

import styles from './ProgressSegment.module.css';

interface Props {
  isActive?: boolean;
  className?: string;
  isDayover?: boolean;
}

export function ProgressSegment({
  isActive = false,
  className = '',
  isDayover = false,
}: Props) {
  return (
    <div
      className={`${styles.segment} ${isActive ? styles.active : styles.default} ${isDayover ? styles.dayover : ''} ${className}`}
    />
  );
}
