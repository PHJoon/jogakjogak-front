export class HttpError extends Error {
  status: number;
  code?: string | number;
  errorCode?: string | number;
  raw?: unknown;
  url?: string;
  constructor(
    message: string,
    status: number,
    code?: string | number,
    errorCode?: string | number,
    raw?: unknown,
    url?: string
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.errorCode = errorCode;
    this.raw = raw;
    this.url = url;
  }
}
