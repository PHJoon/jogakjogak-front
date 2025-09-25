import { useMutation } from '@tanstack/react-query';

import { createResume } from '@/lib/api/resume/resumeApi';
import { queryClient } from '@/lib/queryClient';
import { useBoundStore } from '@/stores/useBoundStore';
import { ResumeRequestBody } from '@/types/resume';

export default function useCreateResumeMutation() {
  const setResume = useBoundStore((state) => state.setResume);

  const { mutate: createResumeMutate, isPending: isResumeCreating } =
    useMutation({
      mutationFn: (data: ResumeRequestBody) => createResume(data),
      onSuccess: (data) => {
        setResume({
          resumeId: -1,
          title: null,
          content: data.content,
          updatedAt: data.updatedAt,
          createdAt: data.createdAt,
        });
        queryClient.invalidateQueries({ queryKey: ['jds-list'] });
        queryClient.invalidateQueries({ queryKey: ['resume'] });
      },
    });

  return { createResumeMutate, isResumeCreating };
}
