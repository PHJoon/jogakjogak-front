import Image from 'next/image';
import { useEffect, useState } from 'react';

import skillIcon from '@/assets/images/ic_brush_sharp.svg';
import skillActiveIcon from '@/assets/images/ic_brush_sharp_active.svg';
import contentIcon from '@/assets/images/ic_chat_bubble.svg';
import contentActiveIcon from '@/assets/images/ic_chat_bubble_active.svg';
import careerIcon from '@/assets/images/ic_id_card.svg';
import careerActiveIcon from '@/assets/images/ic_id_card_active.svg';
import educationIcon from '@/assets/images/ic_school.svg';
import educationActiveIcon from '@/assets/images/ic_school_active.svg';
import { ResumeTab } from '@/types/resume';

import styles from './ResumeTabs.module.css';

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

interface Props {
  currentTab: ResumeTab;
  onClickTab: (tab: ResumeTab) => void;
  isOnboarding?: boolean;
}

export default function ResumeTabs({
  currentTab,
  onClickTab,
  isOnboarding = false,
}: Props) {
  const [active, setActive] = useState(0);

  const handleClickTab = (tab: ResumeTab) => {
    onClickTab(tab);
  };

  // 인디케이트 위치 이동
  useEffect(() => {
    const index = Object.keys(tabs).indexOf(currentTab);
    setActive(index);
  }, [currentTab]);

  return (
    <div
      className={`${styles.resumeTabs} ${isOnboarding ? styles.onboarding : ''}`}
    >
      {Object.entries(tabs).map(([tab, { label, icon, activeIcon }]) => (
        <button
          key={tab}
          className={`${styles.tab} ${
            tab === currentTab ? styles.activeTab : ''
          }`}
          onClick={() => {
            handleClickTab(tab as ResumeTab);
          }}
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
        </button>
      ))}
      <span
        className={styles.indicator}
        style={{ transform: `translateX(${active * 100}%)` }}
        aria-hidden
      />
    </div>
  );
}
