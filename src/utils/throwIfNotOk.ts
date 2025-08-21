import { HttpError } from '@/lib/HttpError';

export default async function throwIfNotOk(
  res: Response,
  fallbackMsg: string,
  ignoreStatus?: number[]
) {
  if (res.ok) return;
  if (ignoreStatus?.includes(res.status)) return;
  try {
    const data = await res.json();
    throw new HttpError(data?.message || fallbackMsg, res.status);
  } catch {
    throw new HttpError(fallbackMsg, res.status);
  }
}
