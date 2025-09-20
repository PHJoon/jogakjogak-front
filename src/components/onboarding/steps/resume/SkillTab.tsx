import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import closeIcon from '@/assets/images/ic_close.svg';
import plusIcon from '@/assets/images/ic_plus_no_background.svg';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { ERROR_CODES, ERROR_MESSAGES } from '@/constants/errorCode';
import useDebouncedCallback from '@/hooks/useDebouncedCallback';
import { searchSkillWords } from '@/lib/api/resume/resumeApi';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeFormInput } from '@/types/resume';

import styles from './SkillTab.module.css';

export default function SkillTab() {
  const { setCurrentTab, setSkillListAnswer, setSnackbar } = useBoundStore(
    useShallow((state) => ({
      setCurrentTab: state.setCurrentTab,
      setSkillListAnswer: state.setSkillListAnswer,
      setSnackbar: state.setSnackbar,
    }))
  );
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const { control } = useFormContext<ResumeFormInput>();
  const {
    fields: skillsFields,
    append: appendSkills,
    remove: removeSkills,
  } = useFieldArray({
    control,
    name: 'skillList',
  });
  const skillListWatch = useWatch({ name: 'skillList', control });

  const { debounced } = useDebouncedCallback(async (q: string) => {
    if (q.length === 0) {
      setSearchResults([]);
      return;
    }
    if (q.length < 3) {
      setSnackbar({
        type: 'info',
        message: '3글자 이상 입력해야 검색이 가능합니다.',
      });
      setSearchResults([]);
      return;
    }
    try {
      const response = await searchSkillWords(q);
      setSearchResults(response);
    } catch (error) {
      setSearchResults([]);
      if (error instanceof HttpError) {
        setSnackbar({
          type: 'error',
          message:
            ERROR_MESSAGES[error.code as keyof typeof ERROR_CODES] ||
            '알 수 없는 오류가 발생했습니다.',
        });
      }
    }
  }, 400);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debounced(value);
  };

  const handleClickPrevious = () => {
    setCurrentTab('education');
  };
  const handleClickNext = () => {
    setSkillListAnswer([...skillListWatch]);
    setCurrentTab('content');
  };

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
        <div className={styles.addedSkillList}>
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
            <div className={styles.searchResultListContainer}>
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
            <div className={styles.searchResultListContainer}>
              <p className={styles.infoText}>검색결과</p>
              <div className={styles.resultList}>
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
