import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SessionState {
  redirectAfterResume?: string;
  setRedirect: (url: string) => void;
  clearRedirect: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      redirectAfterResume: undefined,
      setRedirect: (url) => set({ redirectAfterResume: url }),
      clearRedirect: () => set({ redirectAfterResume: undefined }),
    }),
    {
      name: 'session-store',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
