'use client';

import React from 'react';

import styles from './JogakDetail.module.css';

interface Props {
  state?: 'done' | 'active' | 'default' | 'add-custom';
  text?: string;
  className?: string;
  onClick?: () => void;
  checkboxColor?: string;
}

export function JogakDetail({
  state = 'default',
  text = '',
  className = '',
  onClick,
  checkboxColor = '#D9A9F9',
}: Props) {
  if (state === 'add-custom') {
    return (
      <div
        className={`${styles.jogakDetail} ${styles.addCustom} ${className}`}
        onClick={onClick}
      >
        <div className={styles.addIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M5 12H19"
              stroke="var(--n-500)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.addText}>사용자 지정 추가</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.jogakDetail} ${styles[state]} ${className}`}
      onClick={onClick}
    >
      <div
        className={styles.checkbox}
        style={state === 'done' ? { borderColor: checkboxColor } : {}}
      >
        {state === 'done' && (
          <div
            className={styles.checkSquare}
            style={{ backgroundColor: checkboxColor }}
          />
        )}
      </div>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
