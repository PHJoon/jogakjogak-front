import { useQuery } from '@tanstack/react-query';

import { getResume } from '@/lib/api/resume/resumeApi';

export default function useResumeQuery() {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getResume(),
    queryKey: ['resume'],
  });

  return { data, isLoading, isError, error };
}
