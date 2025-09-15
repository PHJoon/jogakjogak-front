import Image from 'next/image';
import { useState } from 'react';

import closeIcon from '@/assets/images/ic_close.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import styles from './SkillsTab.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function SkillsTab({ onNext, onPrevious }: Props) {
  const [addedSkills, setAddedSkills] = useState<string[]>([
    'JavaScript',
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'Python',
    'Django',
    'AWS',
    'Docker',
    'Kubernetes',
    'GraphQL',
    'MongoDB',
    'PostgreSQL',
    'Redis',
    'Git',
    'CI/CD',
    'Jest',
    'Cypress',
    'Figma',
    'Adobe XD',
    'Photoshop',
    'Illustrator',
    'SEO',
    'Google Analytics',
  ]);
  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무 관련 <span>스킬</span>을 추가해주세요.
        </h1>
        <p className={styles.subTitle}>
          업무와 관련된 전문 지식, 기술 등이 좋아요.
        </p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.addedSkills}>
          {addedSkills.map((skill) => (
            <Button
              key={skill}
              variant={'neutral'}
              style={{
                width: 'fit-content',
                height: '40px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'default',
              }}
            >
              {skill}
              <div
                role="button"
                className={styles.removeSkillButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddedSkills(addedSkills.filter((s) => s !== skill));
                }}
              >
                <Image
                  src={closeIcon}
                  alt="Remove skill"
                  width={20}
                  height={20}
                />
              </div>
            </Button>
          ))}
        </div>

        <Input
          id={'searchSkill'}
          label={'검색으로 추가하기 (ex. React, Adobe 등)'}
          style={{ height: '72px', width: '454px' }}
          onChange={() => {}}
          value={''}
        />
      </div>

      <div className={styles.buttonSection}>
        <Button
          type="button"
          variant={'tertiary'}
          style={{ width: '96px' }}
          onClick={onPrevious}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
