import Image from 'next/image';
import { useState } from 'react';

import skillsIcon from '@/assets/images/ic_brush_sharp.svg';
import skillsActiveIcon from '@/assets/images/ic_brush_sharp_active.svg';
import etcIcon from '@/assets/images/ic_chat_bubble.svg';
import etcActiveIcon from '@/assets/images/ic_chat_bubble_active.svg';
import experienceIcon from '@/assets/images/ic_id_card.svg';
import experienceActiveIcon from '@/assets/images/ic_id_card_active.svg';
import educationIcon from '@/assets/images/ic_school.svg';
import educationActiveIcon from '@/assets/images/ic_school_active.svg';
import EducationTab from '@/components/onboarding/steps/resume/EducationTab';
import EtcTab from '@/components/onboarding/steps/resume/EtcTab';
import ExperienceTab from '@/components/onboarding/steps/resume/ExperienceTab';
import SkillsTab from '@/components/onboarding/steps/resume/SkillsTab';

import styles from './CreateResume.module.css';

const tabs = {
  experience: {
    label: '경력',
    icon: experienceIcon,
    activeIcon: experienceActiveIcon,
  },
  education: {
    label: '학력',
    icon: educationIcon,
    activeIcon: educationActiveIcon,
  },
  skills: {
    label: '스킬',
    icon: skillsIcon,
    activeIcon: skillsActiveIcon,
  },
  etc: {
    label: '자유',
    icon: etcIcon,
    activeIcon: etcActiveIcon,
  },
};

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function CreateResume({ onNext, onPrevious }: Props) {
  const [currentTab, setCurrentTab] = useState<
    'experience' | 'education' | 'skills' | 'etc'
  >('experience');

  const handleClickNext = () => {
    if (currentTab === 'experience') {
      setCurrentTab('education');
    } else if (currentTab === 'education') {
      setCurrentTab('skills');
    } else if (currentTab === 'skills') {
      setCurrentTab('etc');
    } else {
      onNext();
    }
  };

  const handleClickPrevious = () => {
    if (currentTab === 'etc') {
      setCurrentTab('skills');
    } else if (currentTab === 'skills') {
      setCurrentTab('education');
    } else if (currentTab === 'education') {
      setCurrentTab('experience');
    } else {
      onPrevious();
    }
  };

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
              width={20}
              height={20}
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
      </div>

      {currentTab === 'experience' && (
        <ExperienceTab
          onNext={handleClickNext}
          onPrevious={handleClickPrevious}
        />
      )}

      {currentTab === 'education' && (
        <EducationTab
          onNext={handleClickNext}
          onPrevious={handleClickPrevious}
        />
      )}

      {currentTab === 'skills' && (
        <SkillsTab onNext={handleClickNext} onPrevious={handleClickPrevious} />
      )}

      {currentTab === 'etc' && (
        <EtcTab onNext={handleClickNext} onPrevious={handleClickPrevious} />
      )}
    </div>
  );
}
