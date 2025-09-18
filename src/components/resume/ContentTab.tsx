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
        <h1 className={styles.title}>자유로운 내용을 입력해주세요.</h1>
        <p className={styles.subTitle}>
          어필할 수 있는 내용이면 아무거나 좋아요.
        </p>
      </div>

      <div className={styles.inputSection}>
        <Textarea
          id={'content'}
          label={'갖고 있는 이력서가 있다면 복사 붙여넣기를 추천해요.'}
          field={register('content')}
          value={contentWatch}
          maxLength={5000}
          style={{ width: '100%', height: '240px' }}
        />
      </div>
    </div>
  );
}
