import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
    createSimpleResumeAnswer,
    setCreateSimpleResumeAnswer,
  } = useBoundStore(
    useShallow((state) => ({
      setCurrentStep: state.setCurrentStep,
      createSimpleResumeAnswer: state.createSimpleResumeAnswer,
      setCreateSimpleResumeAnswer: state.setCreateSimpleResumeAnswer,
    }))
  );

  const handleClickPrevious = () => {
    setCurrentStep('ask_has_resume');
  };

  const handleClickNext = () => {
    if (createSimpleResumeAnswer === null) return;

    // 간단 이력서 작성 원함 -> 이력서 작성 단계로
    // 간단 이력서 작성 원하지 않음 -> 온보딩 종료 (대시보드로)
    if (createSimpleResumeAnswer) {
      setCurrentStep('create_resume');
      return;
    }
    // 온보딩 종료 (대시보드로)
    localStorage.removeItem('bound-store');
    router.push('/dashboard');
  };

  const handleOptionClick = (option: boolean) => {
    if (createSimpleResumeAnswer === null) {
      setCreateSimpleResumeAnswer(option);
      return;
    }
    setCreateSimpleResumeAnswer((prev) => (prev === option ? null : option));
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
          className={`${styles.optionButton} ${createSimpleResumeAnswer === true ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(true)}
        >
          <Image
            src={createSimpleResumeAnswer === true ? checkboxChecked : checkbox}
            alt="Checkbox"
            width={24}
            height={24}
          />
          <p className={styles.optionButtonText}>네, 만들래요.</p>
        </button>
        <button
          className={`${styles.optionButton} ${createSimpleResumeAnswer === false ? styles.selected : ''}`}
          type="button"
          onClick={() => handleOptionClick(false)}
        >
          <Image
            src={
              createSimpleResumeAnswer === false ? checkboxChecked : checkbox
            }
            alt="Checkbox"
            width={24}
            height={24}
          />
          <p className={styles.optionButtonText}>
            아니요. 다음에 만들게요. <span>(건너뛰기)</span>
          </p>
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
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
