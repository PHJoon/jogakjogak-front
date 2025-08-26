import { useMutation } from '@tanstack/react-query';

import { createJd, updateJd } from '@/lib/api/jds/jdApi';
import { queryClient } from '@/lib/queryClient';

export function useCreateJdMutation() {
  const {
    mutate: createJdMutate,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
  } = useMutation({
    mutationFn: (params: {
      title: string;
      companyName: string;
      job: string;
      link: string;
      content: string;
      endDate: string;
    }) => createJd(params),
    onMutate: () => {},
    onError: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['jd', data.jd_id], data);
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return {
    createJdMutate,
    isCreatePending,
    isCreateSuccess,
  };
}

export function useUpdateJdMutation(jobId: number | undefined) {
  const { mutate: updateJdMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: (params: {
      title: string;
      companyName: string;
      job: string;
      link: string;
      endDate: string;
    }) => updateJd({ jobId: jobId as number, ...params }),
    onMutate: () => {},
    onError: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['jd', jobId], data);
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { updateJdMutate, isUpdatePending };
}
