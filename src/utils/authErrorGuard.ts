import { ERROR_CODES } from '@/constants/errorCode';
import { HttpError } from '@/lib/HttpError';

// 로그인 오류 에러 코드
const AUTH_ERROR_CODES = [
  ERROR_CODES.NO_REFRESH_TOKEN,
  ERROR_CODES.INVALID_REFRESH_TOKEN,
  ERROR_CODES.NO_ACCESS_TOKEN,
  ERROR_CODES.TOKEN_REISSUE_FAILED,
  ERROR_CODES.NOT_FOUND_TOKEN,
  ERROR_CODES.TOKEN_EXPIRED,
  ERROR_CODES.NOT_REFRESH_TOKEN,
  ERROR_CODES.TOKEN_TYPE_NOT_MATCH,
  ERROR_CODES.NOT_FOUND_OAUTH_PROVIDER,
  ERROR_CODES.EXPIRED_ACCESS_TOKEN,
  ERROR_CODES.INVALID_ACCESS_TOKEN,
];

type AuthErrorCode = (typeof AUTH_ERROR_CODES)[number];

const AUTH_ERROR_CODES_SET = new Set(AUTH_ERROR_CODES);

export function isAuthError(error: unknown): boolean {
  if (
    error instanceof HttpError &&
    AUTH_ERROR_CODES_SET.has(error.errorCode as AuthErrorCode)
  ) {
    return true;
  }
  return false;
}
