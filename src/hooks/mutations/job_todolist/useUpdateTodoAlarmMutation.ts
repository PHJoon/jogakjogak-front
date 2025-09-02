import { useMutation } from '@tanstack/react-query';

import { updateTodoNotification } from '@/lib/api/jds/todoApi';
import { queryClient } from '@/lib/queryClient';
import { JDDetail } from '@/types/jds';

export default function useUpdateTodoAlarmMutation() {
  const { mutate: updateTodoAlarmMutate } = useMutation({
    mutationFn: ({
      jdId,
      newAlarmState,
    }: {
      jdId: number;
      newAlarmState: boolean;
    }) => updateTodoNotification(jdId, newAlarmState),
    onMutate: async (data) => {
      const jobDetailKey = ['jd', data.jdId];

      await queryClient.cancelQueries({ queryKey: jobDetailKey });

      const previousJdDetail = queryClient.getQueryData<JDDetail>(jobDetailKey);

      queryClient.setQueryData(jobDetailKey, (prev?: JDDetail) =>
        prev
          ? {
              ...prev,
              alarmOn: data.newAlarmState,
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
      queryClient.setQueryData(context.jobDetailKey, (prev?: JDDetail) =>
        prev ? { ...prev, alarmOn: data.alarmOn } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['jds-list'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return { updateTodoAlarmMutate };
}
