import { useMutation } from '@tanstack/react-query';

import { useQueryParams } from '@/hooks/useQueryParams';
import { deleteJd } from '@/lib/api/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail, JdsData } from '@/types/jds';

export default function useDeleteJdMutation() {
  const { page, sort, showOnly } = useQueryParams();

  const { mutate: deleteJdMutate, isPending: isDeleteJdPending } = useMutation({
    mutationFn: (jobId: number) => deleteJd(jobId),
    onMutate: (jobId) => {
      // Optimistically update the cache
      const previousJds: JdsData | undefined = queryClient.getQueryData([
        'jds-list',
        `page=${page}`,
        `sort=${sort}`,
        `showOnly=${showOnly}`,
      ]);

      if (previousJds) {
        queryClient.setQueryData(
          ['jds-list', `page=${page}`, `sort=${sort}`, `showOnly=${showOnly}`],
          {
            resume: previousJds.resume,
            pageInfo: previousJds.pageInfo,
            jds: [...previousJds.jds].filter((jd) => jd.jd_id !== jobId),
          }
        );
      }

      const previousJdDetail: JDDetail | undefined = queryClient.getQueryData([
        'jd',
        jobId,
      ]);

      return { previousJds, previousJdDetail };
    },
    onError: (error, variables, context) => {
      if (context?.previousJds) {
        queryClient.setQueryData(
          ['jds-list', `page=${page}`, `sort=${sort}`, `showOnly=${showOnly}`],
          context.previousJds
        );
      }

      if (context?.previousJdDetail) {
        queryClient.setQueryData(
          ['jd', context.previousJdDetail.jd_id],
          context.previousJdDetail
        );
      }
    },

    onSuccess: (data, jobId, context) => {
      queryClient.removeQueries({ queryKey: ['jd', jobId], exact: true });
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { deleteJdMutate, isDeleteJdPending };
}
