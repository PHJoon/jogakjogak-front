export default async function throwIfNotOk(res: Response, fallbackMsg: string) {
  if (res.ok) return;
  try {
    const data = await res.json();
    throw new Error(data?.message || fallbackMsg);
  } catch {
    throw new Error(fallbackMsg);
  }
}
