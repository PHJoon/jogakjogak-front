'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import closeIcon from '@/assets/images/ic_close.svg';
import navigateIcon from '@/assets/images/ic_navigate_next.svg';

import styles from './SurveyBanner.module.css';

const BANNER_STORAGE_KEY = 'banner_hidden_at';

export default function SurveyBanner() {
  const [bannerVisible, setBannerVisible] = useState(true);

  const isBannerHidden = () => {
    const saved = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!saved) return false;

    const savedTime = new Date(saved).getTime();
    const now = new Date().getTime();
    return now - savedTime < 1000 * 60 * 60 * 6; // 6시간 이내
  };

  const hideBanner = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, new Date().toISOString());
  };

  useEffect(() => {
    if (isBannerHidden()) {
      setBannerVisible(false);
    }
  }, []);

  const handleSurveyClick = () => {
    window.open(
      'https://docs.google.com/forms/d/1O5kEyMU23rSIMNCrzYxc_8cqZ39wUe4n_QSbBv7xwaI/edit',
      '__blank'
    );
    handleCloseClick();
  };

  const handleCloseClick = () => {
    hideBanner();
    setBannerVisible(false);
  };

  if (!bannerVisible) return null;

  return (
    <div className={styles.surveyBanner}>
      <button className={styles.surveyButton} onClick={handleSurveyClick}>
        <span className={styles.surveyText}>
          <span>☕️</span>&nbsp;&nbsp;설문조사 참여하고&nbsp;
          <span>커피 쿠폰</span>
          &nbsp;받기
        </span>
        <Image src={navigateIcon} alt="설문조사" width={20} height={20} />
      </button>
      <button className={styles.closeButton} onClick={handleCloseClick}>
        <Image
          className={styles.closeIcon}
          src={closeIcon}
          alt="설문조사 닫기"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
}
