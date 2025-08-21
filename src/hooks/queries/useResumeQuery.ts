import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getResume } from '@/lib/resume/resumeApi';
import { useBoundStore } from '@/stores/useBoundStore';

export default function useResumeQuery(resumeId: number | null) {
  const setResume = useBoundStore((state) => state.setResume);
  const isEnabled = typeof resumeId === 'number';
  const hasResume = useBoundStore((state) => state.resume) !== null;

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getResume(resumeId as number),
    queryKey: ['resume', resumeId],
    enabled: isEnabled && !hasResume,
  });

  useEffect(() => {
    if (data) {
      setResume(data);
    }
  }, [data, setResume]);

  return { data, isLoading, isError, error };
}
