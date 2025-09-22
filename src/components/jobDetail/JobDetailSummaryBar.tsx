import Image from 'next/image';

import alarmIcon from '@/assets/images/ic_alarm_on_blue.svg';
import alarmOnIcon from '@/assets/images/ic_alarm_on_white.svg';
import { DDayChip } from '@/components/DDayChip';
import { ProgressBar } from '@/components/ProgressBar';
import { JDDetail } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';
import { formatDate } from '@/utils/formatDate';
import { formatLastUpdated } from '@/utils/formatLastUpdated';

import styles from './JobDetailSummaryBar.module.css';

interface Props {
  jdDetail: JDDetail;
  isTogglingAlarm: boolean;
  handleAlarmButtonClick: () => void;
}

export default function JobDetailSummaryBar({
  jdDetail,
  isTogglingAlarm,
  handleAlarmButtonClick,
}: Props) {
  return (
    <div className={styles.jobSummaryBarContainer}>
      <div className={styles.leftSection}>
        <div className={styles.dayInfo}>
          <DDayChip
            alarmOn={jdDetail.alarmOn}
            isApplied={!!jdDetail.applyAt}
            dDay={calculateDDay(jdDetail.endedAt)}
          />
          <span className={styles.dayInfoText}>
            {formatDate(jdDetail.createdAt, 'dateWithDay')} 등록
          </span>
        </div>
        <div className={styles.jobInfo}>
          <div className={styles.jobTitle}>{jdDetail.title}</div>
          <div className={styles.companyName}>{jdDetail.companyName}</div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <div className={styles.progressCounter}>
              <div className={styles.progressCounterText}>이력서 완성도</div>
              <p className={styles.progressCount}>
                <span className={styles.completedCount}>
                  {jdDetail.completedPiecesCount}
                </span>
                <span className={styles.totalCount}>
                  {' '}
                  / {jdDetail.totalPiecesCount}
                </span>
              </p>
            </div>
            <span className={styles.lastUpdatedText}>
              {formatLastUpdated(jdDetail.updatedAt)} 수정
            </span>
          </div>
          <ProgressBar
            total={jdDetail.totalPiecesCount}
            completed={jdDetail.completedPiecesCount}
          />
        </div>
        <button
          className={`${styles.notificationBtn} ${jdDetail.alarmOn ? styles.alarmOn : ''}`}
          onClick={handleAlarmButtonClick}
          disabled={isTogglingAlarm}
        >
          <Image
            src={jdDetail.alarmOn ? alarmOnIcon : alarmIcon}
            alt={jdDetail.alarmOn ? '알림 중' : '알림 신청'}
            width={16}
            height={16}
          />
          <div className={styles.notificationBtnText}>
            {jdDetail.alarmOn ? '알림 중' : '알림 신청'}
          </div>
        </button>
      </div>
    </div>
  );
}
