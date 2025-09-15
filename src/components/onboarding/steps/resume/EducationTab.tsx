import Image from 'next/image';
import { useState } from 'react';

import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import styles from './EducationTab.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function EducationTab({ onNext, onPrevious }: Props) {
  const educationLevels = ['학사', '전문학사', '고등학교', '석사', '박사'];
  const educationStatuses = [
    '졸업',
    '졸업예정',
    '재학',
    '휴학',
    '중퇴',
    '수료',
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          최종 <span>학력</span>을 입력해주세요.
        </h1>
        <p className={styles.subTitle}>채용공고의 최소 요건 확인에 필요해요.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <div className={styles.educationOptions}>
            {educationLevels.map((level) => (
              <Button
                key={level}
                variant={'secondary'}
                style={{
                  width: 'fit-content',
                  height: '44px',
                  padding: '10px 16px',
                }}
              >
                {level}
              </Button>
            ))}
          </div>
          <Input
            id={'major'}
            label={'학과명 혹은 계열'}
            style={{ height: '72px', width: '454px' }}
            onChange={() => {}}
            value={''}
          />

          <div className={styles.educationStatusOptions}>
            {educationStatuses.map((status) => (
              <Button
                key={status}
                variant={'neutral'}
                style={{
                  width: 'fit-content',
                  height: '44px',
                  padding: '10px 16px',
                }}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        <button className={styles.addEducationButton}>
          <Image src={plusIcon} alt="추가 아이콘" />
          학력 추가하기
        </button>
      </div>

      <div className={styles.buttonSection}>
        <Button
          type="button"
          variant={'tertiary'}
          style={{ width: '96px' }}
          onClick={onPrevious}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
