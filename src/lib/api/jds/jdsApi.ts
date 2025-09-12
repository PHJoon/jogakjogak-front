import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { ApiResponse, PaginatedData } from '@/types';
import { JobDescription, Resume, ShowOnly, Sort } from '@/types/jds';
import throwIfNotOk from '@/utils/throwIfNotOk';

type JdsResponse = ApiResponse<
  PaginatedData<'jds', JobDescription, { resume: Resume | null }>
>;

// 채용공고 전체 데이터 가져오기
export async function getJdsData(
  page: number,
  sort: Sort | '',
  showOnly: ShowOnly | ''
) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  if (sort) {
    queryParams.append('sort', sort);
  }
  if (showOnly) {
    queryParams.append('showOnly', showOnly);
  }
  const url = `/api/jds${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`;

  const response = await fetchWithAuth(url, {
    method: 'GET',
  });

  await throwIfNotOk(response, '채용공고를 가져오는 중 오류가 발생했습니다.');
  const data: JdsResponse = await response.json();
  return {
    resume: data.data?.resume || null,
    jds: data.data?.jds || [],
    pageInfo: {
      totalElements: data.data?.totalElements || 0,
      totalPages: data.data?.totalPages || 0,
      currentPage: data.data?.currentPage || 0,
      pageSize: data.data?.pageSize || 0,
      hasNext: data.data?.hasNext || false,
      hasPrevious: data.data?.hasPrevious || false,
      isFirst: data.data?.isFirst || false,
      isLast: data.data?.isLast || false,
    },
  };
}

// 채용공고 삭제
export async function deleteJd(jobId: number) {
  const response = await fetchWithAuth(`/api/jds/${jobId}`, {
    method: 'DELETE',
  });

  await throwIfNotOk(response, '채용공고 삭제 중 오류가 발생했습니다.');
  const data = await response.json();
  return data;
}

// 채용공고 지원 완료
export async function markJobAsApplied(jobId: number) {
  const response = await fetchWithAuth(`/api/jds/${jobId}`, {
    method: 'PATCH',
  });

  await throwIfNotOk(
    response,
    '채용공고 지원 완료 처리 중 오류가 발생했습니다.'
  );
  const data: ApiResponse<{ jd_id: number; applyAt: string }> =
    await response.json();
  return data.data;
}

// 채용공고 즐겨찾기 등록
export async function addBookmark(jobId: number, newBookmarkState: boolean) {
  const response = await fetchWithAuth(`/api/jds/${jobId}/bookmark`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isBookmark: newBookmarkState,
    }),
  });
  await throwIfNotOk(
    response,
    '채용공고 즐겨찾기 등록 중 오류가 발생했습니다.'
  );
  const data: ApiResponse<{ jd_id: number; bookmark: boolean }> =
    await response.json();
  return data.data;
}
