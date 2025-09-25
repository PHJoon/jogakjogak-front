import { PageInfo } from '.';

export interface Resume {
  resumeId: number;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  jd_id: number;
  title: string;
  bookmark: boolean;
  alarmOn: boolean;
  companyName: string;
  totalPieces: number;
  completedPieces: number;
  applyAt: string | null;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface JdsResponse {
  resume: Resume | null;
  isOnboarded: boolean;
  jds: JobDescription[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  postedJdCount: number;
  last: true;
  first: true;
  applyJdCount: number;
  completedPieces: number;
  totalPieces: number;
  perfectJdCount: number;
  allCompletedPieces: number;
  allTotalPieces: number;
}

export interface TodoItem {
  checklist_id: number;
  category: string;
  title: string;
  content: string;
  memo: string;
  jdId: number;
  createdAt: string;
  updatedAt: string;
  done: boolean;
}

export interface JDDetail {
  jd_id: number;
  title: string;
  bookmark: boolean;
  companyName: string;
  job: string;
  content: string;
  jdUrl: string;
  memo: string;
  memberId: number;
  alarmOn: boolean;
  applyAt: string | null;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
  toDoLists: TodoItem[];
  completedPieces: number;
  totalPieces: number;
}

export type Sort = 'createdAt,desc' | 'createdAt,asc' | 'endedAt,asc';

export type ShowOnly = 'bookmark' | 'completed' | 'alarm';

export interface JobPostingFormInput {
  title: string;
  companyName: string;
  job: string;
  endDate: string;
  content: string;
  link: string;
}

export type JdsData = {
  resume: Resume | null;
  jds: JobDescription[];
  pageInfo: PageInfo;
};

export type CreateTodoRequestData = {
  category: string;
  title: string;
  content: string;
};

export type UpdateTodoRequestData = CreateTodoRequestData & {
  is_done: boolean;
};

export type TodoCategory =
  | 'STRUCTURAL_COMPLEMENT_PLAN'
  | 'CONTENT_EMPHASIS_REORGANIZATION_PROPOSAL'
  | 'SCHEDULE_MISC_ERROR';
