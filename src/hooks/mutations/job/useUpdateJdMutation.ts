import { useMutation } from '@tanstack/react-query';

import { updateJd } from '@/lib/api/jds/jdApi';
import { queryClient } from '@/lib/queryClient';

export default function useUpdateJdMutation() {
  const { mutate: updateJdMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: (params: {
      jobId: number;
      title: string;
      companyName: string;
      job: string;
      link: string;
      endDate: string;
    }) => updateJd(params),
    onMutate: () => {},
    onError: () => {},
    onSuccess: (data) => {
      queryClient.setQueryData(['jd', data.jd_id], data);
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { updateJdMutate, isUpdatePending };
}
