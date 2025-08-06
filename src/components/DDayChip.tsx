import React from 'react';
import styles from './DDayChip.module.css';
import Image from 'next/image';
import applyIcon from '../assets/images/color_chip/ic_apply.svg';

interface Props {
  alarm?: 'on' | 'off';
  state?: 'default' | 'alarm';
  className?: string;
  dDay?: number;
}

export function DDayChip({
  state = 'default',
  className = '',
  dDay = 52,
}: Props) {
  switch (className) {
    case 'dDay-apply':
      return (
        <div className={`${styles.chip} ${styles[state]} ${styles[className]}`}>
          <Image
            src={applyIcon}
            alt='apply'
            width='12'
            height='12'
          />
          <span className={styles.text}>지원완료</span>
        </div>
      );
    case 'dDay-dayover':
      return (
        <div className={`${styles.chip} ${styles[state]} ${styles[className]}`}>
          <span className={styles.text}>지원마감</span>
        </div>
      );
    case 'dDay-day0':
      return (
        <div className={`${styles.chip} ${styles[state]} ${styles[className]}`}>
          <span className={styles.text}>오늘 마감</span>
        </div>
      );
    case 'dDay-anytime':
      return (
        <div className={`${styles.chip} ${styles[state]} ${styles[className]}`}>
          <span className={styles.text}>상시채용</span>
        </div>
      );
    default:
      return (
        <div className={`${styles.chip} ${styles[state]} ${styles[className]}`}>
          <span className={styles.text}>D-{dDay}</span>
        </div>
      );
  }
}
