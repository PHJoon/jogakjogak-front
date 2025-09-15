import Image from 'next/image';

import stepOneIcon from '@/assets/images/ic_step_one.svg';
import stepOneActiveIcon from '@/assets/images/ic_step_one_active.svg';
import stepThreeIcon from '@/assets/images/ic_step_three.svg';
import stepThreeActiveIcon from '@/assets/images/ic_step_three_active.svg';
import stepTwoIcon from '@/assets/images/ic_step_two.svg';
import stepTwoActiveIcon from '@/assets/images/ic_step_two_active.svg';
import { OnboardingSteps } from '@/constants/onboardingStep';
import { useBoundStore } from '@/stores/useBoundStore';

import styles from './ProgressIndicator.module.css';

const stepIcons = {
  1: {
    default: stepOneIcon,
    active: stepOneActiveIcon,
  },
  2: {
    default: stepTwoIcon,
    active: stepTwoActiveIcon,
  },
  3: {
    default: stepThreeIcon,
    active: stepThreeActiveIcon,
  },
};

export default function ProgressIndicator() {
  const currentStep = useBoundStore((state) => state.currentStep);

  return (
    <div aria-label="온보딩 진행 단계" className={styles.progressIndicator}>
      <ol className={styles.progressList}>
        {Object.entries(stepIcons).map(([step, icons], index) => (
          <li
            key={step}
            className={`${styles.progressItem} ${
              OnboardingSteps[currentStep].stepNumber === index + 1
                ? styles.currentStep
                : ''
            }`}
            aria-current={
              OnboardingSteps[currentStep].stepNumber === index + 1
                ? 'step'
                : undefined
            }
            aria-label={OnboardingSteps[currentStep].label}
          >
            <Image
              src={
                OnboardingSteps[currentStep].stepNumber === index + 1
                  ? icons.active
                  : icons.default
              }
              alt={`Step ${index + 1} icon`}
              width={24}
              height={24}
            />
          </li>
        ))}
      </ol>
      <p className={styles.currentStepLabel} aria-live="polite">
        {OnboardingSteps[currentStep].label}
      </p>
    </div>
  );
}
