import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { ApiResponse } from '@/types';
import { Resume, ResumeRequestBody, ResumeResponse } from '@/types/resume';
import throwIfNotOk from '@/utils/throwIfNotOk';

export async function getResume() {
  const response = await fetchWithAuth(`/api/resume`, {
    method: 'GET',
  });
  await throwIfNotOk(response, '이력서를 불러오는 중 오류가 발생했습니다.');

  const data: ApiResponse<ResumeResponse> = await response.json();
  const resumeData: Resume = {
    isNewcomer: data.data.newcomer,
    educationList: data.data.educationDtoList || [],
    careerList:
      data.data.careerDtoList.map((c) => {
        if (c.quitAt === null)
          return {
            ...c,
            quitAt: '',
          };
        return c;
      }) || [],
    skillList: data.data.skillList || [],
    content: data.data.content || '',
    createdAt: data.data.createdAt,
    updatedAt: data.data.updatedAt,
  };
  return resumeData;
}

export async function createResume(formData: ResumeRequestBody) {
  const response = await fetchWithAuth(`/api/resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  await throwIfNotOk(response, '이력서를 생성하는 중 오류가 발생했습니다.');
  const data = await response.json();
  return data;
}

export async function updateResume(formData: ResumeRequestBody) {
  const response = await fetchWithAuth(`/api/resume`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  await throwIfNotOk(response, '이력서를 수정하는 중 오류가 발생했습니다.');
  const data = await response.json();
  return data;
}

export async function searchSkillWords(query: string) {
  const queryParams = new URLSearchParams({
    q: query,
  });

  const url = `/api/resume/skill-word?${
    queryParams.toString() ? `${queryParams.toString()}` : ''
  }`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  await throwIfNotOk(response, '스킬 단어를 검색하는 중 오류가 발생했습니다.');
  const data: ApiResponse<string[]> = await response.json();
  return data.data;
}
