import Image from 'next/image';
import { useRouter } from 'next/navigation';

import kebabMenuIcon from '@/assets/images/ic_kebab.svg';
import lockIcon from '@/assets/images/ic_lock.svg';
import todoCheckboxIcon from '@/assets/images/ic_todo_checkbox.svg';
import Button from '@/components/common/Button';
import { useSessionStore } from '@/stores/useSessionStore';

import styles from './NoResumeTodoItem.module.css';

interface Props {
  jdId?: number;
}

export default function NoResumeTodoItem({ jdId }: Props) {
  const setRedirect = useSessionStore((state) => state.setRedirect);

  const router = useRouter();

  const clickUnlockWithResume = () => {
    setRedirect(`/job/edit?id=${jdId}`);
    router.push('/resume/create');
  };

  return (
    <div className={`${styles.todoItem}`}>
      <div className={styles.todoItemHeader}>
        <button className={styles.todoCheckbox}>
          <Image
            src={todoCheckboxIcon}
            alt="Todo checkbox"
            width={24}
            height={24}
          />
        </button>
        <span className={`${styles.todoItemTitle}`}>
          이력서가 있어야 확인할 수 있어요.
        </span>
        <button className={styles.todoItemMenuButton}>
          <Image
            src={kebabMenuIcon}
            alt="Todo item more menu"
            width={24}
            height={24}
          />
        </button>
      </div>
      <p className={`${styles.todoItemContent}`}>
        이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수 있습니다.
        이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성 페이지로 이동합니다.
        이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수 있습니다.
        이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성 페이지로 이동합니다.
        이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수 있습니다.
        이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성 페이지로 이동합니다.
        이력서를 등록한 후, 지원한 기업의 채용 공고에서 확인할 수 있습니다.
        이력서로 잠금해제 버튼을 눌러주세요! 이력서 작성 페이지로 이동합니다.
      </p>

      <div className={styles.todoLocked}>
        <div className={styles.lockedTitle}>
          <Image src={lockIcon} alt="Lock icon" width={24} height={24} />
          이력서가 있어야 확인할 수 있어요.
        </div>
        <p className={styles.lockedDescription}>
          가장 부족한 부분을 이력서로 분석해드려요.
        </p>
        <Button
          style={{ width: '100%', height: '48px' }}
          onClick={clickUnlockWithResume}
        >
          이력서로 잠금해제
        </Button>
      </div>
    </div>
  );
}
