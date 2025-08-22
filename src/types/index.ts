export type ListField<K extends string, TItem> = {
  [P in K]: TItem[];
};

export interface PageInfo {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

export type PaginatedData<
  K extends string,
  TItem,
  TExtra extends object = Record<string, never>,
> = TExtra & ListField<K, TItem> & PageInfo;
