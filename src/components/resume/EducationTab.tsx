import Image from 'next/image';
import { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import deleteIcon from '@/assets/images/ic_delete.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import { EDUCATION_LEVELS, EDUCATION_STATUSES } from '@/constants/resume';
import { ResumeFormInput } from '@/types/resume';

import styles from './EducationTab.module.css';

export default function EducationTab() {
  const { control, setValue } = useFormContext<ResumeFormInput>();

  const [selectedEducationLevel, setSelectedEducationLevel] = useState('none');

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'educationList',
  });

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무와 관련된 <span>학력</span>
        </h1>
        <p className={styles.subTitle}>채용공고의 최소 요건 확인에 필요해요.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.educationList}>
          {educationFields.length === 0 && (
            <div className={styles.educationLevelSelect}>
              {EDUCATION_LEVELS.map(({ label, value: levelValue }) => (
                <Button
                  key={levelValue}
                  variant={'secondary'}
                  style={{
                    width: 'fit-content',
                    height: '44px',
                    padding: '10px 16px',
                  }}
                  onClick={() => {
                    setSelectedEducationLevel(levelValue);
                    appendEducation({
                      level: levelValue,
                      majorField: '',
                      status: '',
                    });
                  }}
                  isActive={selectedEducationLevel === levelValue}
                >
                  {label}
                </Button>
              ))}
              <Button
                variant={'neutral'}
                style={{
                  width: 'fit-content',
                  height: '44px',
                  padding: '10px 16px',
                }}
                onClick={() => setSelectedEducationLevel('none')}
                isActive={selectedEducationLevel === 'none'}
              >
                해당없음
              </Button>
            </div>
          )}

          {educationFields.length > 0 &&
            educationFields.map((field, index) => (
              <Controller
                key={field.id}
                name={`educationList.${index}`}
                control={control}
                rules={{
                  validate: (edu) => {
                    if (!edu.level || !edu.majorField || !edu.status) {
                      return '학력 정보를 모두 입력해주세요.';
                    }
                    return true;
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className={styles.educationItem}>
                    <div className={styles.educationLevelSelect}>
                      {EDUCATION_LEVELS.map(({ label, value: levelValue }) => (
                        <Button
                          key={levelValue}
                          variant={'secondary'}
                          style={{
                            width: 'fit-content',
                            height: '44px',
                            padding: '10px 16px',
                          }}
                          onClick={() =>
                            onChange({ ...value, level: levelValue })
                          }
                          isActive={value.level === levelValue}
                        >
                          {label}
                        </Button>
                      ))}
                      {index === 0 && (
                        <Button
                          variant={'neutral'}
                          style={{
                            width: 'fit-content',
                            height: '44px',
                            padding: '10px 16px',
                          }}
                          onClick={() => {
                            setSelectedEducationLevel('none');
                            setValue('educationList', []);
                          }}
                          isActive={selectedEducationLevel === 'none'}
                        >
                          해당없음
                        </Button>
                      )}
                    </div>

                    <Input
                      id={`educationList.${index}.majorField`}
                      label={'학과명 혹은 계열'}
                      style={{ width: '100%' }}
                      onChange={(e) =>
                        onChange({ ...value, majorField: e.target.value })
                      }
                      value={value.majorField}
                    />

                    <div className={styles.educationStatusSelect}>
                      {EDUCATION_STATUSES.map(
                        ({ label, value: statusValue }) => (
                          <Button
                            key={statusValue}
                            variant={'neutral'}
                            style={{
                              width: 'auto',
                              height: '44px',
                              padding: '10px 16px',
                            }}
                            onClick={() =>
                              onChange({ ...value, status: statusValue })
                            }
                            isActive={value.status === statusValue}
                          >
                            {label}
                          </Button>
                        )
                      )}
                    </div>
                    {/* 에러 메세지 */}
                    {error && (
                      <ErrorMessage
                        message={
                          error.message ?? '학력 정보를 모두 입력해주세요.'
                        }
                      />
                    )}
                    {/* 삭제 버튼 */}
                    {educationFields.length > 1 && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => removeEducation(index)}
                      >
                        <Image
                          src={deleteIcon}
                          alt="삭제 아이콘"
                          width={24}
                          height={24}
                        />
                        <span>삭제</span>
                      </button>
                    )}
                  </div>
                )}
              />
            ))}
        </div>

        {educationFields.length > 0 && (
          <button
            className={styles.addEducationButton}
            onClick={() =>
              appendEducation({
                level: '',
                majorField: '',
                status: '',
              })
            }
          >
            <Image src={plusIcon} alt="추가 아이콘" />
            학력 추가하기
          </button>
        )}
      </div>
    </div>
  );
}
