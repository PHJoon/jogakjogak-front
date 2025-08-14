import { ApiResponse, PaginatedData } from '@/types';
import { JobDescription, Resume } from '@/types/jds';

import { fetchWithAuth } from '../api/fetchWithAuth';

type JobAnalysisData = ApiResponse<
  PaginatedData<'jds', JobDescription, { resume: Resume | null }>
>;

// 채용공고 전체 데이터 가져오기
export async function getJdsData(page: number, sort?: string) {
  try {
    const queryParams = new URLSearchParams();
    if (sort) {
      queryParams.append('sort', sort);
      queryParams.append('page', page.toString());
    }
    const url = `/api/jds${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await fetchWithAuth(url);
    const data: JobAnalysisData = await response.json();

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
  } catch (error) {
    console.error('Failed to fetch JDs data:', error);
  }
}
