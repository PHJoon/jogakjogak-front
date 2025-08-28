import { useMutation } from '@tanstack/react-query';

import { updateTodo } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail, UpdateTodoRequestData } from '@/types/jds';

export default function useUpdateTodoMutation() {
  const { mutate: updateTodoMutate } = useMutation({
    mutationFn: ({
      jdId,
      todoId,
      updateTodoItem,
    }: {
      jdId: number;
      todoId: number;
      updateTodoItem: UpdateTodoRequestData;
    }) => updateTodo(jdId, todoId, updateTodoItem),
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
                    category: data.updateTodoItem.category,
                    title: data.updateTodoItem.title,
                    content: data.updateTodoItem.content,
                    done: data.updateTodoItem.is_done,
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
        return {
          ...prev,
          toDoLists: prev.toDoLists.map((todo) =>
            todo.checklist_id === data.checklist_id ? data : todo
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { updateTodoMutate };
}
