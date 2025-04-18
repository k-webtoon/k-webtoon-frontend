import axios from "axios";
import {
  WebtoonDTO,
  WebtoonListResponse,
  WebtoonSearchParams,
  WebtoonCountSummaryDto,
} from '../model/webtoon';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const webtoonApi = {
  // 웹툰 통계 조회
  getWebtoonCountSummary: async (): Promise<WebtoonCountSummaryDto> => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get<WebtoonCountSummaryDto>(
      `${API_BASE_URL}/admin/webtoons/count-summary`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return data;
  },

  // 웹툰 목록 조회
  getWebtoonList: async (params: WebtoonSearchParams): Promise<WebtoonListResponse> => {
    const token = localStorage.getItem("token");
    
    // 필터링을 위한 파라미터 구성
    const queryParams: Record<string, any> = {
      page: params.page,
      size: params.size,
    };

    // 검색어가 있는 경우만 추가
    if (params.search) {
      queryParams.search = params.search;
    }

    // 상태 필터링 처리
    if (params.status) {
      if (params.status === 'public') {
        queryParams.isPublic = true;
      } else if (params.status === 'private') {
        queryParams.isPublic = false;
      }
      // 'all'인 경우는 isPublic 파라미터를 보내지 않음
    }

    console.log('Webtoon API Request params:', {
      originalParams: params,
      queryParams,
      status: params.status,
      isPublic: queryParams.isPublic
    }); // 상세한 요청 파라미터 로깅

    const { data } = await axios.get<WebtoonListResponse>(`${API_BASE_URL}/admin/webtoons`, { 
      params: queryParams,
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    console.log('Webtoon API Response:', {
      totalElements: data.totalElements,
      content: data.content.map(w => ({
        id: w.id,
        titleName: w.titleName,
        isPublic: w.isPublic
      }))
    }); // 응답 데이터 로깅
    return data;
  },

  // 웹툰 상세 조회
  getWebtoonDetail: async (webtoonId: number): Promise<WebtoonDTO> => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get<WebtoonDTO>(`${API_BASE_URL}/admin/webtoons/${webtoonId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return data;
  },

  // 웹툰 공개/비공개 상태 토글
  toggleWebtoonStatus: async (webtoonId: number): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/webtoons/${webtoonId}/status`,
      {},  // 빈 객체를 보냅니다 (토글이므로 상태값 불필요)
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      }
    );

    if (response.status !== 200) {
      throw new Error('웹툰 상태 변경에 실패했습니다.');
    }
  },
}; 