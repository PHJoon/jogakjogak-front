import { useMutation } from '@tanstack/react-query';

import { createTodo } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';
import { CreateTodoRequestData, JDDetail } from '@/types/jds';

export default function useCreateTodoMutation() {
  const { mutate: createTodoMutate, isPending: isCreating } = useMutation({
    mutationFn: ({
      jdId,
      newTodoItem,
    }: {
      jdId: number;
      newTodoItem: CreateTodoRequestData;
    }) => createTodo(jdId, newTodoItem),
    onMutate: async (data) => {
      const jobDetailKey = ['jd', data.jdId];
      await queryClient.cancelQueries({ queryKey: jobDetailKey });

      const tempId = Date.now() + Math.floor(Math.random() * 1000);

      const optimisticItem = {
        ...data.newTodoItem,
        checklist_id: tempId, // 임시 ID
        jdId: data.jdId,
        memo: '',
        done: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(jobDetailKey, (prev?: JDDetail) =>
        prev
          ? { ...prev, toDoLists: [...prev.toDoLists, optimisticItem] }
          : prev
      );

      return { jobDetailKey, tempId };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.jobDetailKey, (prev?: JDDetail) =>
        prev
          ? {
              ...prev,
              toDoLists: prev.toDoLists.filter(
                (todo) => todo.checklist_id !== context.tempId
              ),
            }
          : prev
      );
    },
    onSuccess: (data, variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.jobDetailKey, (prev?: JDDetail) =>
        prev
          ? {
              ...prev,
              toDoLists: prev.toDoLists.map((todo) =>
                todo.checklist_id === context.tempId ? data : todo
              ),
            }
          : prev
      );
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
    },
  });

  return { createTodoMutate, isCreating };
}
