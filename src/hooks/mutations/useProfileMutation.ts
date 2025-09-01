import { useMutation } from '@tanstack/react-query';

import {
  toggleUserNotification,
  updateMyProfile,
} from '@/lib/api/mypage/profile';
import { queryClient } from '@/lib/queryClient';
import { Profile } from '@/types/profile';

export default function useProfileMutation() {
  const { mutate: updateProfileMutate, isPending: isUpdateProfilePending } =
    useMutation({
      mutationKey: ['profile-update'],
      mutationFn: ({ nickname }: { nickname: string }) =>
        updateMyProfile({ nickname }),
      onMutate: async ({ nickname }) => {
        await queryClient.cancelQueries({ queryKey: ['profile'] });

        const previousProfile = queryClient.getQueryData<Profile>(['profile']);
        if (previousProfile) {
          queryClient.setQueryData(['profile'], {
            ...previousProfile,
            nickname,
          });
        }
        return { previousProfile };
      },
      onError: (error, variables, context) => {
        if (!context) return;
        queryClient.setQueryData(['profile'], context.previousProfile);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['profile'], data);
      },
    });

  const {
    mutate: toggleNotificationMutate,
    isPending: isToggleNotificationPending,
  } = useMutation({
    mutationKey: ['profile-alarm-update'],
    mutationFn: () => toggleUserNotification(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      const previousProfile = queryClient.getQueryData<Profile>(['profile']);
      if (previousProfile) {
        queryClient.setQueryData(['profile'], {
          ...previousProfile,
          notificationEnabled: !previousProfile.notificationEnabled,
        });
      }
      return { previousProfile };
    },
    onError: (error, variables, context) => {
      if (!context) return;
      queryClient.setQueryData(['profile'], context.previousProfile);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], (prev: Profile | undefined) => {
        if (!prev)
          return { nickname: '', email: '', notificationEnabled: data };
        return { ...prev, notificationEnabled: data };
      });
    },
  });

  return {
    updateProfileMutate,
    isUpdateProfilePending,
    toggleNotificationMutate,
    isToggleNotificationPending,
  };
}
