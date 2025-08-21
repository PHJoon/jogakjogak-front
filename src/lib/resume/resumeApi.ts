import { ApiResponse } from '@/types';
import { Resume } from '@/types/jds';
import throwIfNotOk from '@/utils/throwIfNotOk';

import { fetchWithAuth } from '../api/fetchWithAuth';

export async function getResume(resumeId: number) {
  const response = await fetchWithAuth(`/api/resume/${resumeId}`);
  throwIfNotOk(response, '이력서를 불러오는 중 오류가 발생했습니다.');

  const data: ApiResponse<Resume> = await response.json();
  return data.data;
}

export async function createResume(title: string, content: string) {
  const response = await fetchWithAuth(`/api/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  throwIfNotOk(response, '이력서를 생성하는 중 오류가 발생했습니다.');
  return { success: true };
}

export async function updateResume(
  resumeId: number,
  title: string,
  content: string
) {
  const response = await fetchWithAuth(`/api/resume/${resumeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  throwIfNotOk(response, '이력서를 수정하는 중 오류가 발생했습니다.');
  return { success: true };
}
