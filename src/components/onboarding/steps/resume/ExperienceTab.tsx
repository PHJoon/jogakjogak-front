import Image from 'next/image';
import { useEffect } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import checkBoxIcon from '@/assets/images/ic_checkbox_gray.svg';
import checkBoxCheckedIcon from '@/assets/images/ic_checkbox_gray_checked.svg';
import deleteIcon from '@/assets/images/ic_delete.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import { ResumeFormInput } from '@/hooks/useResumeForm';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './ExperienceTab.module.css';

export default function ExperienceTab() {
  const {
    setCurrentStep,
    hasWantsToCreateSimpleResume,
    setCurrentTab,
    hasExperienceAnswer,
    setHasExperienceAnswer,
    experienceAnswer,
    setExperienceAnswer,
  } = useBoundStore(
    useShallow((state) => ({
      setCurrentStep: state.setCurrentStep,
      hasWantsToCreateSimpleResume: state.wantsToCreateSimpleResume,
      setCurrentTab: state.setCurrentTab,
      hasExperienceAnswer: state.hasExperienceAnswer,
      setHasExperienceAnswer: state.setHasExperienceAnswer,
      experienceAnswer: state.experienceAnswer,
      setExperienceAnswer: state.setExperienceAnswer,
    }))
  );

  const {
    control,
    formState: { errors },
    trigger,
    setValue,
  } = useFormContext<ResumeFormInput>();

  const experienceWatch = useWatch({ name: 'experiences', control });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: 'experiences',
  });

  const handleClickPrevious = () => {
    // 이전 페이지가 간단 이력서 작성 여부 확인이었으면 그 페이지로
    if (hasWantsToCreateSimpleResume !== null) {
      setCurrentStep('ask_create_simple_resume');
      return;
    }
    setCurrentStep('ask_has_resume');
  };

  // 다음 버튼 활성화 체크 함수
  const checkGoToNext = async () => {
    if (hasExperienceAnswer === null) {
      return false;
    }
    await trigger('experiences');
    if (errors.experiences && errors.experiences.length) {
      return false;
    }
    if (hasExperienceAnswer === true && experienceFields.length === 0) {
      return false;
    }
    return true;
  };

  const handleClickNext = async () => {
    const canGoToNext = await checkGoToNext();
    if (!canGoToNext) return;
    // 이력서 없음(신입) 선택 시 경험 정보 초기화
    if (hasExperienceAnswer === false) {
      setExperienceAnswer([]);
      // 다음 탭이 학력 탭이므로 탭 이동
      setCurrentTab('education');
      return;
    }
    setExperienceAnswer([...experienceWatch]);
    // 다음 탭이 학력 탭이므로 탭 이동
    setCurrentTab('education');
  };

  useEffect(() => {
    if (experienceAnswer.length > 0) {
      setValue('experiences', [...experienceAnswer]);
    }
  }, [experienceAnswer, setValue]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          직무와 관련된 <span>경력</span>이 있나요?
        </h1>
        <p className={styles.subTitle}>담당 업무는 채용공고와 가장 직결돼요.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.buttonGroup}>
          <Button
            variant="secondary"
            onClick={() => {
              if (hasExperienceAnswer === true) {
                setHasExperienceAnswer(null);
                return;
              }
              setHasExperienceAnswer(true);
              if (experienceFields.length === 0) {
                appendExperience({
                  company: '',
                  responsibilities: '',
                  startDate: '',
                  endDate: '',
                  isCurrentlyWorking: false,
                });
              }
            }}
            style={{ width: '96px', height: '56px' }}
            isActive={hasExperienceAnswer === true}
          >
            네
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (hasExperienceAnswer === false) {
                setHasExperienceAnswer(null);
                return;
              }
              setHasExperienceAnswer(false);
            }}
            style={{ width: '160px', height: '56px' }}
            isActive={hasExperienceAnswer === false}
          >
            아니요 (신입)
          </Button>
        </div>

        {hasExperienceAnswer && (
          <>
            <div
              className={`${styles.scrollWrapper} ${experienceFields.length === 0 ? styles.hidden : ''}`}
            >
              <div className={styles.experienceContainer}>
                {experienceFields.map((field, index) => (
                  <Controller
                    key={field.id}
                    name={`experiences.${index}`}
                    control={control}
                    rules={{
                      validate: (exp) => {
                        if (
                          !exp.startDate ||
                          !exp.company ||
                          !exp.responsibilities
                        ) {
                          return '경력 정보를 모두 입력해주세요.';
                        }
                        if (!exp.isCurrentlyWorking && !exp.endDate) {
                          return '퇴사년월을 입력해주세요.';
                        }
                        return true;
                      },
                    }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <div key={field.id} className={styles.experienceEntry}>
                        <div className={styles.dateRow}>
                          <Input
                            id={`experiences[${index}].startDate`}
                            label={'입사년월'}
                            style={{ height: '72px', width: '185px' }}
                            onChange={(e) =>
                              onChange({ ...value, startDate: e.target.value })
                            }
                            value={value.startDate}
                            type={'date'}
                            required
                          />
                          <Input
                            id={`experiences[${index}].endDate`}
                            label={'퇴사년월'}
                            style={{ height: '72px', width: '185px' }}
                            onChange={(e) =>
                              onChange({ ...value, endDate: e.target.value })
                            }
                            value={value.endDate}
                            type={'date'}
                            required
                            readOnly={value.isCurrentlyWorking}
                            disabled={value.isCurrentlyWorking}
                          />

                          <button
                            className={styles.checkbox}
                            onClick={() =>
                              onChange({
                                ...value,
                                isCurrentlyWorking: !value.isCurrentlyWorking,
                              })
                            }
                          >
                            <Image
                              src={
                                value.isCurrentlyWorking
                                  ? checkBoxCheckedIcon
                                  : checkBoxIcon
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
                          id={`experiences[${index}].company`}
                          label={'회사명'}
                          style={{ height: '72px' }}
                          onChange={(e) =>
                            onChange({ ...value, company: e.target.value })
                          }
                          value={value.company}
                        />
                        <Input
                          id={`experiences[${index}].responsibilities`}
                          label={'담당 업무와 주요 성과'}
                          style={{ height: '72px' }}
                          onChange={(e) =>
                            onChange({
                              ...value,
                              responsibilities: e.target.value,
                            })
                          }
                          value={value.responsibilities}
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
                        {experienceFields.length > 1 && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => removeExperience(index)}
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
            </div>
            <button
              className={styles.addExperienceButton}
              onClick={() =>
                appendExperience({
                  company: '',
                  responsibilities: '',
                  startDate: '',
                  endDate: '',
                  isCurrentlyWorking: false,
                })
              }
            >
              <Image src={plusIcon} alt="추가 아이콘" />
              경력 추가하기
            </button>
          </>
        )}
      </div>

      <div className={styles.buttonSection}>
        <Button
          type="button"
          variant={'tertiary'}
          style={{ width: '96px' }}
          onClick={handleClickPrevious}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={handleClickNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
