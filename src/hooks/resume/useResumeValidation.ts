import { ERROR_CODES } from '@/constants/errorCode';
import { HttpError } from '@/lib/HttpError';
import { useBoundStore } from '@/stores/useBoundStore';

export default function useResumeValidation(
  hasUnsavedChanges: boolean,
  showResumeErrorModal: (title: string, content: string) => void
) {
  const setSnackbar = useBoundStore((state) => state.setSnackbar);

  const validateResume = (title: string, content: string): boolean => {
    if (!hasUnsavedChanges) {
      showResumeErrorModal(
        '변경된 내용이 없어요.',
        '이력서 내용을 수정한 후 제출해주세요.'
      );
      return false;
    }
    if (!title.trim()) {
      showResumeErrorModal(
        '이력서 제목이 유효하지 않아요.',
        '제목을 입력해주세요.'
      );
      return false;
    }
    if (!content.trim()) {
      showResumeErrorModal(
        '이력서 내용이 유효하지 않아요.',
        '내용을 입력해주세요.'
      );
      return false;
    }
    if (content.trim().length < 300 || content.length > 5000) {
      showResumeErrorModal(
        '이력서 내용이 유효하지 않아요.',
        '이력서 내용은 300자 이상,\n5000자 이하로 작성해주세요.\n(앞뒤 공백은 제외됩니다.)'
      );
      return false;
    }
    return true;
  };

  const handleError = (error: unknown) => {
    if (error instanceof HttpError) {
      if (error.errorCode === ERROR_CODES.REPLAY_REQUIRED) {
        return;
      }

      if (error.status === 409) {
        showResumeErrorModal(
          '이력서 등록 오류',
          '이미 등록된 이력서가 있습니다.'
        );
        return;
      }
      showResumeErrorModal(
        '이력서 내용이 유효하지 않아요',
        '반복된 내용이 있어 올바른 작성이 필요해요.'
      );
      return;
    }
    showResumeErrorModal(
      '이력서 등록 오류',
      '이력서 등록 중 오류가 발생했습니다.'
    );
  };

  return {
    validateResume,
    handleError,
  };
}
