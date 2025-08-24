// 이벤트명 (action)
const AuthEvent = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REMOVE_ACCOUNT: 'remove_account',
} as const;

const FooterEvent = {
  ABOUT_US: 'footer_about_us',
  CONTACT_US: 'footer_contact_us',
  TERMS_OF_SERVICE: 'footer_terms_of_service',
  PRIVACY_POLICY: 'footer_privacy_policy',
} as const;

const ResumeEvent = {
  CREATE_PAGE_VIEW: 'resume_create_page_view',
  CREATE_PAGE_VIEW_ON_MODAL: 'resume_create_page_view_on_modal',
  EDIT_PAGE_VIEW: 'resume_edit_page_view',
  CREATE: 'resume_create',
  EDIT: 'resume_edit',
  HELPER: 'resume_helper',
} as const;

const JobPostingEvent = {
  CREATE_PAGE_VIEW: 'job_posting_create_page_view',
  EDIT_PAGE_VIEW: 'job_posting_edit_page_view',
  CREATE: 'job_posting_create',
  EDIT: 'job_posting_edit',
  REMOVE: 'job_posting_remove',

  ALARM_TOGGLE: 'job_posting_alarm_toggle',
  BOOKMARK_TOGGLE: 'job_posting_bookmark_toggle',
  APPLY_JOB_TOGGLE: 'job_posting_apply_job_toggle',
} as const;

const TodoListEvent = {
  EDIT_TODO: 'todo_edit',
  DELETE_TODO: 'todo_delete',
  ADD_TODO: 'todo_add',
  TOGGLE_TODO: 'todo_toggle',
} as const;

export const GAEvent = {
  Auth: AuthEvent,
  Footer: FooterEvent,
  Resume: ResumeEvent,
  JobPosting: JobPostingEvent,
  TodoList: TodoListEvent,
};

// 2. 카테고리 (category)
export const GACategory = {
  AUTH: 'auth',
  FOOTER: 'footer',
  JOB_POSTING: 'job_posting',
  RESUME: 'resume',
  TODO: 'todo',
} as const;
