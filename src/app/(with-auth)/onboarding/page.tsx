'use client';

import Image from 'next/image';

import introImage from '@/assets/images/intro.png';
import ProgressIndicator from '@/components/onboarding/ProgressIndicator';
import AskCreateSimpleResume from '@/components/onboarding/steps/AskCreateSimpleResume';
import AskHasResume from '@/components/onboarding/steps/AskHasResume';
import CreateResume from '@/components/onboarding/steps/CreateResume';
import Nickname from '@/components/onboarding/steps/Nickname';
import useClientMeta from '@/hooks/useClientMeta';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './page.module.css';

export default function Onboarding() {
  const currentStep = useBoundStore((state) => state.currentStep);

  // 클라이언트 메타 설정
  useClientMeta(
    '온보딩 | 조각조각',
    '조각조각 서비스를 시작하기 위한 온보딩을 진행합니다. 닉네임 설정과 이력서 작성을 안내합니다.'
  );

  return (
    <>
      <main className={styles.main}>
        <section className={styles.onboardingSection}>
          {/* 진행 단계 */}
          <div className={styles.progressIndicatorContainer}>
            <ProgressIndicator />
          </div>

          {/* 닉네임 설정 단계 */}
          {currentStep === 'profile' && <Nickname />}

          {/* 기존 보유 이력서 확인 단계 */}
          {currentStep === 'ask_has_resume' && <AskHasResume />}

          {/* 간단 이력서 작성 여부 확인 단계 */}
          {currentStep === 'ask_create_simple_resume' && (
            <AskCreateSimpleResume />
          )}

          {/* 이력서 작성 단계 */}
          {currentStep === 'create_resume' && <CreateResume />}
        </section>

        <aside className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              src={introImage}
              alt="Intro image"
              priority
              fill
              style={{ objectFit: 'cover', objectPosition: 'left' }}
            />
          </div>
        </aside>
      </main>
    </>
  );
}
