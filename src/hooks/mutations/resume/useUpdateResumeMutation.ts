import { useMutation } from '@tanstack/react-query';

import { updateResume } from '@/lib/api/resume/resumeApi';
import { queryClient } from '@/lib/queryClient';
import { ResumeRequestBody } from '@/types/resume';

export default function useUpdateResumeMutation() {
  const { mutate: updateResumeMutate, isPending: isResumeUpdating } =
    useMutation({
      mutationFn: (data: ResumeRequestBody) => updateResume(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jds-list'] });
        queryClient.invalidateQueries({ queryKey: ['resume'] });
      },
    });

  return { updateResumeMutate, isResumeUpdating };
}
