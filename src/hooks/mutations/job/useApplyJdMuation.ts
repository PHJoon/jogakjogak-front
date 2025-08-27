import { useMutation } from '@tanstack/react-query';

import { useQueryParams } from '@/hooks/useQueryParams';
import { markJobAsApplied } from '@/lib/api/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail, JdsData } from '@/types/jds';

export default function useApplyJdMutation() {
  const { page, sort, showOnly } = useQueryParams();

  const { mutate: applyMutate, isPending: applyPending } = useMutation({
    mutationFn: (jobId: number) => markJobAsApplied(jobId),
    onMutate: async (jobId) => {
      const listKey = [
        'jds-list',
        `page=${page}`,
        `sort=${sort}`,
        `showOnly=${showOnly}`,
      ] as const;
      const detailKey = ['jd', jobId] as const;

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: listKey });
      // Optimistically update the cache
      const previousJds: JdsData | undefined =
        queryClient.getQueryData(listKey);

      if (previousJds) {
        queryClient.setQueryData(listKey, {
          resume: previousJds.resume,
          pageInfo: previousJds.pageInfo,
          jds: [...previousJds.jds].map((jd) => {
            if (jd.jd_id === jobId) {
              return {
                ...jd,
                applyAt: jd.applyAt ? null : new Date(),
              };
            }
            return jd;
          }),
        });
      }

      const previousJdDetail: JDDetail | undefined =
        queryClient.getQueryData(detailKey);

      if (previousJdDetail) {
        queryClient.setQueryData(detailKey, {
          ...previousJdDetail,
          applyAt: new Date(),
        });
      }

      return { previousJds, previousJdDetail, listKey, detailKey };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      if (context?.previousJds) {
        queryClient.setQueryData(context.listKey, context.previousJds);
      }
      if (context?.previousJdDetail) {
        queryClient.setQueryData(context.detailKey, context.previousJdDetail);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData(['jd', data.jd_id], (prev?: JDDetail) =>
        prev ? { ...prev, applyAt: data.applyAt } : prev
      );
      queryClient.invalidateQueries({
        queryKey: ['jds-list'],
      });
    },
  });

  return { applyMutate, applyPending };
}
