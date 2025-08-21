import Image from 'next/image';
import React, { useMemo } from 'react';

import alarmIcon from '../assets/images/color_chip/ic_alarm_w.svg';
import applyIcon from '../assets/images/color_chip/ic_apply.svg';

import styles from './DDayChip.module.css';

interface Props {
  alarmOn: boolean;
  isApplied?: boolean;
  dDay: number | undefined;
}

export function DDayChip({ alarmOn, isApplied = false, dDay }: Props) {
  const chipType = useMemo(() => {
    if (isApplied) return 'dDay-apply';
    if (dDay === undefined) return 'dDay-anytime';
    if (dDay === 0) return 'dDay-today';
    if (dDay < 0) return 'dDay-dayover';
    if (dDay > 0 && dDay < 8) return 'dDay-withinWeek';
    return 'dDay-default';
  }, [dDay, isApplied]);

  const text = useMemo(() => {
    if (isApplied) return '지원완료';
    if (dDay === undefined) return '상시채용';
    if (dDay === 0) return '오늘 마감';
    if (dDay < 0) return '지원마감';
    return `D-${dDay}`;
  }, [dDay, isApplied]);

  return (
    <div className={`${styles.chip} ${styles.default} ${styles[chipType]}`}>
      {isApplied && (
        <Image src={applyIcon} alt="apply" width={12} height={12} />
      )}
      <span className={styles.text}>{text}</span>
      {!isApplied && alarmOn && (
        <Image src={alarmIcon} alt="alarm-icon" width={14} height={14} />
      )}
    </div>
  );
}
