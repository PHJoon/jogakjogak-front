import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import useResumeMutation from '@/hooks/mutations/useResumeMutation';
import useResumeQuery from '@/hooks/queries/useResumeQuery';
import { useBoundStore } from '@/stores/useBoundStore';

export default function useResumeForm() {
  // resumeId 가져오기
  const searchParams = useSearchParams();
  const rawResumeId = searchParams.get('id');
  const resumeId =
    rawResumeId !== null &&
    rawResumeId.trim() !== '' &&
    !isNaN(Number(rawResumeId))
      ? Number(rawResumeId)
      : null;

  const [resumeTitle, setResumeTitle] = useState('나의 이력서');
  const [resumeContent, setResumeContent] = useState('');

  const existingResume = useBoundStore((state) => state.resume);
  const { isLoading: isExistingResumeLoading } = useResumeQuery(resumeId);
  const { createMutate, isCreatePending, updateMutate, isUpdatePending } =
    useResumeMutation();

  // 변경사항 감지
  const hasUnsavedChanges = useMemo(() => {
    if (resumeId && existingResume) {
      return (
        existingResume.title.trim() !== resumeTitle.trim() ||
        existingResume.content.trim() !== resumeContent.trim()
      );
    }
    return resumeTitle.trim() !== '나의 이력서' || resumeContent.trim() !== '';
  }, [resumeId, existingResume, resumeTitle, resumeContent]);

  // 기존 이력서 세팅
  useEffect(() => {
    if (existingResume) {
      setResumeTitle(existingResume.title);
      setResumeContent(existingResume.content);
    }
  }, [existingResume]);

  return {
    resumeId,
    resumeTitle,
    resumeContent,
    setResumeTitle,
    setResumeContent,
    hasUnsavedChanges,
    isExistingResumeLoading,
    createMutate,
    isCreatePending,
    updateMutate,
    isUpdatePending,
  };
}
