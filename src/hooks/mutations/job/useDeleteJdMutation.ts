import { useMutation } from '@tanstack/react-query';

import { useQueryParams } from '@/hooks/useQueryParams';
import { deleteJd } from '@/lib/api/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail, JdsData } from '@/types/jds';

export default function useDeleteJdMutation() {
  const { page, sort, showOnly } = useQueryParams();

  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
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
      queryClient.removeQueries({ queryKey: ['jd', jobId], exact: true });

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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
      queryClient.invalidateQueries({ queryKey: ['jd'] });
    },
  });

  return { deleteMutate, deletePending };
}
