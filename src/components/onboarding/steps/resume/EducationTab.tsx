import Image from 'next/image';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

import deleteIcon from '@/assets/images/ic_delete.svg';
import plusIcon from '@/assets/images/ic_plus.svg';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';
import Input from '@/components/common/Input';
import useResumeForm from '@/hooks/useResumeForm';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './EducationTab.module.css';

export default function EducationTab() {
  const educationLevels = ['학사', '전문학사', '고등학교', '석사', '박사'];
  const educationStatuses = [
    '졸업',
    '졸업예정',
    '재학',
    '휴학',
    '중퇴',
    '수료',
  ];

  const { setCurrentTab, educationAnswer, setEducationAnswer } = useBoundStore(
    useShallow((state) => ({
      setCurrentTab: state.setCurrentTab,
      educationAnswer: state.educationAnswer,
      setEducationAnswer: state.setEducationAnswer,
    }))
  );

  const {
    control,
    watch,
    setValue,
    errors,
    trigger,
    educationFields,
    appendEducation,
    removeEducation,
  } = useResumeForm();

  const handleClickPrevious = () => {
    setCurrentTab('experience');
  };

  const handleClickNext = async () => {
    await trigger('education');
    if (errors.education && errors.education.length) {
      return;
    }
    setEducationAnswer(watch('education'));
    // 다음 탭이 스킬 탭이므로 탭 이동
    setCurrentTab('skills');
  };

  const checkIfEducationExists = () => {
    if (educationFields.length === 0) return false;
    return true;
  };

  useEffect(() => {
    if (educationAnswer.length > 0) {
      setValue('education', [...educationAnswer]);
    }
  }, [educationAnswer, setValue]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>
          최종 <span>학력</span>을 입력해주세요.
        </h1>
        <p className={styles.subTitle}>채용공고의 최소 요건 확인에 필요해요.</p>
      </div>

      <div className={styles.inputSection}>
        <div className={styles.scrollWrapper}>
          <div className={styles.educationList}>
            {educationFields.map((field, index) => (
              <Controller
                key={field.id}
                name={`education.${index}`}
                control={control}
                rules={{
                  validate: (edu) => {
                    if (!edu.level || !edu.major || !edu.status) {
                      return '학력 정보를 모두 입력해주세요.';
                    }
                    return true;
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div className={styles.educationEntry}>
                    <div className={styles.educationLevelSelect}>
                      {educationLevels.map((level) => (
                        <Button
                          key={level}
                          variant={'secondary'}
                          style={{
                            width: 'fit-content',
                            height: '44px',
                            padding: '10px 16px',
                          }}
                          onClick={() => onChange({ ...value, level })}
                          isActive={value.level === level}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>

                    <Input
                      id={`educationMajor${index}.major`}
                      label={'학과명 혹은 계열'}
                      style={{ height: '72px', width: '454px' }}
                      onChange={(e) =>
                        onChange({ ...value, major: e.target.value })
                      }
                      value={value.major}
                    />

                    <div className={styles.educationStatusSelect}>
                      {educationStatuses.map((status) => (
                        <Button
                          key={status}
                          variant={'neutral'}
                          style={{
                            width: 'fit-content',
                            height: '44px',
                            padding: '10px 16px',
                          }}
                          onClick={() => onChange({ ...value, status })}
                          isActive={value.status === status}
                        >
                          {status}
                        </Button>
                      ))}
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
                  </div>
                )}
              />
            ))}
          </div>
        </div>

        <button
          className={styles.addEducationButton}
          onClick={() =>
            appendEducation({
              level: '',
              major: '',
              status: '',
            })
          }
        >
          <Image src={plusIcon} alt="추가 아이콘" />
          학력 추가하기
        </button>
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
          {educationFields.length > 0 ? '다음' : '건너뛰기'}
        </Button>
      </div>
    </div>
  );
}
