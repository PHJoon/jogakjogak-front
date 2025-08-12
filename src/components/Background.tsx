import Image from 'next/image';

import bottom from '@/assets/images/background/bg-bottom.png';
import middle from '@/assets/images/background/bg-middle.png';
import topLeft from '@/assets/images/background/bg-top-left.png';
import topRight from '@/assets/images/background/bg-top-right.png';

import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.backgroundTop}>
        <div className={styles.backgroundTopLeft}>
          <Image src={topLeft} fill alt="background top left" />
        </div>
        <div className={styles.backgroundTopRight}>
          <Image src={topRight} fill alt="background top right" />
        </div>
      </div>
      <div className={styles.backgroundMiddle}>
        <Image src={middle} fill alt="background middle" />
      </div>
      <div className={styles.backgroundBottom}>
        <Image src={bottom} fill alt="background bottom" />
      </div>
    </div>
  );
}
