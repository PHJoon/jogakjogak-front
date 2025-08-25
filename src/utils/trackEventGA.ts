import { sendGAEvent } from '@next/third-parties/google';

/**
 * Google Analytics 이벤트 전송 시 사용되는 파라미터 정의
 *
 * @param event - 이벤트 이름 (예: 'login', 'resume_create')
 * @param event_category - 이벤트 카테고리 (예: 'auth', 'resume', 'job_posting')
 * @param login_method - 로그인 방식 (Auth 이벤트에서만 사용, 예: 'google', 'kakao')
 * @param alarm_status - 알림 설정 여부 (예: true, false)
 * @param bookmark_status - 북마크 여부 (예: true, false)
 * @param apply_status - 지원 여부 (예: true, false)
 * @param todo_status - 할 일 여부 (예: true, false)
 * @param jobId - 채용공고 ID (job 관련 이벤트에서 사용)
 */
type GAEvent = {
  event: string;
  event_category: string;
  login_method?: string;
  alarm_status?: boolean;
  bookmark_status?: boolean;
  apply_status?: boolean;
  todo_status?: boolean;
  jobId?: number;
};

export default function trackEvent({ event: eventName, ...rest }: GAEvent) {
  sendGAEvent('event', eventName, rest);
}
