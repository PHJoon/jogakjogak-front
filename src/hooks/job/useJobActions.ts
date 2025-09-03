import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useCallback } from 'react';

import { GACategory, GAEvent } from '@/constants/gaEvent';
import { useBoundStore } from '@/stores/useBoundStore';
import trackEvent from '@/utils/trackEventGA';

import useApplyJdMutation from '../mutations/job/useApplyJdMuation';
import useBookmarkJdMutation from '../mutations/job/useBookmarkJdMutation';

export default function useJobActions() {
  const router = useRouter();
  const { applyMutate } = useApplyJdMutation();
  const { bookmarkMutate } = useBookmarkJdMutation();
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  // 채용공고 수정 핸들러
  const handleJobEdit = useCallback(
    (jobId: number | null) => {
      trackEvent({
        event: GAEvent.JobPosting.EDIT_PAGE_VIEW,
        event_category: GACategory.JOB_POSTING,
        jobId: jobId ?? undefined,
      });
      router.push(`/job/edit?id=${jobId}`);
    },
    [router]
  );

  // 지원 완료 핸들러
  const handleMarkAsApplied = useCallback(
    (jobId: number | null, applyAt: string | null) => {
      if (!jobId) return;

      trackEvent({
        event: GAEvent.JobPosting.APPLY_JOB_TOGGLE,
        event_category: GACategory.JOB_POSTING,
        apply_status: applyAt ? false : true,
        jobId: jobId,
      });

      applyMutate(jobId, {
        onSuccess: (data) => {
          setSnackbar({
            message: data.applyAt
              ? '지원 완료되었습니다.'
              : '지원 취소되었습니다.',
            type: data.applyAt ? 'success' : 'info',
          });
        },
        onError: (error) => {
          setSnackbar({
            message: error.message,
            type: 'error',
          });
        },
      });
    },
    [applyMutate, setSnackbar]
  );

  // 즐겨찾기 핸들러
  const handleBookmarkToggle = useCallback(
    (jobId: number | null, newBookmarkState: boolean) => {
      if (!jobId) return;

      trackEvent({
        event: GAEvent.JobPosting.BOOKMARK_TOGGLE,
        event_category: GACategory.JOB_POSTING,
        bookmark_status: newBookmarkState,
        jobId: jobId,
      });

      bookmarkMutate(
        { jobId, newBookmarkState },
        {
          onSuccess: (data) => {
            setSnackbar({
              message: data.bookmark
                ? '관심공고로 등록되었습니다.'
                : '관심공고에서 제외되었습니다.',
              type: data.bookmark ? 'success' : 'info',
            });
          },
          onError: (error) => {
            setSnackbar({
              message: error.message,
              type: 'error',
            });
          },
        }
      );
    },
    [bookmarkMutate, setSnackbar]
  );

  return {
    handleJobEdit,
    handleMarkAsApplied,
    handleBookmarkToggle,
  };
}
