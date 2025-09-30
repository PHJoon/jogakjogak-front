import Image from 'next/image';
import { useEffect, useState } from 'react';

import checkCompleteIcon from '@/assets/images/check-complete.svg';

import styles from './LoadingModal.module.css';

const LOADING_TIPS = [
  '이력서는 자신을 소개하는 첫인상이에요.\n형식보다 더 중요한 건\n강점이 잘 드러나느냐예요.',
  '10초 안에 핵심이 보여야 해요.\n채용 담당자는\n이력서를 오래 보지 않아요.',
  '이력서를 공고에 맞게 다듬어보세요.\n작은 표현 하나만 바꿔도\n눈에 띄는 지원자가 될 수 있어요.',
  '모든 경험엔 의미가 있어요.\n숫자와 결과를 함께 적으면\n임팩트가 훨씬 커져요.',
  "경험보다 중요한 건 '자신의 역할'이에요.\n단순히 참여한 것보다\n무엇을 주도했는지가 더 중요해요.",
  '이력서는 글이 아니라 구조예요.\n눈에 잘 띄게,\n정보를 설계하듯 정리해 보세요.',
  '키워드를 한 번 더 점검해 보세요.\n공고에 나오는 표현을\n이력서에 자연스럽게 담는 게 좋아요.',
  '모든 경험을 다 쓸 필요는 없어요.\n직무와 관련 있는 내용만\n선택해서 보여주는 게 전략이에요.',
  '무엇을 했는지 보다, 왜 했는지가 중요해요.\n이유와 맥락이 있으면\n내용이 훨씬 더 살아나요.',
  '성과가 없었다면 과정에 집중하세요.\n문제를 어떻게 풀었는지가\n강점으로 이어질 수 있어요.',
  '준비가 부족하다고 느껴지나요?\n그건 진심으로\n고민하고 있다는 증거예요.',
  '남들보다 느려 보여도 괜찮아요.\n자신만의 속도로\n충분히 도착할 수 있어요.',
  '불안은 당연해요.\n처음 해보는 일에\n누구나 긴장하니까요.',
  '하나씩만 정리해 보세요.\n계획은 거창할 필요 없어요.\n당장 시작할 수 있는 것부터요.',
  '어제보다 오늘, 오늘보다 내일.\n작은 반복이\n당신을 취업에 가까워지게 해요.',
  '막막한 날도 괜찮아요.\n계획이 없어도\n다시 시작할 수 있으니까요.',
  '할 일을 다 못해도 괜찮아요.\n조금씩 나아가고 있다면\n이미 잘하고 있는 거예요.',
  '취업은 경쟁이 아니라 매칭이에요.\n남과 비교하지 말고\n나에게 맞는 자리를 찾아보세요.',
  '완벽한 답변보다 중요한 건\n내 생각을\n차분히 설명하는 거예요.',
  '하루 하나씩만 해도 괜찮아요.\n작은 완료가 쌓이면\n진짜 변화가 시작돼요.',
  '막막하게 느껴질 땐,\n준비를 조각조각 나눠보세요.\n작은 시작도 충분해요.',
  '작은 조각이라도\n꾸준히 쌓이면\n변화를 만들어줄 거예요.',
  '정리가 안 될 땐,\n하나만 골라\n먼저 끝내보는 것도 좋아요.',
  '해야 할 일이 많아 보일 땐,\n우선순위부터\n차근히 정리해 보세요.',
  '할 일이 많을수록\n지금 할 수 있는 한 조각만\n먼저 선택해 보세요.',
  '완벽하게 해야 한다는 생각은\n오히려 나를\n멈추게 만들 수 있어요.',
  '긴 문장보다 쉬운 표현이 좋아요.\n읽기 쉬운 글이\n기억에도 더 오래 남아요.',
  '경험이 연결되지 않아도 괜찮아요.\n그 안에서 공통된 태도나 배움을\n꺼내보는 게 중요해요.',
  '어떤 일을 했는지 말할 때는\n그 일이 왜 중요했는지까지\n함께 전해보세요.',
  '부족한 점이 보여도 괜찮아요.\n그걸 채우려는 태도 자체가\n이미 좋은 인상이 돼요.',
];

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isComplete?: boolean;
  onCompleteAnimationEnd?: () => void;
}

export default function LoadingModal({
  isOpen,
  onClose,
  isComplete = false,
  onCompleteAnimationEnd,
}: LoadingModalProps) {
  const [showComplete, setShowComplete] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_TIPS.length)
  );

  useEffect(() => {
    if (isComplete) {
      setShowComplete(true);
      // 완료 애니메이션 후 콜백 실행
      const timer = setTimeout(() => {
        onCompleteAnimationEnd?.();
        onClose();
      }, 500); // 0.5초 후 이동

      return () => clearTimeout(timer);
    }
  }, [isComplete, onCompleteAnimationEnd, onClose]);

  // 2초마다 팁 변경
  useEffect(() => {
    if (!isOpen || isComplete) return;

    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => {
        let newIndex = Math.floor(Math.random() * LOADING_TIPS.length);
        // 같은 팁이 연속으로 나오지 않도록
        while (newIndex === prevIndex) {
          newIndex = Math.floor(Math.random() * LOADING_TIPS.length);
        }
        return newIndex;
      });
    }, 2000); // 2초

    return () => clearInterval(interval);
  }, [isOpen, isComplete]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.loadingIndicator}>
          {showComplete ? (
            <Image
              src={checkCompleteIcon}
              alt="완료"
              width={35}
              height={26}
              className={styles.checkIcon}
            />
          ) : (
            <div className={styles.dots}>
              <div className={`${styles.dot} ${styles.dot1}`}></div>
              <div className={`${styles.dot} ${styles.dot2}`}></div>
              <div className={`${styles.dot} ${styles.dot3}`}></div>
            </div>
          )}
        </div>

        <p className={styles.waitMessage}>
          잠시만 기다려주세요...
          <br />
          최대 30초까지 걸릴 수 있어요
        </p>

        <p className={styles.aiMessage}>
          <span className={styles.text}>AI가 꼼꼼히 </span>
          <span className={styles.highlight}>분석 중</span>
          <span className={styles.text}>이에요</span>
        </p>

        <div className={styles.tipCard}>
          <div className={styles.tipLabel}>TIP</div>
          <p className={styles.tipContent}>{LOADING_TIPS[currentTipIndex]}</p>
        </div>
      </div>
    </div>
  );
}
