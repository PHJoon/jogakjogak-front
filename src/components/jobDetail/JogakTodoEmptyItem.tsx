import Button from '@/components/common/Button';

import styles from './JogakTodoEmptyItem.module.css';

interface Props {
  title: string;
  buttonLabel: string;
  onClick: () => void;
}

export default function JogakTodoEmptyItem({
  title,
  buttonLabel,
  onClick,
}: Props) {
  return (
    <div className={styles.todoItem}>
      <p className={styles.title}>{title}</p>
      <Button
        onClick={onClick}
        variant={'secondary'}
        style={{ padding: '12px 37px', width: '100%', height: '48px' }}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
