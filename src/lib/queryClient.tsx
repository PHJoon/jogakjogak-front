'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode } from 'react';

import { ERROR_MESSAGES } from '@/constants/errorCode';
import { useBoundStore } from '@/stores/useBoundStore';
import { isAuthError } from '@/utils/authErrorGuard';

import { HttpError } from './HttpError';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof HttpError) {
        if (isAuthError(error)) {
          useBoundStore.getState().setError(error);
          return;
        }
        useBoundStore.getState().setSnackbar({
          type: 'error',
          message:
            ERROR_MESSAGES[error.errorCode as keyof typeof ERROR_MESSAGES] ||
            error.message,
        });
        return;
      }
      useBoundStore.getState().setSnackbar({
        type: 'error',
        message: '알 수 없는 오류가 발생했습니다.',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof HttpError) {
        if (isAuthError(error)) {
          useBoundStore.getState().setError(error);
          return;
        }
        useBoundStore.getState().setSnackbar({
          type: 'error',
          message:
            ERROR_MESSAGES[error.errorCode as keyof typeof ERROR_MESSAGES] ||
            error.message,
        });
        return;
      }
      useBoundStore.getState().setSnackbar({
        type: 'error',
        message: '알 수 없는 오류가 발생했습니다.',
      });
    },
  }),

  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 0,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
