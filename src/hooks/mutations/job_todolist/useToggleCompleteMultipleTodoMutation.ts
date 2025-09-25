import { useMutation } from '@tanstack/react-query';

import { toggleCompleteMultipleTodos } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';

export default function useToggleCompleteMultipleTodoMutation() {
  const {
    mutate: toggleCompleteMultipleTodoMutate,
    isPending: isToggleCompleteMultipleTodoPending,
  } = useMutation({
    mutationFn: ({
      jdId,
      toDoListIds,
    }: {
      jdId: number;
      toDoListIds: number[];
    }) => toggleCompleteMultipleTodos(jdId, toDoListIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
      queryClient.invalidateQueries({ queryKey: ['jd', variables.jdId] });
    },
  });

  return {
    toggleCompleteMultipleTodoMutate,
    isToggleCompleteMultipleTodoPending,
  };
}
