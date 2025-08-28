import { DDayChip } from '@/components/DDayChip';
import { JDDetail } from '@/types/jds';
import { calculateDDay } from '@/utils/calculateDDay';

import styles from './JobDetailSection.module.css';

interface Props {
  jdDetail: JDDetail;
}

export default function JobDetailSection({ jdDetail }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 86400) {
      return '오늘 수정';
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전 수정`;
    }
  };

  return (
    <div className={styles.jobDetails}>
      <div className={styles.jobDetailsTop}>
        <div className={styles.jobDetailsLeft}>
          <DDayChip
            alarmOn={jdDetail.alarmOn}
            isApplied={!!jdDetail.applyAt}
            dDay={calculateDDay(jdDetail.endedAt)}
          />
          <div className={styles.modifiedInfo}>
            <div className={styles.modifiedText}>
              {formatTimeAgo(jdDetail.updatedAt)}
            </div>
          </div>
        </div>
        <div className={styles.jobDetailsRight}>
          <div className={styles.registerInfo}>
            <div className={styles.registerText}>등록일</div>
            <div className={styles.separator}>|</div>
            <div className={styles.registerText}>
              {formatDate(jdDetail.createdAt)}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.jobDetailsBottom}>
        <div className={styles.jobTitle}>{jdDetail.title}</div>
        <div className={styles.companyName}>{jdDetail.companyName}</div>
      </div>
    </div>
  );
}
