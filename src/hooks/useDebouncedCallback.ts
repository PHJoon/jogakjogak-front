import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => void;
type Options = {
  leading?: boolean;
  trailing?: boolean;
};

export default function useDebouncedCallback<F extends AnyFn>(
  fn: F,
  delay: number,
  { leading = false, trailing = true }: Options = {}
) {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<F> | null>(null);
  const leadingCalledRef = useRef(false);

  // 최신 함수로 업데이트
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // 타이머 및 상태 초기화
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    leadingCalledRef.current = false;
    lastArgsRef.current = null;
  }, []);

  // trailing 호출을 즉시 실행
  const flush = useCallback(() => {
    if (!trailing || !lastArgsRef.current) return;
    const args = lastArgsRef.current;
    cancel();
    fnRef.current(...args);
  }, [cancel, trailing]);

  const debounced = useCallback(
    (...args: Parameters<F>) => {
      lastArgsRef.current = args;

      // leading: true인 경우, 첫 호출 시 바로 실행
      if (leading && !timerRef.current && !leadingCalledRef.current) {
        leadingCalledRef.current = true;
        fnRef.current(...args);
      }

      // 타이머 리셋
      if (timerRef.current) clearTimeout(timerRef.current);

      if (trailing) {
        timerRef.current = setTimeout(() => {
          leadingCalledRef.current = false;
          if (trailing) {
            const a = lastArgsRef.current;
            lastArgsRef.current = null;
            if (a) fnRef.current(...a);
          }
          timerRef.current = null;
        }, delay);
      } else {
        // trailing이 false면 단순히 leading만 동작, 타이머는 leadingCalled 초기화용
        timerRef.current = setTimeout(() => {
          leadingCalledRef.current = false;
          timerRef.current = null;
        }, delay);
      }
    },
    [delay, leading, trailing]
  );

  // 언마운트 시 타이머 정리
  useEffect(() => cancel, [cancel]);

  return { debounced, cancel, flush };
}
