export class HttpError extends Error {
  status: number;
  code?: string | number;
  raw?: unknown;
  url?: string;
  ErrorCode?: string | number;
  constructor(
    message: string,
    status: number,
    code?: string | number,
    raw?: unknown,
    url?: string,
    ErrorCode?: string | number
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.raw = raw;
    this.url = url;
    this.ErrorCode = ErrorCode;
  }
}
