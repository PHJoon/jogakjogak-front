export function extractDateTime(value: Date | string | number): string | undefined {
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  const y = String((date.getFullYear() % 100)).padStart(2, '0');
  const m = String((date.getMonth() + 1)).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');

  return `${y}.${m}.${d} ${hh}:${mm}:${ss}`;
}