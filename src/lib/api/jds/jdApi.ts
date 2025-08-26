import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { ApiResponse } from '@/types';
import { JDDetail } from '@/types/jds';
import throwIfNotOk from '@/utils/throwIfNotOk';

export async function getJd(jobId: number) {
  const response = await fetchWithAuth(`/api/jds/${jobId}`);
  throwIfNotOk(response, '채용공고를 가져오는 중 오류가 발생했습니다.');

  const data: ApiResponse<JDDetail> = await response.json();
  return data.data;
}

export async function createJd({
  title,
  companyName,
  job,
  link,
  content,
  endDate,
}: {
  title: string;
  companyName: string;
  job: string;
  link: string;
  content: string;
  endDate: string;
}) {
  const response = await fetchWithAuth('/api/jds/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      companyName,
      job,
      content,
      link,
      endDate,
    }),
  });
  throwIfNotOk(response, '채용공고를 생성하는 중 오류가 발생했습니다.');

  const data: ApiResponse<JDDetail> = await response.json();
  return data.data;
}

export async function updateJd({
  jobId,
  title,
  companyName,
  job,
  link,
  endDate,
}: {
  jobId: number;
  title: string;
  companyName: string;
  job: string;
  link: string;
  endDate: string;
}) {
  const response = await fetchWithAuth(`/api/jds/update/${jobId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      companyName,
      job,
      link,
      endDate,
    }),
  });
  throwIfNotOk(response, '채용공고를 수정하는 중 오류가 발생했습니다.');

  const data: ApiResponse<JDDetail> = await response.json();
  return data.data;
}
