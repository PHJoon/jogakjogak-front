export interface Resume {
  resumeId: number;
  title: string;
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
  total_pieces: number;
  completed_pieces: number;
  applyAt: string | null;
  endedAt: string;
  createdAt: string;
  updatedAt: string;
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
}
