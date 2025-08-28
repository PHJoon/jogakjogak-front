import { useQuery } from '@tanstack/react-query';

import { getJd } from '@/lib/api/jds/jdApi';

interface Props {
  jobId: number | null;
  isJdDeleting?: boolean;
}

export default function useJdQuery({ jobId, isJdDeleting = false }: Props) {
  const isEnabled = jobId !== null && !isJdDeleting;

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getJd(jobId as number),
    queryKey: ['jd', jobId],
    enabled: isEnabled,
  });

  return { data, isLoading, isError, error };
}
