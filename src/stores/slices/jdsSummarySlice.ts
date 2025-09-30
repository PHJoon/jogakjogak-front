import { StateCreator } from 'zustand';
type Setter<T> = (value: T | ((prev: T) => T)) => void;

export interface JDSSummarySlice {
  // postedJdCount: number;
  // applyJdCount: number;
  // perfectJdCount: number;
  // allTotalPieces: number;
  allCompletedPieces: number;
  // setPostedJdCount: Setter<number>;
  // setApplyJdCount: Setter<number>;
  // setPerfectJdCount: Setter<number>;
  // setAllTotalPieces: Setter<number>;
  setAllCompletedPieces: Setter<number>;
}

export const createJDSSummarySlice: StateCreator<
  JDSSummarySlice,
  [],
  [],
  JDSSummarySlice
> = (set) => ({
  // postedJdCount: 0,
  // applyJdCount: 0,
  // perfectJdCount: 0,
  allCompletedPieces: 0,
  // allTotalPieces: 0,
  // setPostedJdCount: (value) =>
  //   set((state) => ({
  //     postedJdCount:
  //       typeof value === 'function' ? value(state.postedJdCount) : value,
  //   })),
  // setApplyJdCount: (value) =>
  //   set((state) => ({
  //     applyJdCount:
  //       typeof value === 'function' ? value(state.applyJdCount) : value,
  //   })),
  // setPerfectJdCount: (value) =>
  //   set((state) => ({
  //     perfectJdCount:
  //       typeof value === 'function' ? value(state.perfectJdCount) : value,
  //   })),
  setAllCompletedPieces: (value) =>
    set((state) => ({
      allCompletedPieces:
        typeof value === 'function' ? value(state.allCompletedPieces) : value,
    })),
  // setAllTotalPieces: (value) =>
  //   set((state) => ({
  //     allTotalPieces:
  //       typeof value === 'function' ? value(state.allTotalPieces) : value,
  //   })),
});
