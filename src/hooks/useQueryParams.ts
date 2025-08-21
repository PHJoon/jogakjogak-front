import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

import { ShowOnly, Sort } from '@/types/jds';

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const page = Number(searchParams.get('page')) || 0;
  const sort = (searchParams.get('sort') as Sort) || '';
  const showOnly = (searchParams.get('showOnly') as ShowOnly) || '';

  const setParam = useCallback(
    (
      key: string,
      value?: string | number | null,
      opts?: { push?: boolean; scroll?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams);

      if (value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }

      const href = `${pathname}?${params.size ? params.toString() : ''}`;
      startTransition(() => {
        const nav = opts?.push ? router.push : router.replace;
        nav(href, { scroll: opts?.scroll ?? false });
      });
    },
    [pathname, searchParams, router]
  );

  const setPage = useCallback(
    (nextPage: number, opts?: { push?: boolean; scroll?: boolean }) => {
      setParam('page', nextPage, opts);
    },
    [setParam]
  );

  const setSort = useCallback(
    (
      newSort: Sort,
      opts?: { resetPage: boolean; push?: boolean; scroll?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams);
      params.set('sort', newSort);
      if (opts?.resetPage) params.set('page', '0');
      if (params.has('showOnly')) params.delete('showOnly');

      const href = `${pathname}?${params.size ? params.toString() : ''}`;
      startTransition(() => {
        const nav = opts?.push ? router.push : router.replace;
        nav(href, { scroll: opts?.scroll ?? false });
      });
    },
    [pathname, searchParams, router]
  );

  const setShowOnly = useCallback(
    (
      newShowOnly: ShowOnly,
      opts?: { resetPage: boolean; push?: boolean; scroll?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams);
      params.set('showOnly', newShowOnly);
      if (opts?.resetPage) params.set('page', '0');
      if (params.has('sort')) params.delete('sort');

      const href = `${pathname}?${params.size ? params.toString() : ''}`;
      startTransition(() => {
        const nav = opts?.push ? router.push : router.replace;
        nav(href, { scroll: opts?.scroll ?? false });
      });
    },
    [pathname, searchParams, router]
  );

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(Math.max(0, page - 1));

  return {
    page,
    sort,
    showOnly,
    setPage,
    setSort,
    setShowOnly,
    nextPage,
    prevPage,
    isPending,
  };
}
