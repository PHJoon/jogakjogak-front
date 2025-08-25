import { useQuery } from '@tanstack/react-query';

import { getJd } from '@/lib/api/jds/jdApi';

export default function useJdQuery(jobId: number | null) {
  const isEnabled = jobId !== null;

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getJd(jobId as number),
    queryKey: ['jd', jobId],
    enabled: isEnabled,
  });

  return { data, isLoading, isError, error };
}
