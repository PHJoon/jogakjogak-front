import { HttpError } from '@/lib/HttpError';

export default async function throwIfNotOk(
  res: Response,
  fallbackMsg: string,
  ignoreStatus: number[] = []
) {
  if (res.ok) return;
  if (ignoreStatus?.includes(res.status)) return;

  const ctype = res.headers.get('Content-Type') || '';
  let message = fallbackMsg;
  let code: string | number | undefined;
  let ErrorCode: string | number | undefined;

  try {
    if (ctype.includes('application/json')) {
      const data = await res.json();
      message = data?.message || fallbackMsg;
      code = data?.code;
      ErrorCode = data?.ErrorCode;
      // 상태 바디에 넣어준 경우 우선 반영
      const status =
        typeof data?.status === 'number' ? data.status : res.status;
      throw new HttpError(message, status, code, data, res.url, ErrorCode);
    } else {
      // JSON이 아니라면 텍스트 시도
      const text = await res.text();
      message = text || fallbackMsg;
      throw new HttpError(
        message,
        res.status,
        undefined,
        text,
        res.url,
        ErrorCode
      );
    }
  } catch (e) {
    // 위 try에서 JSON 파싱 실패 등으로 떨어진 경우
    if (e instanceof HttpError) throw e; // 앞에서 던진 에러면 그대로 넘김
    throw new HttpError(message, res.status, undefined, undefined, res.url);
  }
}
