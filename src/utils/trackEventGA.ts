import { sendGTMEvent } from '@next/third-parties/google';

/**
 * Google Analytics 이벤트 전송 시 사용되는 파라미터 정의
 *
 * @param event - 이벤트 이름 (예: 'login', 'resume_create')
 * @param category - 이벤트 카테고리 (예: 'auth', 'resume', 'job_posting')
 * @param method - 로그인 방식 (Auth 이벤트에서만 사용, 예: 'google', 'kakao')
 * @param status - 상태값 (모달 열림/닫힘, 북마크 여부, 알림 설정 여부, 지원 여부 등)
 * @param jobId - 채용공고 ID (job 관련 이벤트에서 사용)
 */
type GTagEvent = {
  event: string;
  category: string;
  method?: string;
  status?: boolean;
  jobId?: number;
};

export default function trackEvent(params: GTagEvent) {
  sendGTMEvent(params);
}
