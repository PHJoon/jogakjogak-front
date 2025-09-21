import styles from './JobActionMenu.module.css';

interface Props {
  applyStatus: boolean;
  onSelect: (action: 'edit' | 'apply' | 'delete') => void;
}

export default function JobActionMenu({ applyStatus, onSelect }: Props) {
  return (
    <div className={styles.moreMenu}>
      <button
        className={`${styles.moreMenuItem} ${styles.edit}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('edit');
        }}
      >
        공고 수정
      </button>
      <button
        className={`${styles.moreMenuItem} ${styles.apply}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('apply');
        }}
      >
        {applyStatus ? '지원 완료 취소' : '지원 완료'}
      </button>
      <button
        className={`${styles.moreMenuItem} ${styles.delete}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect('delete');
        }}
      >
        삭제하기
      </button>
    </div>
  );
}
