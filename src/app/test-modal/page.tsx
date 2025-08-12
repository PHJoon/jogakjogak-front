'use client';

import { JogakCategory } from '@/components/JogakCategory';

import styles from './page.module.css';

export default function TestModalPage() {
  return (
    <div className={styles.container}>
      <h1>Modal Test Page</h1>

      <JogakCategory
        state="active"
        title="필요한 경험과 역량"
        initialItems={[
          { id: '1', text: '경력 기간 명확화', completed: false },
          { id: '2', text: '리더 경험 만들기', completed: true },
          { id: '3', text: '최대 10개 표시입니다.', completed: false },
          { id: '4', text: 'TO DO LIST EXAMPLE', completed: true },
        ]}
        onItemToggle={(itemId) => console.log(`Toggled item: ${itemId}`)}
      />
    </div>
  );
}
