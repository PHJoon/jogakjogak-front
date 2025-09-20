import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import skillIcon from '@/assets/images/ic_brush_sharp.svg';
import skillActiveIcon from '@/assets/images/ic_brush_sharp_active.svg';
import contentIcon from '@/assets/images/ic_chat_bubble.svg';
import contentActiveIcon from '@/assets/images/ic_chat_bubble_active.svg';
import careerIcon from '@/assets/images/ic_id_card.svg';
import careerActiveIcon from '@/assets/images/ic_id_card_active.svg';
import educationIcon from '@/assets/images/ic_school.svg';
import educationActiveIcon from '@/assets/images/ic_school_active.svg';
import CareerTab from '@/components/onboarding/steps/resume/CareerTab';
import ContentTab from '@/components/onboarding/steps/resume/ContentTab';
import EducationTab from '@/components/onboarding/steps/resume/EducationTab';
import SkillTab from '@/components/onboarding/steps/resume/SkillTab';
import useResumeForm from '@/hooks/resume/useResumeForm';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './CreateResume.module.css';

const tabs = {
  career: {
    label: '경력',
    icon: careerIcon,
    activeIcon: careerActiveIcon,
  },
  education: {
    label: '학력',
    icon: educationIcon,
    activeIcon: educationActiveIcon,
  },
  skill: {
    label: '스킬',
    icon: skillIcon,
    activeIcon: skillActiveIcon,
  },
  content: {
    label: '자유',
    icon: contentIcon,
    activeIcon: contentActiveIcon,
  },
};

export default function CreateResume() {
  const { currentTab } = useBoundStore(
    useShallow((state) => ({
      currentTab: state.currentTab,
    }))
  );
  const [active, setActive] = useState(0);

  const { methods } = useResumeForm({ isOnboarding: true });

  // 인디케이트 위치 이동
  useEffect(() => {
    const index = Object.keys(tabs).indexOf(currentTab);
    setActive(index);
  }, [currentTab]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.resumeTabs}>
        {Object.entries(tabs).map(([tab, { label, icon, activeIcon }]) => (
          <div
            key={tab}
            className={`${styles.tab} ${
              tab === currentTab ? styles.activeTab : ''
            }`}
          >
            <Image
              src={tab === currentTab ? activeIcon : icon}
              alt={`${label} 아이콘`}
              width={24}
              height={24}
            />
            <span
              className={`${styles.tabLabel} ${
                tab === currentTab ? styles.activeTabLabel : ''
              }`}
            >
              {label}
            </span>
          </div>
        ))}
        <span
          className={styles.indicator}
          style={{ transform: `translateX(${active * 100}%)` }}
          aria-hidden
        />
      </div>
      <FormProvider {...methods}>
        {currentTab === 'career' && <CareerTab />}
        {currentTab === 'education' && <EducationTab />}
        {currentTab === 'skill' && <SkillTab />}
        {currentTab === 'content' && <ContentTab />}
      </FormProvider>
    </div>
  );
}
