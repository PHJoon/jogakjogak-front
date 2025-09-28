import { useFormContext, useWatch } from 'react-hook-form';

import Textarea from '@/components/common/Textarea';
import { ResumeFormInput } from '@/types/resume';

import styles from './ContentTab.module.css';

export default function ContentTab() {
  const { control, register } = useFormContext<ResumeFormInput>();

  const contentWatch = useWatch({ name: 'content', control });

  return (
    <div className={styles.tabContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>자유로운 내용</h1>
        <p className={styles.subTitle}>가진 이력서 복사/붙여넣기를 추천해요.</p>
      </div>

      <div className={styles.inputSection}>
        <Textarea
          id={'content'}
          field={register('content')}
          value={contentWatch}
          maxLength={5000}
          style={{ width: '100%', height: '240px' }}
        />
      </div>
    </div>
  );
}
