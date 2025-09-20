import { FormProvider } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import CareerTab from '@/components/onboarding/steps/resume/CareerTab';
import ContentTab from '@/components/onboarding/steps/resume/ContentTab';
import EducationTab from '@/components/onboarding/steps/resume/EducationTab';
import SkillTab from '@/components/onboarding/steps/resume/SkillTab';
import ResumeTabs from '@/components/resume/ResumeTabs';
import useResumeForm from '@/hooks/resume/useResumeForm';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './CreateResume.module.css';

export default function CreateResume() {
  const { currentTab } = useBoundStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
    }))
  );
  const { methods } = useResumeForm({ isOnboarding: true });

  return (
    <div className={styles.mainContent}>
      <ResumeTabs isOnboarding currentTab={currentTab} onClickTab={() => {}} />
      <FormProvider {...methods}>
        {currentTab === 'career' && <CareerTab />}
        {currentTab === 'education' && <EducationTab />}
        {currentTab === 'skill' && <SkillTab />}
        {currentTab === 'content' && <ContentTab />}
      </FormProvider>
    </div>
  );
}
