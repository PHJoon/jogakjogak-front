import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import arrow from '@/assets/images/ic_navigate_next.svg';

import styles from './ReadMore.module.css';

export default function ReadMore({
  content,
  lines = 3,
  expanded: controlledExpanded,
  onToggle,
  style,
}: {
  content: string;
  lines?: number;
  expanded?: boolean; // 외부 제어도 가능
  onToggle?: (next: boolean) => void;
  style?: React.CSSProperties;
}) {
  const [expanded, setExpanded] = useState(false);
  const [clampable, setClampable] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const isExpanded = controlledExpanded ?? expanded;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const computeLineHeightPx = () => {
      const cs = getComputedStyle(el);
      const lh = cs.lineHeight;
      if (lh.endsWith('px')) return parseFloat(lh);

      // unitless(예: "1.5") 또는 "normal" 대응
      const fontSizePx = parseFloat(cs.fontSize); // px
      const ratio = lh === 'normal' ? 1.2 : parseFloat(lh) || 1.2; // 관례상 normal≈1.2
      return fontSizePx * ratio;
    };

    const check = () => {
      const lhPx = computeLineHeightPx();
      const maxH = Math.round(lhPx * lines);

      // 내부 패딩이 있다면 고려(필요 시):
      const cs = getComputedStyle(el);
      const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) || 0;

      el.style.maxHeight = isExpanded ? 'none' : `${maxH + pad}px`;
      el.style.overflow = isExpanded ? 'visible' : 'hidden';

      // 페이드 표시 여부
      setClampable(el.scrollHeight > maxH + 1); // +1은 소수점 여유
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);

    check();
    return () => ro.disconnect();
  }, [lines, isExpanded]);

  const toggle = () => {
    const next = !isExpanded;
    if (onToggle) {
      onToggle(next);
      return;
    }
    setExpanded(next);
  };

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.content} ${!isExpanded && clampable ? styles.fade : ''}`}
        aria-expanded={isExpanded}
        ref={contentRef}
        style={style}
      >
        {content}
      </div>

      {clampable && (
        <button
          type="button"
          className={styles.btn}
          onClick={toggle}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? '접기' : '펼치기'}</span>
          <Image
            src={arrow}
            alt="Toggle expand"
            width={20}
            height={20}
            className={`${styles.arrowIcon} ${isExpanded ? styles.up : ''}`}
          />
        </button>
      )}
    </div>
  );
}
