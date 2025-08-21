import { useMutation } from '@tanstack/react-query';

import { deleteJd, markJobAsApplied } from '@/lib/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';

export default function useJdsMutation() {
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: (jobId: number) => deleteJd(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  const { mutate: patchMutate, isPending: patchPending } = useMutation({
    mutationFn: (jobId: number) => markJobAsApplied(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return {
    deleteMutate,
    deletePending,
    patchMutate,
    patchPending,
  };
}
