import Image from 'next/image';
import { useState } from 'react';

import checkbox from '@/assets/images/ic_checkbox.svg';
import checkboxChecked from '@/assets/images/ic_checkbox_checked.svg';
import Button from '@/components/common/Button';

import styles from './AskCreateSimpleResume.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function AskCreateSimpleResume({ onNext, onPrevious }: Props) {
  const [createResume, setCreateResume] = useState<boolean | null>(null);

  const handleOptionClick = (option: boolean) => {
    if (createResume === null) {
      setCreateResume(option);
      return;
    }
    setCreateResume((prev) => (prev === option ? null : option));
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          간단한 <span>이력서</span>를 만들까요?
        </h1>
        <p className={styles.subTitle}>
          분석에 필요한 기본적인 사항 몇개면 돼요.
        </p>
      </div>

      <div className={styles.inputSection}>
        <button
          className={`${styles.optionButton} ${createResume === true ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(true)}
        >
          <Image
            src={createResume === true ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          네, 만들래요.
        </button>
        <button
          className={`${styles.optionButton} ${createResume === false ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(false)}
        >
          <Image
            src={createResume === false ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          아니요. 다음에 만들게요. (건너뛰기)
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
