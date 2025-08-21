import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { getJdsData } from '@/lib/jds/jdsApi';
import { useBoundStore } from '@/stores/useBoundStore';
import { ShowOnly, Sort } from '@/types/jds';

export default function useJdsQuery() {
  const setJdCount = useBoundStore((state) => state.setJdCount);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const sort = (searchParams.get('sort') as Sort) || '';
  const showOnly = (searchParams.get('showOnly') as ShowOnly) || '';

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getJdsData(page, sort, showOnly),
    queryKey: ['jds-list', page, sort, showOnly],
  });

  useEffect(() => {
    if (data?.jds) {
      setJdCount(data.jds.length);
    }
  }, [data, setJdCount]);

  return { data, isLoading, isError, error };
}
