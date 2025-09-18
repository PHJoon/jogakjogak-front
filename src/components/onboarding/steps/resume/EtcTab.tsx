// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useFormContext, useWatch } from 'react-hook-form';
// import { useShallow } from 'zustand/shallow';

// import Button from '@/components/common/Button';
// import Textarea from '@/components/common/Textarea';
// import { ResumeFormInput } from '@/hooks/resume/useResumeForm';
// import { useBoundStore } from '@/stores/useBoundStore';

// import styles from './EtcTab.module.css';

// export default function EtcTab() {
//   const router = useRouter();

//   const { setCurrentTab, etcAnswer, setEtcAnswer } = useBoundStore(
//     useShallow((state) => ({
//       setCurrentTab: state.setCurrentTab,
//       etcAnswer: state.etcAnswer,
//       setEtcAnswer: state.setEtcAnswer,
//     }))
//   );

//   const { control, watch, handleSubmit, setValue, register } =
//     useFormContext<ResumeFormInput>();

//   const handleClickPrevious = () => {
//     setCurrentTab('skills');
//   };

//   const handleClickNext = () => {
//     localStorage.removeItem('bound-store');
//     router.push('/dashboard');
//   };

//   return (
//     <div className={styles.tabContent}>
//       <div className={styles.titleSection}>
//         <h1 className={styles.title}>자유로운 내용을 입력해주세요.</h1>
//         <p className={styles.subTitle}>
//           어필할 수 있는 내용이면 아무거나 좋아요.
//         </p>
//       </div>

//       <div className={styles.inputSection}>
//         <Textarea
//           id={'etc'}
//           label={'갖고 있는 이력서가 있다면 복사 붙여넣기를 추천해요.'}
//           field={register('etc')}
//           value={useWatch({ name: 'etc', control })}
//           maxLength={4000}
//           style={{ width: '454px', height: '540px' }}
//         />
//       </div>

//       <div className={styles.buttonSection}>
//         <Button
//           type="button"
//           variant={'tertiary'}
//           style={{ width: '96px' }}
//           onClick={handleClickPrevious}
//         >
//           이전
//         </Button>
//         <Button
//           type="button"
//           variant={'primary'}
//           style={{ width: '338px' }}
//           onClick={handleClickNext}
//         >
//           다음
//         </Button>
//       </div>
//     </div>
//   );
// }
