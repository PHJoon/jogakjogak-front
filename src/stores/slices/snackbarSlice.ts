import { StateCreator } from 'zustand';

type Snackbar = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
};

const MAX_SNACKBAR = 3;
const DEFAULT_DURATION = 3000;

export interface SnackbarSlice {
  snackbarList: Snackbar[];
  setSnackbar: (snackbar: Omit<Snackbar, 'id'>) => void;
  removeSnackbar: (id: string) => void;
}

export const createSnackbarSlice: StateCreator<
  SnackbarSlice,
  [],
  [],
  SnackbarSlice
> = (set) => ({
  snackbarList: [],
  setSnackbar: (snackbar: Omit<Snackbar, 'id'>) =>
    set((state) => {
      const next = [
        ...state.snackbarList,
        {
          id: crypto.randomUUID(),
          ...snackbar,
          duration: snackbar.duration ?? DEFAULT_DURATION,
        },
      ];
      if (next.length > MAX_SNACKBAR) {
        next.shift();
      }
      return {
        snackbarList: next,
      };
    }),
  removeSnackbar: (id) =>
    set((state) => {
      const next = state.snackbarList.filter((snackbar) => snackbar.id !== id);
      return {
        snackbarList: next,
      };
    }),
});
