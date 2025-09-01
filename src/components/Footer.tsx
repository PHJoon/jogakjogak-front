'use client';

import Image from 'next/image';
import Link from 'next/link';

import emailIcon from '@/assets/images/ico_email.svg';
import logo from '@/assets/images/logo.svg';
import { GACategory, GAEvent } from '@/constants/gaEvent';
import trackEvent from '@/utils/trackEventGA';

import styles from './Footer.module.css';

interface FooterProps {
  backgroundColor?: 'transparent' | 'white';
}

export default function Footer(
  { backgroundColor }: FooterProps = { backgroundColor: 'white' }
) {
  const handleExternalLink = (type: keyof typeof GAEvent.Footer) => {
    trackEvent({
      event: GAEvent.Footer[type],
      event_category: GACategory.FOOTER,
    });
  };

  return (
    <footer
      className={`${styles.footer} ${
        backgroundColor === 'white' ? styles.whiteBackground : ''
      }`}
    >
      <div className={styles.container}>
        {/* Logo section */}
        <div className={styles.logoSection}>
          <Image
            src={logo}
            alt="조각조각"
            width={148.27}
            height={29.13}
            className={styles.logo}
          />
        </div>

        {/* Main content section */}
        <div className={styles.mainContent}>
          {/* Links */}
          <nav className={styles.linkContainer}>
            <Link
              href="/?intro=true"
              className={styles.link}
              onClick={() => handleExternalLink('ABOUT_US')}
            >
              서비스 소개
            </Link>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/FAQ-23e02f1ef63480679aebe4b2172852f1?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('CONTACT_US')}
            >
              문의하기
            </a>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/23e02f1ef634800cb29ddda947b3ae52?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('TERMS_OF_SERVICE')}
            >
              이용약관
            </a>
            <span className={styles.separator}>|</span>
            <a
              href="https://zircon-eagle-db5.notion.site/22d02f1ef634808aa79ad41a0f2c3655"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              onClick={() => handleExternalLink('PRIVACY_POLICY')}
            >
              개인정보 처리방침
            </a>
          </nav>

          {/* Contact and copyright */}
          <div className={styles.contactSection}>
            <div className={styles.emailContainer}>
              <Image
                src={emailIcon}
                alt="이메일"
                width={13.33}
                height={10.67}
                className={styles.emailIcon}
              />
              <span className={styles.email}>jogakjogakhelp@gmail.com</span>
            </div>
            <p className={styles.copyright}>
              © 2025. JogakJogak. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
