import { useMutation } from '@tanstack/react-query';

import { deleteJd, markJobAsApplied } from '@/lib/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';

export default function useJdsMutation() {
  const { mutate: deleteMutation, isPending: deletePending } = useMutation({
    mutationFn: (jobId: number) => deleteJd(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const { mutate: patchMutation, isPending: patchPending } = useMutation({
    mutationFn: (jobId: number) => markJobAsApplied(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  return {
    deleteMutation,
    deletePending,
    patchMutation,
    patchPending,
  };
}
