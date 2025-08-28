import { useMutation } from '@tanstack/react-query';

import { createJd } from '@/lib/api/jds/jdApi';
import { queryClient } from '@/lib/queryClient';

export default function useCreateJdMutation() {
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
