import { StateCreator } from 'zustand';

export interface JobDetailSlice {
  checkedTodoList: number[];
  addCheckedTodo: (todoId: number) => void;
  removeCheckedTodo: (todoId: number) => void;
  clearCheckedTodo: () => void;
}

export const createJobDetailSlice: StateCreator<
  JobDetailSlice,
  [],
  [],
  JobDetailSlice
> = (set) => ({
  checkedTodoList: [],
  addCheckedTodo: (todoId) =>
    set((state) => {
      if (!state.checkedTodoList.includes(todoId)) {
        return { checkedTodoList: [...state.checkedTodoList, todoId] };
      }
      return state;
    }),
  removeCheckedTodo: (todoId) =>
    set((state) => ({
      checkedTodoList: state.checkedTodoList.filter((id) => id !== todoId),
    })),
  clearCheckedTodo: () => set(() => ({ checkedTodoList: [] })),
});
