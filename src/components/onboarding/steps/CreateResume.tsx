import { useEffect } from 'react';
import { FormProvider, set } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import CareerTab from '@/components/onboarding/steps/resume/CareerTab';
import ContentTab from '@/components/onboarding/steps/resume/ContentTab';
import EducationTab from '@/components/onboarding/steps/resume/EducationTab';
import SkillTab from '@/components/onboarding/steps/resume/SkillTab';
import ResumeTabs from '@/components/resume/ResumeTabs';
import useResumeForm from '@/hooks/resume/useResumeForm';
import { DEFAULT_TAB, isValidTab, useBoundStore } from '@/stores/useBoundStore';

import styles from './CreateResume.module.css';

export default function CreateResume() {
  const { currentTab, setCurrentTab } = useBoundStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
      setCurrentTab: state.setCurrentTab,
    }))
  );
  const { methods } = useResumeForm({ isOnboarding: true });

  const handleClickTab = async (tab: string) => {
    if (currentTab === 'career') {
      const ok = await methods.trigger(['isNewcomer', 'careerList']);
      if (!ok) return;
    }
    if (currentTab === 'education') {
      const ok = await methods.trigger('educationList');
      if (!ok) return;
    }
    setCurrentTab(tab as typeof currentTab);
  };

  // 마운트 시에만 초기값이 이상할 경우 null로 초기화
  useEffect(() => {
    if (!isValidTab(currentTab)) {
      setCurrentTab(DEFAULT_TAB);
    }
  }, []);

  return (
    <div className={styles.mainContent}>
      <ResumeTabs
        isOnboarding
        currentTab={currentTab}
        onClickTab={handleClickTab}
      />
      <FormProvider {...methods}>
        {currentTab === 'career' && <CareerTab />}
        {currentTab === 'education' && <EducationTab />}
        {currentTab === 'skill' && <SkillTab />}
        {currentTab === 'content' && <ContentTab />}
      </FormProvider>
    </div>
  );
}
