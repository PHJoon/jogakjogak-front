import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_arrow_back.svg';
import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import bookmarkCheckIcon from '@/assets/images/ic_bookmark_check.svg';
import moreIcon from '@/assets/images/ic_more.svg';
import { JDDetail } from '@/types/jds';

import JobActionMenu from '../JobActionMenu';

import styles from './JobDetailTopBar.module.css';

interface Props {
  jdDetail: JDDetail;
  handleClickJobUrl: () => void;
  toggleBookmark: () => void;
  onSelect: (action: 'edit' | 'apply' | 'delete') => void;
}

export default function JobDetailTopBar({
  jdDetail,
  handleClickJobUrl,
  toggleBookmark,
  onSelect,
}: Props) {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.JobDetailTopBar}>
      <div className={styles.leftSection}>
        <button className={styles.backButton} onClick={handleBack}>
          <Image
            src={arrowBackIcon}
            alt="뒤로가기"
            width={18.17}
            height={17.69}
          />
        </button>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.urlButton} onClick={handleClickJobUrl}>
          <span className={styles.urlButtonText}>채용공고 보기</span>
        </button>

        <button className={styles.iconButton} onClick={toggleBookmark}>
          {jdDetail.bookmark ? (
            <Image
              src={bookmarkCheckIcon}
              alt="북마크 체크됨"
              width={24}
              height={24}
            />
          ) : (
            <Image src={bookmarkIcon} alt="북마크" width={24} height={24} />
          )}
        </button>

        <>
          <button
            className={styles.iconButton}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
          >
            <Image src={moreIcon} alt="더보기" width={21.33} height={5.33} />
          </button>

          {/* More menu dropdown */}
          {showMoreMenu && (
            <JobActionMenu
              applyStatus={!!jdDetail.applyAt}
              onClose={() => setShowMoreMenu(false)}
              onSelect={onSelect}
            />
          )}
        </>
      </div>
    </div>
  );
}
