import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import arrowBackIcon from '@/assets/images/ic_back.svg';
import bookmarkIcon from '@/assets/images/ic_bookmark.svg';
import bookmarkCheckIcon from '@/assets/images/ic_bookmark_check.svg';
import moreIcon from '@/assets/images/ic_meatballs_menu.svg';
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  return (
    <div className={styles.JobDetailTopBar}>
      <div className={styles.leftSection}>
        <button className={styles.backButton} onClick={handleBack}>
          <Image src={arrowBackIcon} alt="뒤로가기" width={28} height={28} />
        </button>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.urlButton} onClick={handleClickJobUrl}>
          <span className={styles.urlButtonText}>채용공고 보기</span>
        </button>

        <div className={styles.iconGroup}>
          <button className={styles.iconButton} onClick={toggleBookmark}>
            <Image
              src={jdDetail.bookmark ? bookmarkCheckIcon : bookmarkIcon}
              alt={jdDetail.bookmark ? '북마크 체크됨' : '북마크'}
              width={32}
              height={32}
            />
          </button>
          <button
            className={styles.iconButton}
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu((prev) => !prev);
            }}
          >
            <Image src={moreIcon} alt="더보기" width={32} height={32} />
          </button>

          {/* More menu dropdown */}
          {showMoreMenu && (
            <div className={styles.moreMenuWrapper} ref={menuRef}>
              <JobActionMenu
                applyStatus={!!jdDetail.applyAt}
                onSelect={onSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
