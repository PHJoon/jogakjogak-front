import { useMutation } from '@tanstack/react-query';

import { withdrawal } from '@/lib/api/auth/authApi';

export default function useWithdrawalMutation() {
  const { mutate: withdrawalMutation } = useMutation({
    mutationFn: () => withdrawal(),
  });

  return { withdrawalMutation };
}
