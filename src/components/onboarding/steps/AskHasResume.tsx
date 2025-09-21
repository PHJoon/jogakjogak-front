import Image from 'next/image';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';

import checkbox from '@/assets/images/ic_checkbox.svg';
import checkboxChecked from '@/assets/images/ic_checkbox_checked.svg';
import Button from '@/components/common/Button';
import { isValidBooleanNull, useBoundStore } from '@/stores/useBoundStore';

import styles from './AskHasResume.module.css';

export default function AskHasResume() {
  const { setCurrentStep, hasResumeAnswer, setHasResumeAnswer } = useBoundStore(
    useShallow((state) => ({
      setCurrentStep: state.setCurrentStep,
      hasResumeAnswer: state.hasResumeAnswer,
      setHasResumeAnswer: state.setHasResumeAnswer,
    }))
  );

  const handleClickPrevious = () => {
    setCurrentStep('profile');
  };

  const handleClickNext = () => {
    if (hasResumeAnswer === null) return;

    // 이력서 있음 -> 이력서 작성 단계로
    // 이력서 없음 -> 간단 이력서 작성 여부 확인 단계로
    if (hasResumeAnswer === true) {
      setCurrentStep('create_resume');
      return;
    }
    setCurrentStep('ask_create_simple_resume');
  };

  const handleOptionClick = (option: boolean) => {
    if (hasResumeAnswer === null) {
      setHasResumeAnswer(option);
      return;
    }
    setHasResumeAnswer((prev) => (prev === option ? null : option));
  };

  // 마운트 시에만 초기값이 이상할 경우 null로 초기화
  useEffect(() => {
    if (!isValidBooleanNull(hasResumeAnswer)) {
      setHasResumeAnswer(null);
    }
  }, []);

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
          className={`${styles.optionButton} ${hasResumeAnswer === true ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(true)}
        >
          <Image
            src={hasResumeAnswer === true ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          <p className={styles.optionButtonText}>
            네, 이력서가 있어요. <span>(이력서 입력하러 가기)</span>
          </p>
        </button>
        <button
          className={`${styles.optionButton} ${hasResumeAnswer === false ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(false)}
        >
          <Image
            src={hasResumeAnswer === false ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          <p className={styles.optionButtonText}>아니요, 없어요</p>
        </button>
      </div>

      <div className={styles.stepNavigationButtonGroup}>
        <div className={styles.previousButtonWrapper}>
          <Button
            type="button"
            variant={'tertiary'}
            style={{ width: '100%', height: '100%' }}
            onClick={handleClickPrevious}
          >
            이전
          </Button>
        </div>
        <div className={styles.nextButtonWrapper}>
          <Button
            type="button"
            variant={'primary'}
            style={{ width: '100%', height: '100%' }}
            onClick={handleClickNext}
            disabled={hasResumeAnswer === null}
          >
            다음 단계
          </Button>
        </div>
      </div>
    </div>
  );
}
