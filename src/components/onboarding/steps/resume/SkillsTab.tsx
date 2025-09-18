// import Image from 'next/image';
// import { ChangeEvent, useEffect, useRef, useState } from 'react';
// import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
// import { useShallow } from 'zustand/shallow';

// import closeIcon from '@/assets/images/ic_close.svg';
// import plusIcon from '@/assets/images/ic_plus_no_background.svg';
// import Button from '@/components/common/Button';
// import Input from '@/components/common/Input';
// import useDebouncedCallback from '@/hooks/useDebouncedCallback';
// import useResumeForm, { ResumeFormInput } from '@/hooks/resume/useResumeForm';
// import { useBoundStore } from '@/stores/useBoundStore';

// import styles from './SkillsTab.module.css';

// export default function SkillsTab() {
//   const { setCurrentTab, skillsAnswer, setSkillsAnswer } = useBoundStore(
//     useShallow((state) => ({
//       setCurrentTab: state.setCurrentTab,
//       skillsAnswer: state.skillsAnswer,
//       setSkillsAnswer: state.setSkillsAnswer,
//     }))
//   );

//   const { control, setValue } = useFormContext<ResumeFormInput>();

//   const skillsWatch = useWatch({ name: 'skills', control });

//   const {
//     fields: skillsFields,
//     append: appendSkills,
//     remove: removeSkills,
//   } = useFieldArray({
//     control,
//     name: 'skills',
//   });

//   const { debounced } = useDebouncedCallback(() => {
//     // api 요청
//     // 결과값으로 setSearchResults([...]);
//   }, 500);

//   const [search, setSearch] = useState('');
//   const [searchResults, setSearchResults] = useState<string[]>([]);
//   const ranRef = useRef(false);

//   const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearch(value);

//     // api 요청
//     // debounced();
//   };

//   const handleClickPrevious = () => {
//     setCurrentTab('education');
//   };
//   const handleClickNext = () => {
//     setSkillsAnswer([...skillsWatch]);
//     setCurrentTab('etc');
//   };

//   // 첫 렌더링 시 저장된 상태로 초기화
//   useEffect(() => {
//     if (skillsAnswer.length > 0) {
//       if (ranRef.current) return;
//       ranRef.current = true;
//       setValue('skills', [...skillsAnswer]);
//     }
//   }, [setValue, skillsAnswer]);

//   return (
//     <div className={styles.tabContent}>
//       <div className={styles.titleSection}>
//         <h1 className={styles.title}>
//           직무 관련 <span>스킬</span>을 추가해주세요.
//         </h1>
//         <p className={styles.subTitle}>
//           업무와 관련된 전문 지식, 기술 등이 좋아요.
//         </p>
//       </div>

//       <div className={styles.inputSection}>
//         <div className={styles.addedSkills}>
//           {skillsFields.map((skill, index) => (
//             <Button
//               key={skill.id}
//               variant={'neutral'}
//               style={{
//                 width: 'fit-content',
//                 height: '40px',
//                 padding: '12px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 cursor: 'default',
//               }}
//             >
//               {skill.name}
//               <div
//                 role="button"
//                 className={styles.removeSkillButton}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   removeSkills(index);
//                 }}
//               >
//                 <Image
//                   src={closeIcon}
//                   alt="Remove skill"
//                   width={20}
//                   height={20}
//                 />
//               </div>
//             </Button>
//           ))}
//         </div>

//         <div className={styles.searchSection}>
//           <Input
//             id={'searchSkill'}
//             label={'검색으로 추가하기 (ex. React, Adobe 등)'}
//             style={{
//               height: '72px',
//               width: '454px',
//               borderRadius: search ? '12px 12px 0 0' : '12px',
//             }}
//             onChange={(e) => handleSearch(e)}
//             value={search}
//             maxLength={30}
//           />

//           {search && searchResults.length === 0 && (
//             <div className={styles.searchResults}>
//               <p className={styles.infoText}>
//                 검색결과
//                 <span>적합한 키워드가 없어요.</span>
//               </p>
//               <button
//                 type={'button'}
//                 className={styles.resultItem}
//                 onClick={() => {
//                   if (
//                     !Object.values(skillsFields)
//                       .map((skill) => skill.name)
//                       .includes(search)
//                   ) {
//                     appendSkills({ id: crypto.randomUUID(), name: search });
//                   }
//                 }}
//               >
//                 <span>&apos;{search}&apos;(으)로 직접 추가</span>
//                 <Image src={plusIcon} alt="Add skill" width={20} height={20} />
//               </button>
//             </div>
//           )}

//           {search && searchResults.length > 0 && (
//             <div className={styles.searchResults}>
//               <p className={styles.infoText}>검색결과</p>
//               <div className={styles.resultsList}>
//                 {searchResults.map((result) => (
//                   <button
//                     key={result}
//                     type={'button'}
//                     className={styles.resultItem}
//                     onClick={() => {
//                       if (
//                         !Object.values(skillsFields)
//                           .map((skill) => skill.name)
//                           .includes(search)
//                       ) {
//                         appendSkills({ id: crypto.randomUUID(), name: result });
//                       }
//                     }}
//                   >
//                     <span>{result}</span>
//                     <Image
//                       src={plusIcon}
//                       alt="Add skill"
//                       width={20}
//                       height={20}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
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
