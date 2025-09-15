import Image from 'next/image';
import { useState } from 'react';

import checkbox from '@/assets/images/ic_checkbox.svg';
import checkboxChecked from '@/assets/images/ic_checkbox_checked.svg';
import Button from '@/components/common/Button';

import styles from './AskHasResume.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function AskHasResume({ onNext, onPrevious }: Props) {
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  const handleOptionClick = (option: boolean) => {
    if (hasResume === null) {
      setHasResume(option);
      return;
    }
    setHasResume((prev) => (prev === option ? null : option));
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          지금 가지고 있는 <span>이력서</span>가 있나요?
        </h1>
        <p className={styles.subTitle}>
          채용공고와 정확한 매칭을 위해 필요해요.
        </p>
      </div>

      <div className={styles.inputSection}>
        <button
          className={`${styles.optionButton} ${hasResume === true ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(true)}
        >
          <Image
            src={hasResume === true ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          네, 이력서가 있어요. <span>(이력서 입력하러 가기)</span>
        </button>
        <button
          className={`${styles.optionButton} ${hasResume === false ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(false)}
        >
          <Image
            src={hasResume === false ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          아니요, 없어요
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
