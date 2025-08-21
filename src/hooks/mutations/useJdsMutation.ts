import { useMutation } from '@tanstack/react-query';

import { addBookmark, deleteJd, markJobAsApplied } from '@/lib/jds/jdsApi';
import { queryClient } from '@/lib/queryClient';
import { JobDescription, Resume } from '@/types/jds';

import { useQueryParams } from '../useQueryParams';

import { PageInfo } from './../../types/index';

type JdsData = {
  resume: Resume | null;
  jds: JobDescription[];
  pageInfo: PageInfo;
};

export default function useJdsMutation() {
  const { page, sort, showOnly } = useQueryParams();

  // 채용공고 삭제
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
      return { previousJds };
    },
    onError: (error, variables, context) => {
      if (context?.previousJds) {
        queryClient.setQueryData(
          ['jds-list', `page=${page}`, `sort=${sort}`, `showOnly=${showOnly}`],
          context.previousJds
        );
      }
    },
  });

  // 채용공고 지원
  const { mutate: applyMutate, isPending: applyPending } = useMutation({
    mutationFn: (jobId: number) => markJobAsApplied(jobId),
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
            jds: [...previousJds.jds].map((jd) => {
              if (jd.jd_id === jobId) {
                return {
                  ...jd,
                  applyAt: jd.applyAt ? null : new Date(),
                };
              }
              return jd;
            }),
          }
        );
      }
      return { previousJds };
    },
    onError: (error, variables, context) => {
      if (context?.previousJds) {
        queryClient.setQueryData(
          ['jds-list', `page=${page}`, `sort=${sort}`, `showOnly=${showOnly}`],
          context.previousJds
        );
      }
    },
  });

  // 채용공고 북마크 추가/제거
  const { mutate: bookmarkMutate, isPending: bookmarkPending } = useMutation({
    mutationFn: ({
      jobId,
      newBookmarkState,
    }: {
      jobId: number;
      newBookmarkState: boolean;
    }) => addBookmark(jobId, newBookmarkState),
    onMutate: ({ jobId, newBookmarkState }) => {
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
            jds: [...previousJds.jds].map((jd) => {
              if (jd.jd_id === jobId) {
                return {
                  ...jd,
                  bookmarked: newBookmarkState,
                };
              }
              return jd;
            }),
          }
        );
      }
      return { previousJds };
    },
    onError: (error, variables, context) => {
      if (context?.previousJds) {
        queryClient.setQueryData(
          ['jds-list', `page=${page}`, `sort=${sort}`, `showOnly=${showOnly}`],
          context.previousJds
        );
      }
    },
  });

  return {
    deleteMutate,
    deletePending,
    applyMutate,
    applyPending,
    bookmarkMutate,
    bookmarkPending,
  };
}
