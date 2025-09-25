import { useMutation } from '@tanstack/react-query';

import { deleteTodo } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail } from '@/types/jds';

export default function useDeleteTodoMutation() {
  const { mutate: deleteTodoMutate } = useMutation({
    mutationFn: ({ jdId, todoId }: { jdId: number; todoId: number }) =>
      deleteTodo(jdId, todoId),
    onMutate: async (data) => {
      const jobDetailKey = ['jd', data.jdId];
      await queryClient.cancelQueries({ queryKey: jobDetailKey });

      const previousJdDetail = queryClient.getQueryData<JDDetail>(jobDetailKey);

      queryClient.setQueryData(jobDetailKey, (prev?: JDDetail) =>
        prev
          ? {
              ...prev,
              toDoLists: prev.toDoLists.filter(
                (todo) => todo.checklist_id !== data.todoId
              ),
            }
          : prev
      );

      return { jobDetailKey, previousJdDetail };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.jobDetailKey, context.previousJdDetail);
    },
    onSuccess: (data, variables, context) => {
      if (!context) return;
      queryClient.invalidateQueries({ queryKey: context.jobDetailKey });
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { deleteTodoMutate };
}
