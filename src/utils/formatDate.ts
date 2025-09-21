// utils/formatDate.ts
export type DateFormat = 'date' | 'datetime' | 'time' | 'dateWithDay';

/**
 * 날짜 포맷 함수
 * @param dateInput - Date 객체 또는 문자열
 * @param format - "date"(기본값), "datetime", "time", "dateWithDay"
 * @returns 포맷된 문자열
 */
export function formatDate(
  dateInput: string | Date,
  format: DateFormat = 'date'
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const year = String(date.getFullYear() % 100).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];

  switch (format) {
    case 'datetime':
      return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'dateWithDay':
      return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
    case 'date':
    default:
      return `${year}년 ${month}월 ${day}일`;
  }
}
