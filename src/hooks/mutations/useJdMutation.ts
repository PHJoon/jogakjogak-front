import { useMutation } from '@tanstack/react-query';

import { updateJd } from '@/lib/api/jds/jdApi';
import { queryClient } from '@/lib/queryClient';

export default function useJdMutation(jobId: number | undefined) {
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
