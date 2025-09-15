import Image from 'next/image';
import { useState } from 'react';

import checkBoxIcon from '@/assets/images/ic_checkbox_gray.svg';
import checkBoxCheckedIcon from '@/assets/images/ic_checkbox_gray_checked.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import styles from './ExperienceTab.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function ExperienceTab({ onNext, onPrevious }: Props) {
  const [hasExperience, setHasExperience] = useState(true);

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무와 관련된 <span>경력</span>이 있나요?
        </h1>
        <p className={styles.subTitle}>담당 업무는 채용공고와 가장 직결돼요.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            onClick={() => setHasExperience(true)}
            style={{ width: '96px', height: '56px' }}
            isActive={hasExperience}
          >
            네
          </Button>
          <Button
            variant="secondary"
            onClick={() => setHasExperience(false)}
            style={{ width: '160px', height: '56px' }}
            isActive={!hasExperience}
          >
            아니요 (신입)
          </Button>
        </div>
        {hasExperience && (
          <>
            <div className={styles.inputGroup}>
              <div className={styles.inputRow}>
                <Input
                  id={'joinDate'}
                  label={'입사년월'}
                  style={{ height: '72px', width: '185px' }}
                  onChange={() => {}}
                  value={''}
                />
                <Input
                  id={'leaveDate'}
                  label={'퇴사년월'}
                  style={{ height: '72px', width: '185px' }}
                  onChange={() => {}}
                  value={''}
                />
                <button className={styles.checkbox}>
                  <Image
                    src={checkBoxIcon}
                    alt="체크박스 아이콘"
                    width={24}
                    height={24}
                    className={styles.checkboxIcon}
                  />
                  <span className={styles.checkboxLabel}>재직중</span>
                </button>
              </div>
              <Input
                id={'companyName'}
                label={'회사명'}
                style={{ height: '72px' }}
                onChange={() => {}}
                value={''}
              />
              <Input
                id={'responsibilities'}
                label={'담당 업무와 주요 성과'}
                style={{ height: '72px' }}
                onChange={() => {}}
                value={''}
              />
            </div>
            <button className={styles.addExperienceButton}>
              <Image src={plusIcon} alt="추가 아이콘" />
              경력 추가하기
            </button>
          </>
        )}
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
