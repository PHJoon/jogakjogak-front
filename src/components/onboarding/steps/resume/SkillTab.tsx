import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import closeIcon from '@/assets/images/ic_close.svg';
import plusIcon from '@/assets/images/ic_plus_no_background.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import useDebouncedCallback from '@/hooks/useDebouncedCallback';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeFormInput } from '@/types/resume';

import styles from './SkillTab.module.css';

export default function SkillTab() {
  const { setCurrentTab, skillListAnswer, setSkillListAnswer } = useBoundStore(
    useShallow((state) => ({
      setCurrentTab: state.setCurrentTab,
      skillListAnswer: state.skillListAnswer,
      setSkillListAnswer: state.setSkillListAnswer,
    }))
  );

  const { control, setValue } = useFormContext<ResumeFormInput>();

  const skillListWatch = useWatch({ name: 'skillList', control });

  const {
    fields: skillsFields,
    append: appendSkills,
    remove: removeSkills,
  } = useFieldArray({
    control,
    name: 'skillList',
  });

  const { debounced } = useDebouncedCallback(() => {
    // api 요청
    // 결과값으로 setSearchResults([...]);
  }, 500);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const ranRef = useRef(false);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // api 요청
    // debounced();
  };

  const handleClickPrevious = () => {
    setCurrentTab('education');
  };
  const handleClickNext = () => {
    setSkillListAnswer([...skillListWatch]);
    setCurrentTab('content');
  };

  // 첫 렌더링 시 저장된 상태로 초기화
  useEffect(() => {
    if (skillListAnswer.length > 0) {
      if (ranRef.current) return;
      ranRef.current = true;
      setValue('skillList', [...skillListAnswer]);
    }
  }, [setValue, skillListAnswer]);

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
          {skillsFields.map((skill, index) => (
            <Button
              key={skill.id}
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
              {skill.name}
              <div
                role="button"
                className={styles.removeSkillButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removeSkills(index);
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

        <div className={styles.searchSection}>
          <Input
            id={'searchSkill'}
            label={'검색으로 추가하기 (ex. React, Adobe 등)'}
            style={{
              width: '100%',
              borderRadius: search ? '12px 12px 0 0' : '12px',
            }}
            onChange={(e) => handleSearch(e)}
            value={search}
            maxLength={30}
          />

          {search && searchResults.length === 0 && (
            <div className={styles.searchResults}>
              <p className={styles.infoText}>
                검색결과
                <span>적합한 키워드가 없어요.</span>
              </p>
              <button
                type={'button'}
                className={styles.resultItem}
                onClick={() => {
                  if (
                    !Object.values(skillsFields)
                      .map((skill) => skill.name)
                      .includes(search)
                  ) {
                    appendSkills({ id: crypto.randomUUID(), name: search });
                  }
                }}
              >
                <span>&apos;{search}&apos;(으)로 직접 추가</span>
                <Image src={plusIcon} alt="Add skill" width={20} height={20} />
              </button>
            </div>
          )}

          {search && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <p className={styles.infoText}>검색결과</p>
              <div className={styles.resultsList}>
                {searchResults.map((result) => (
                  <button
                    key={result}
                    type={'button'}
                    className={styles.resultItem}
                    onClick={() => {
                      if (
                        !Object.values(skillsFields)
                          .map((skill) => skill.name)
                          .includes(search)
                      ) {
                        appendSkills({ id: crypto.randomUUID(), name: result });
                      }
                    }}
                  >
                    <span>{result}</span>
                    <Image
                      src={plusIcon}
                      alt="Add skill"
                      width={20}
                      height={20}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
