import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import checkbox from '@/assets/images/ic_checkbox.svg';
import checkboxChecked from '@/assets/images/ic_checkbox_checked.svg';
import Button from '@/components/common/Button';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './AskCreateSimpleResume.module.css';

export default function AskCreateSimpleResume() {
  const router = useRouter();
  const {
    setCurrentStep,
    wantsToCreateSimpleResume,
    setWantsToCreateSimpleResume,
  } = useBoundStore(
    useShallow((state) => ({
      setCurrentStep: state.setCurrentStep,
      wantsToCreateSimpleResume: state.wantsToCreateSimpleResume,
      setWantsToCreateSimpleResume: state.setWantsToCreateSimpleResume,
    }))
  );

  const handleClickPrevious = () => {
    setCurrentStep('ask_has_resume');
  };

  const handleClickNext = () => {
    if (wantsToCreateSimpleResume === null) return;

    // 간단 이력서 작성 원함 -> 이력서 작성 단계로
    // 간단 이력서 작성 원하지 않음 -> 온보딩 종료 (대시보드로)
    if (wantsToCreateSimpleResume) {
      setCurrentStep('create_resume');
      return;
    }
    // 온보딩 종료 (대시보드로)
    localStorage.removeItem('bound-store');
    router.push('/dashboard');
  };

  const handleOptionClick = (option: boolean) => {
    if (wantsToCreateSimpleResume === null) {
      setWantsToCreateSimpleResume(option);
      return;
    }
    setWantsToCreateSimpleResume((prev) => (prev === option ? null : option));
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
          className={`${styles.optionButton} ${wantsToCreateSimpleResume === true ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(true)}
        >
          <Image
            src={
              wantsToCreateSimpleResume === true ? checkboxChecked : checkbox
            }
            alt="Checkbox"
            width={24}
            height={24}
          />
          네, 만들래요.
        </button>
        <button
          className={`${styles.optionButton} ${wantsToCreateSimpleResume === false ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(false)}
        >
          <Image
            src={
              wantsToCreateSimpleResume === false ? checkboxChecked : checkbox
            }
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
          onClick={handleClickPrevious}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={handleClickNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
