import { ApiResponse } from '@/types';
import { JDDetail } from '@/types/jds';
import throwIfNotOk from '@/utils/throwIfNotOk';

import { fetchWithAuth } from '../api/fetchWithAuth';

export async function getJd(jobId: number) {
  const response = await fetchWithAuth(`/api/jds/${jobId}`);
  throwIfNotOk(response, '채용공고를 가져오는 중 오류가 발생했습니다.');

  const data: ApiResponse<JDDetail> = await response.json();
  return data.data;
}
