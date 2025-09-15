'use client';

import Image from 'next/image';
import { useState } from 'react';

import introImage from '@/assets/images/intro.png';
import ProgressIndicator from '@/components/onboarding/ProgressIndicator';
import AskCreateSimpleResume from '@/components/onboarding/steps/AskCreateSimpleResume';
import AskHasResume from '@/components/onboarding/steps/AskHasResume';
import CreateResume from '@/components/onboarding/steps/CreateResume';
import Nickname from '@/components/onboarding/steps/Nickname';

import styles from './page.module.css';

const steps = [
  {
    id: 'profile',
    label: '개인정보 입력하기',
    stepNumber: 1,
  },
  {
    id: 'ask_has_resume',
    label: '이력서 확인하기',
    stepNumber: 2,
  },
  {
    id: 'ask_create_simple_resume',
    label: '이력서 만들기',
    stepNumber: 3,
  },
  {
    id: 'create_resume',
    label: '이력서 만들기',
    stepNumber: 3,
  },
];

interface Props {
  currentStep: (typeof steps)[0];
  onNext: () => void;
  onPrevious: () => void;
}

export default function Onboarding() {
  const [step, setStep] = useState<(typeof steps)[0]>(steps[0]);

  const handleClickNext = () => {
    const currentIndex = steps.findIndex((s) => s.id === step.id);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleClickPrevious = () => {
    const currentIndex = steps.findIndex((s) => s.id === step.id);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <section className={styles.onboardingSection}>
          {/* 진행 단계 */}
          <div className={styles.progressIndicatorContainer}>
            <ProgressIndicator
              currentStepNumber={step.stepNumber}
              currentStepLabel={step.label}
            />
          </div>

          {/* 닉네임 설정 단계 */}
          {step.id === 'profile' && (
            <Nickname
              onNext={handleClickNext}
              onPrevious={handleClickPrevious}
            />
          )}

          {/* 기존 보유 이력서 확인 단계 */}
          {step.id === 'ask_has_resume' && (
            <AskHasResume
              onNext={handleClickNext}
              onPrevious={handleClickPrevious}
            />
          )}

          {/* 간단 이력서 작성 여부 확인 단계 */}
          {step.id === 'ask_create_simple_resume' && (
            <AskCreateSimpleResume
              onNext={handleClickNext}
              onPrevious={handleClickPrevious}
            />
          )}

          {/* 이력서 작성 단계 */}
          {step.id === 'create_resume' && (
            <CreateResume
              onNext={handleClickNext}
              onPrevious={handleClickPrevious}
            />
          )}
        </section>
        <aside className={styles.imageSection}>
          <Image src={introImage} alt="Intro image" fill priority />
        </aside>
      </main>
    </>
  );
}
