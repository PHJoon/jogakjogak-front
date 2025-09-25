import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { getJdsData } from '@/lib/api/jds/jdsApi';
import { ShowOnly, Sort } from '@/types/jds';

export default function useJdsQuery() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const sort = (searchParams.get('sort') as Sort) || '';
  const showOnly = (searchParams.get('showOnly') as ShowOnly) || '';

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryFn: () => getJdsData(page, sort, showOnly),
    queryKey: [
      'jds-list',
      `page=${page}`,
      `sort=${sort}`,
      `showOnly=${showOnly}`,
    ],
  });

  return { data, isLoading, isError, error, refetch };
}
