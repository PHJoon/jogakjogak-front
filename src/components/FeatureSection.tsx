import Image, { StaticImageData } from 'next/image';

import styles from './FeatureSection.module.css';

interface FeatureSectionProps {
  image: StaticImageData;
  imageAlt: string;
  title: React.ReactNode;
  description: React.ReactNode;
  reversed?: boolean;
}

export default function FeatureSection({
  image,
  imageAlt,
  title,
  description,
  reversed = false,
}: FeatureSectionProps) {
  return (
    <section className={styles.featureSection}>
      <div
        className={`${styles.featureContent} ${reversed ? styles.reversed : ''}`}
      >
        <div className={styles.imagePlaceholder}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className={styles.featureText}>
          <h2 className={styles.featureTitle}>{title}</h2>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </section>
  );
}
