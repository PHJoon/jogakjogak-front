import { useQuery } from '@tanstack/react-query';

import { getMyProfile } from '@/lib/api/mypage/profile';

export default function useMyProfileQuery() {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getMyProfile(),
    queryKey: ['profile'],
  });

  return { data, isLoading, error };
}
