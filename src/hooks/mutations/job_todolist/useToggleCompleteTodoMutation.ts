import { useMutation } from '@tanstack/react-query';

import { toggleCompleteTodo } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail } from '@/types/jds';

export default function useToggleCompleteTodoMutation() {
  const { mutate: toggleCompleteTodoMutate } = useMutation({
    mutationFn: ({
      jdId,
      todoId,
      updatedDoneState,
    }: {
      jdId: number;
      todoId: number;
      updatedDoneState: boolean;
    }) => toggleCompleteTodo(jdId, todoId, updatedDoneState),
    onMutate: async (data) => {
      const jobDetailKey = ['jd', data.jdId];

      await queryClient.cancelQueries({ queryKey: jobDetailKey });

      const previousJdDetail = queryClient.getQueryData<JDDetail>(jobDetailKey);

      queryClient.setQueryData(jobDetailKey, (prev?: JDDetail) =>
        prev
          ? {
              ...prev,
              toDoLists: prev.toDoLists.map((todo) => {
                if (todo.checklist_id === data.todoId) {
                  return {
                    ...todo,
                    done: data.updatedDoneState,
                  };
                }
                return todo;
              }),
            }
          : prev
      );

      return { previousJdDetail, jobDetailKey };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          context.jobDetailKey,
          context.previousJdDetail
        );
      }
    },
    onSuccess: (data, variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.jobDetailKey, (prev?: JDDetail) => {
        if (!prev) return prev;
        console.log('data from server', data, prev);
        return {
          ...prev,
          completedPieces: data.done
            ? prev.completedPieces + 1
            : prev.completedPieces - 1,
          toDoLists: prev.toDoLists.map((todo) =>
            todo.checklist_id === data.checklist_id ? data : todo
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { toggleCompleteTodoMutate };
}
