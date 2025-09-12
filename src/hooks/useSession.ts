import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export default function useSession() {
  const { data, refetch, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        cache: 'no-store',
      });
      return response.json();
    },
    queryKey: ['session'],
  });

  return {
    isLoggedIn: data?.isLoggedIn || false,
    refetch,
    isLoading,
  };
}
