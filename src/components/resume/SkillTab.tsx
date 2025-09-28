import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

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
  const setSnackbar = useBoundStore((state) => state.setSnackbar);
  const { control } = useFormContext<ResumeFormInput>();

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skillList',
  });

  const { debounced } = useDebouncedCallback(async (q: string) => {
    if (q.length < 3) return;
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

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debounced(value);
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무와 관련된 <span>스킬</span>
        </h1>
        <p className={styles.subTitle}>
          업무와 관련된 전문 지식, 기술 등이 좋아요.
        </p>
      </div>

      <div className={styles.inputSection}>
        {skillFields.length > 0 && (
          <div className={styles.addedSkillList}>
            {skillFields.map((skill, index) => (
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
                    removeSkill(index);
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
        )}

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
                    !Object.values(skillFields)
                      .map((skill) => skill.name)
                      .includes(search)
                  ) {
                    appendSkill({ id: crypto.randomUUID(), name: search });
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
                        !Object.values(skillFields)
                          .map((skill) => skill.name)
                          .includes(result)
                      ) {
                        appendSkill({ id: crypto.randomUUID(), name: result });
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
    </div>
  );
}
