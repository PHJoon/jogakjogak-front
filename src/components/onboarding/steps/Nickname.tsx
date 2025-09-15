import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import styles from './Nickname.module.css';

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

export default function Nickname({ onNext, onPrevious }: Props) {
  return (
    <div className={styles.mainContent}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>닉네임을 입력해주세요.</h1>
        <p className={styles.subTitle}>이메일 알림에 활용해요.</p>
      </div>

      <div className={styles.inputSection}>
        <Input
          id={'nickname'}
          label={'닉네임'}
          onChange={() => {}}
          value={''}
        />
      </div>

      <div className={styles.buttonSection}>
        <Button
          type="button"
          variant={'tertiary'}
          style={{ width: '96px' }}
          onClick={onPrevious}
        >
          이전
        </Button>
        <Button
          type="button"
          variant={'primary'}
          style={{ width: '338px' }}
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
