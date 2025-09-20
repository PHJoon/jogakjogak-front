import Image from 'next/image';
import { useState } from 'react';
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
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeFormInput } from '@/types/resume';

import styles from './CareerTab.module.css';

export default function CareerTab() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    setCurrentStep,
    createSimpleResumeAnswer,
    setCurrentTab,
    setIsNewcomerAnswer,
    setCareerListAnswer,
  } = useBoundStore(
    useShallow((state) => ({
      setCurrentStep: state.setCurrentStep,
      createSimpleResumeAnswer: state.createSimpleResumeAnswer,
      setCurrentTab: state.setCurrentTab,
      setIsNewcomerAnswer: state.setIsNewcomerAnswer,
      setCareerListAnswer: state.setCareerListAnswer,
    }))
  );

  const { control, trigger } = useFormContext<ResumeFormInput>();
  const {
    fields: careerFields,
    append: appendCareer,
    remove: removeCareer,
  } = useFieldArray({
    control,
    name: 'careerList',
  });
  const isNewcomerWatch = useWatch({ name: 'isNewcomer', control });
  const careerListWatch = useWatch({ name: 'careerList', control });

  const handleClickPrevious = () => {
    // 이전 페이지가 간단 이력서 작성 여부 확인이었으면 그 페이지로
    if (createSimpleResumeAnswer !== null) {
      setCurrentStep('ask_create_simple_resume');
      return;
    }
    setCurrentStep('ask_has_resume');
  };

  const handleClickNext = async () => {
    const ok = await trigger(['isNewcomer', 'careerList']);
    if (!ok) return;

    setIsNewcomerAnswer(isNewcomerWatch);

    // 이력서 없음(신입) 선택 시 careerListAnswer 초기화
    if (isNewcomerWatch === false) {
      setCareerListAnswer([]);
    } else {
      setCareerListAnswer([...careerListWatch]);
    }
    // 다음 탭이 학력 탭이므로 탭 이동
    setCurrentTab('education');
  };

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
        {!isNewcomerWatch && (
          <div className={styles.noCareerListContainer}></div>
        )}

        {isNewcomerWatch && (
          <>
            <div
              className={`${styles.scrollWrapper} ${careerFields.length === 0 ? styles.hidden : ''}`}
            >
              <div className={styles.careerList}>
                {careerFields.map((field, index) => (
                  <Controller
                    key={field.id}
                    name={`careerList.${index}`}
                    control={control}
                    rules={{
                      validate: (career) => {
                        if (
                          !career.joinedAt ||
                          !career.companyName ||
                          !career.workPerformance
                        ) {
                          return '경력 정보를 모두 입력해주세요.';
                        }
                        if (!career.working && !career.quitAt) {
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
                                value.working
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
                            onClick={() => setIsDeleteModalOpen(true)}
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
                        <DeleteConfirmModal
                          title="정말 삭제하시겠습니까?"
                          highlightedText="삭제"
                          message="기록한 내용이 모두 삭제돼요."
                          cancelText="아니요"
                          confirmText="확인"
                          isOpen={isDeleteModalOpen}
                          onClose={() => setIsDeleteModalOpen(false)}
                          onConfirm={() => {
                            removeCareer(index);
                            setIsDeleteModalOpen(false);
                          }}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
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
            disabled={isNewcomerWatch === null} // 신입/경력 선택 안했거나, 경력 선택했는데 경력사항이 하나도 없으면 비활성화
          >
            다음 단계
          </Button>
        </div>
      </div>
    </div>
  );
}
