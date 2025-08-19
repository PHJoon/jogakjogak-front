import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { getJdsData } from '@/lib/jds/jdsApi';
import { useBoundStore } from '@/stores/useBoundStore';

export default function useJdsQuery() {
  const setJdCount = useBoundStore((state) => state.setJdCount);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 0;
  const sort = searchParams.get('sort') || 'createdAt,desc';

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getJdsData(page, sort),
    queryKey: ['jds-list', page, sort],
  });

  useEffect(() => {
    if (data?.jds) {
      setJdCount(data.jds.length);
    }
  }, [data, setJdCount]);

  return { data, isLoading, isError, error };
}
