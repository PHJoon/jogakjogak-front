import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { createResume, updateResume } from '@/lib/resume/resumeApi';

export default function useResumeMutation() {
  const { mutate: createMutate, isPending: isCreatePending } = useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      createResume(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: ({
      resumeId,
      title,
      content,
    }: {
      resumeId: number;
      title: string;
      content: string;
    }) => updateResume(resumeId, title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
      queryClient.invalidateQueries({ queryKey: ['resume'] });
    },
  });

  return {
    createMutate,
    isCreatePending,
    updateMutate,
    isUpdatePending,
  };
}
