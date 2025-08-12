import React from 'react';

import styles from './ProgressSegment.module.css';

interface Props {
  isActive?: boolean;
  className?: string;
}

export function ProgressSegment({ isActive = false, className = '' }: Props) {
  return (
    <div
      className={`${styles.segment} ${isActive ? styles.active : styles.default} ${className}`}
    />
  );
}
