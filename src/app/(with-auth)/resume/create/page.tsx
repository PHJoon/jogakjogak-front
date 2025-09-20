'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';

import arrowBackIcon from '@/assets/images/ic_back.svg';
import Button from '@/components/common/Button';
import CareerTab from '@/components/resume/CareerTab';
import ContentTab from '@/components/resume/ContentTab';
import EducationTab from '@/components/resume/EducationTab';
import ResumeTabs from '@/components/resume/ResumeTabs';
import SkillTab from '@/components/resume/SkillTab';
import { ERROR_CODES } from '@/constants/errorCode';
import useCreateResumeMutation from '@/hooks/mutations/resume/useCreateResumeMutation';
import useResumeForm from '@/hooks/resume/useResumeForm';
import useScrollDirection from '@/hooks/useScrollDirection';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeFormInput, ResumeRequestBody, ResumeTab } from '@/types/resume';
import getDistanceFromCenter from '@/utils/getDistanceFromCenter';

import styles from './page.module.css';

export default function CreateResumePage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<ResumeTab>('career');
  const setSnackbar = useBoundStore((state) => state.setSnackbar);
  const observedSet = useRef<HTMLElement[]>([]);

  const isVisible = useScrollDirection();

  const { methods } = useResumeForm();
  const { createResumeMutate, isResumeCreating } = useCreateResumeMutation();

  const setRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      observedSet.current.push(el);
    }
  }, []);

  const handleClickTab = (tab: ResumeTab) => {
    setCurrentTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 폼 제출
  const onSubmit: SubmitHandler<ResumeFormInput> = (data) => {
    if (data.isNewcomer === null) return;

    const formData: ResumeRequestBody = {
      isNewcomer: data.isNewcomer,
      careerList: data.careerList,
      educationList: data.educationList,
      content: data.content,
      skillList: data.skillList.map((skill) => skill.name),
    };

    createResumeMutate(formData, {
      onSuccess: () => {
        setSnackbar({ message: '이력서가 등록되었어요.', type: 'success' });
        router.push('/dashboard');
      },
      onError: (error) => {
        if (error instanceof HttpError) {
          if (error.errorCode === ERROR_CODES.REPLAY_REQUIRED) {
            return;
          }
        }
      },
    });
  };

  // Intersection Observer 설정
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);

        if (visible.length === 0) return;

        const closest = visible.reduce((prev, curr) => {
          return getDistanceFromCenter(prev) < getDistanceFromCenter(curr)
            ? prev
            : curr;
        });

        setCurrentTab(closest.target.id as ResumeTab);
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    observedSet.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect();
      observedSet.current = [];
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight;
      if (nearBottom) setCurrentTab('content');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.titleBar}>
        <div className={styles.titleBarContent}>
          <button className={styles.backButton} onClick={() => router.back()}>
            <Image src={arrowBackIcon} alt="뒤로가기" width={24} height={24} />
          </button>
          <h1 className={styles.title}>이력서 등록하기</h1>
        </div>
      </div>
      <div
        className={`${styles.tabBar} ${isVisible ? '' : styles.hidden}`}
        aria-label={'이력서 탭'}
      >
        <ResumeTabs currentTab={currentTab} onClickTab={handleClickTab} />
      </div>

      <div className={styles.formContainer}>
        <FormProvider {...methods}>
          <div className={styles.tabContentWrapper} ref={setRef} id="career">
            <CareerTab />
          </div>
          <div className={styles.tabContentWrapper} ref={setRef} id="education">
            <EducationTab />
          </div>
          <div className={styles.tabContentWrapper} ref={setRef} id="skill">
            <SkillTab />
          </div>
          <div className={styles.tabContentWrapper} ref={setRef} id="content">
            <ContentTab />
          </div>
        </FormProvider>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          style={{ width: '100%', height: '56px' }}
          onClick={methods.handleSubmit(onSubmit)}
          isLoading={isResumeCreating}
          disabled={isResumeCreating}
        >
          등록하기
        </Button>
      </div>
    </main>
  );
}
