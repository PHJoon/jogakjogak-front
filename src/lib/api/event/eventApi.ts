import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { ApiResponse } from '@/types';
import throwIfNotOk from '@/utils/throwIfNotOk';

export async function getEvent() {
  const response = await fetchWithAuth(`/api/event`, {
    method: 'GET',
  });
  await throwIfNotOk(response, '채용공고를 가져오는 중 오류가 발생했습니다.');

  const data: ApiResponse<{
    id: string;
    code: string;
    type: string;
    isFirst: boolean;
  }> = await response.json();
  return data.data;
}
