import { useMutation } from '@tanstack/react-query';

import { createResume } from '@/lib/api/resume/resumeApi';
import { queryClient } from '@/lib/queryClient';
import { ResumeRequestBody } from '@/types/resume';

export default function useCreateResumeMutation() {
  const { mutate: createResumeMutate, isPending: isResumeCreating } =
    useMutation({
      mutationFn: (data: ResumeRequestBody) => createResume(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jds-list'] });
        queryClient.invalidateQueries({ queryKey: ['resume'] });
      },
    });

  return { createResumeMutate, isResumeCreating };
}
