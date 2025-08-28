import Image from 'next/image';

import alarmIcon from '@/assets/images/ic_alarm_on_blue.svg';
import alarmOnIcon from '@/assets/images/ic_alarm_on_white.svg';
import { ProgressBar } from '@/components/ProgressBar';

import styles from './ProgressNotificationSection.module.css';

interface Props {
  completed: number;
  total: number;
  handleAlarmButtonClick: () => void;
  isTogglingAlarm: boolean;
  isAlarmOn: boolean;
}

export default function ProgressNotificationSection({
  completed,
  total,
  handleAlarmButtonClick,
  isTogglingAlarm,
  isAlarmOn,
}: Props) {
  return (
    <div className={styles.progressNotificationSection}>
      <div className={styles.progressContent}>
        <div className={styles.progressHeader}>
          <div className={styles.progressTitle}>완료한 조각</div>
          <p className={styles.progressCount}>
            <span className={styles.progressCountActive}>{completed}</span>
            <span className={styles.progressCountTotal}> / {total}</span>
          </p>
        </div>
        <ProgressBar
          total={total}
          completed={completed}
          className={styles.progressBarInstance}
        />
      </div>
      <button
        className={`${styles.notificationBtn} ${isAlarmOn ? styles.alarmOn : ''}`}
        onClick={handleAlarmButtonClick}
        disabled={isTogglingAlarm}
      >
        {isAlarmOn ? (
          <Image src={alarmOnIcon} alt="알림 중" width={16} height={16} />
        ) : (
          <Image src={alarmIcon} alt="알림 신청" width={16} height={16} />
        )}

        <div className={styles.notificationBtnText}>
          {isAlarmOn ? '알림 중' : '알림 신청'}
        </div>
      </button>
    </div>
  );
}
