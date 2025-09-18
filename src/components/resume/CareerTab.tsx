import Image from 'next/image';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';

import checkBoxIcon from '@/assets/images/ic_checkbox_gray.svg';
import checkBoxCheckedIcon from '@/assets/images/ic_checkbox_gray_checked.svg';
import deleteIcon from '@/assets/images/ic_delete.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import { ResumeFormInput } from '@/types/resume';

import styles from './CareerTab.module.css';

export default function CareerTab() {
  const { control } = useFormContext<ResumeFormInput>();

  const isNewcomer = useWatch({ name: 'isNewcomer', control });

  const {
    fields: careerFields,
    append: appendCareer,
    remove: removeCareer,
  } = useFieldArray({
    control,
    name: 'careerList',
  });

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무와 관련된 <span>경력</span>이 있나요?
        </h1>
        <p className={styles.subTitle}>담당 업무는 채용공고와 가장 직결돼요.</p>
      </div>

      <div className={styles.inputSection}>
        <Controller
          name="isNewcomer"
          control={control}
          rules={{
            validate: (value) => {
              return typeof value === 'boolean'
                ? true
                : '경력 여부를 선택해주세요.';
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <div className={styles.buttonGroup}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (value === true) {
                      onChange(null);
                      return;
                    }
                    onChange(true);
                    if (careerFields.length === 0) {
                      appendCareer({
                        companyName: '',
                        workPerformance: '',
                        joinedAt: '',
                        quitAt: '',
                        working: false,
                      });
                    }
                  }}
                  style={{ width: '96px', height: '56px' }}
                  isActive={value === true}
                >
                  네
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (value === false) {
                      onChange(null);
                      return;
                    }
                    onChange(false);
                  }}
                  style={{ width: '160px', height: '56px' }}
                  isActive={value === false}
                >
                  아니요 (신입)
                </Button>
              </div>
              {error && (
                <ErrorMessage
                  message={error.message || '경력 여부를 선택해주세요.'}
                />
              )}
            </>
          )}
        />
        {!isNewcomer && <div className={styles.noCareerListContainer}></div>}

        {isNewcomer && (
          <>
            <div className={styles.careerList}>
              {careerFields.map((field, index) => (
                <Controller
                  key={field.id}
                  name={`careerList.${index}`}
                  control={control}
                  rules={{
                    validate: (exp) => {
                      if (
                        !exp.joinedAt ||
                        !exp.companyName ||
                        !exp.workPerformance
                      ) {
                        return '경력 정보를 모두 입력해주세요.';
                      }
                      if (!exp.working && !exp.quitAt) {
                        return '퇴사년월을 입력해주세요.';
                      }
                      return true;
                    },
                  }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <div key={field.id} className={styles.careerItem}>
                      <div className={styles.dateRow}>
                        <div className={styles.joinedAtWrapper}>
                          <Input
                            id={`careerList[${index}].joinedAt`}
                            label={'입사년월'}
                            style={{ width: '100%' }}
                            onChange={(e) =>
                              onChange({ ...value, joinedAt: e.target.value })
                            }
                            value={value.joinedAt}
                            type={'date'}
                            required
                          />
                        </div>
                        <div className={styles.quitAtWrapper}>
                          <Input
                            id={`careerList[${index}].quitAt`}
                            label={'퇴사년월'}
                            style={{ width: '100%' }}
                            onChange={(e) =>
                              onChange({ ...value, quitAt: e.target.value })
                            }
                            value={value.quitAt}
                            type={'date'}
                            required
                            readOnly={value.working}
                            disabled={value.working}
                          />
                        </div>

                        <button
                          className={styles.workingCheckbox}
                          onClick={() =>
                            onChange({
                              ...value,
                              quitAt: '',
                              working: !value.working,
                            })
                          }
                        >
                          <Image
                            src={
                              value.working ? checkBoxCheckedIcon : checkBoxIcon
                            }
                            alt="체크박스 아이콘"
                            width={24}
                            height={24}
                            className={styles.checkboxIcon}
                          />
                          <span className={styles.checkboxLabel}>재직중</span>
                        </button>
                      </div>
                      <Input
                        id={`careerList[${index}].companyName`}
                        label={'회사명'}
                        onChange={(e) =>
                          onChange({ ...value, companyName: e.target.value })
                        }
                        value={value.companyName}
                      />
                      <Input
                        id={`careerList[${index}].workPerformance`}
                        label={'담당 업무와 주요 성과'}
                        onChange={(e) =>
                          onChange({
                            ...value,
                            workPerformance: e.target.value,
                          })
                        }
                        value={value.workPerformance}
                      />

                      {/* 에러 메세지 */}
                      {error && (
                        <ErrorMessage
                          message={
                            error.message || '경력 정보를 모두 입력해주세요.'
                          }
                        />
                      )}

                      {/* 삭제 버튼 */}
                      {careerFields.length > 1 && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => removeCareer(index)}
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
            <button
              className={styles.addCareerButton}
              onClick={() =>
                appendCareer({
                  companyName: '',
                  workPerformance: '',
                  joinedAt: '',
                  quitAt: '',
                  working: false,
                })
              }
            >
              <Image src={plusIcon} alt="추가 아이콘" />
              경력 추가하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
