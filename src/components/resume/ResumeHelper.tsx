import Image from 'next/image';
import { useState } from 'react';

import chatInfoIcon from '@/assets/images/ic_chat_info.svg';
import arrowDropDownIcon from '@/assets/images/ic_drop_down.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import trackEvent from '@/utils/trackEventGA';

import styles from './ResumeHelper.module.css';

export default function ResumeHelper() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleHelperClick = () => {
    if (!isHelpOpen) {
      trackEvent({
        event: GAEvent.Resume.HELPER,
        event_category: GACategory.RESUME,
      });
    }
    setIsHelpOpen(!isHelpOpen);
  };

  return (
    <>
      <div className={styles.helpHeader} onClick={handleHelperClick}>
        <div className={styles.helpContent}>
          <Image
            src={chatInfoIcon}
            alt="도움말"
            width={16.67}
            height={15.51}
            className={styles.helpIcon}
          />
          <span className={styles.helpText}>
            {isHelpOpen
              ? '이력서에 이런 내용을 포함하면 좋아요.'
              : '이력서에 어떤걸 넣을지 모르겠나요?'}
          </span>
        </div>
        <Image
          src={arrowDropDownIcon}
          alt="펼치기"
          width={8.6}
          height={4.7}
          className={`${styles.dropdownIcon} ${
            isHelpOpen ? styles.rotated : ''
          }`}
        />
      </div>

      {isHelpOpen && (
        <div className={styles.helpExpanded}>
          <div className={styles.helpGuide}>
            <p>간단한 자기소개 문구</p>

            <p>🎓 학력</p>
            <p className={styles.helpSubtext}>
              - 상태(재학 중 / 졸업 예정 / 졸업)
            </p>
            <p className={styles.helpSubtext}>- 입학 년월 ~ 졸업 년월</p>
            <p className={styles.helpSubtext}>- 학교명</p>
            <p className={styles.helpSubtext}>- 전공</p>

            <p>🏅 어학 및 자격증</p>
            <p className={styles.helpSubtext}>- 자격 명과 취득일</p>

            <p>🧳 경력사항</p>
            <p className={styles.helpSubtext}>- 상태(재직 중 / 퇴사)</p>
            <p className={styles.helpSubtext}>- 입사 년월 ~ 퇴사 년월</p>
            <p className={styles.helpSubtext}>- 회사명</p>
            <p className={styles.helpSubtext}>- 부서명</p>
            <p className={styles.helpSubtext}>- 업무 역할</p>

            <p>🏆 수상 및 대외활동</p>
            <p className={styles.helpSubtext}>- 연도</p>
            <p className={styles.helpSubtext}>- 활동명 or 수상내역</p>

            <p>📁 상세 경력 Or 프로젝트 경험</p>
            <p className={styles.helpSubtext}>- 업체명 / 프로젝트명</p>
            <p className={styles.helpSubtext}>- 프로젝트 소개</p>
            <p className={styles.helpSubtext}>- 본인의 역할</p>
            <p className={styles.helpSubtext}>
              - 수행 내용(업무 과정, 기여 성과 등)
            </p>

            <p>💻 보유 능력 / 스킬</p>
            <p className={styles.helpSubtext}>
              - 주요 기술 및 툴: (예: Python, Excel, Adobe XD 등)
            </p>

            <p>✍️ 나의 장단점 작성</p>
            <p className={styles.helpSubtext}>- 강점:</p>
            <p className={styles.helpSubtext}>- 보완할 점:</p>
          </div>
        </div>
      )}
    </>
  );
}
