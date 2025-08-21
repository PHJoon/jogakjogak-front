import { Dispatch, SetStateAction } from 'react';

import styles from './ResumeFormInput.module.css';

interface Props {
  resumeTitle: string;
  resumeContent: string;
  setResumeTitle: Dispatch<SetStateAction<string>>;
  setResumeContent: Dispatch<SetStateAction<string>>;
}

export default function ResumeFormInput({
  resumeTitle,
  resumeContent,
  setResumeTitle,
  setResumeContent,
}: Props) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeContent(e.target.value);
  };

  return (
    <>
      <div className={styles.resumeSection}>
        <div className={styles.resumeHeader}>
          <input
            type="text"
            className={styles.resumeTitleInput}
            value={resumeTitle}
            onChange={handleTitleChange}
            maxLength={30}
          />
          <span className={styles.counter}>{resumeTitle.length}/30</span>
        </div>
      </div>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          placeholder="갖고 있는 이력서 내용을 복사/붙여넣기 하면 한번에 정리해드릴게요."
          maxLength={5000}
          value={resumeContent}
          onChange={handleContentChange}
        />
        <div className={styles.charCounter}>
          <span>{resumeContent.length}/5000</span>
        </div>
      </div>
    </>
  );
}
