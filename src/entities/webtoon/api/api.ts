import axios from "axios";
import {
    WebtoonResponse,
    WebtoonPaginatedResponse,
    WebtoonInfo, RecommendationRequest
} from "@/entities/webtoon/model/types";

const BASE_URL = 'http://localhost:8080/api/webtoons';

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 아이디로 웹툰 검색 API (단일)
export const getWebtoonById = async (id: number): Promise<WebtoonResponse> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 단어로 웹툰 검색 API (리스트)
export const searchWebtoons = async (titleName: string): Promise<WebtoonPaginatedResponse> => {
    const response = await axios.get(`${BASE_URL}/search/name`, {
        params: { titleName }
    });
    return response.data;
};

// 작가로 웹툰 검색 API (리스트)
export const searchWebtoons_Author = async (authorName: string, page: number = 0, size: number = 10): Promise<WebtoonPaginatedResponse> => {
  const response = await axios.get(`${BASE_URL}/search/author`, {
    params: { authorName, page, size }
  });
  return response.data;
};

// 태그로 웹툰 검색 API (리스트)
export const searchWebtoons_Tags =async (tagName: string, page: number = 0, size: number = 10): Promise<WebtoonPaginatedResponse> => {
    const response = await axios.get(`${BASE_URL}/search/tag`, {
        params: { tagName, page, size }
    });
    return response.data;
};

// 조회수 높은 웹툰 조회 API (리스트)
export const topWebtoons = async (page: number = 0, size: number = 10): Promise<WebtoonPaginatedResponse> => {
    const response = await axios.get(`${BASE_URL}/top`, {
        params: {page, size}
    });
    return response.data;
};

// 즐겨찾기가 많은 웹툰 조회 API
export const getPopularByFavorites = async (size: number = 10): Promise<WebtoonInfo[]> => {
    try {
        const safeSize = size <= 0 ? 10 : size;
        const response = await axios.get(`${BASE_URL}/popular/favorites`, {
            params: { size: safeSize }
        });
        return response.data;
    } catch (error) {
        console.error('인기 웹툰(즐겨찾기) 조회 실패:', error);
        throw error;
    }
};

// 좋아요가 많은 웹툰 조회 API
export const getPopularByLikes = async (size: number = 10): Promise<WebtoonInfo[]> => {
    try {
        const safeSize = size <= 0 ? 10 : size;
        const response = await axios.get(`${BASE_URL}/popular/likes`, {
            params: { size: safeSize }
        });
        return response.data;
    } catch (error) {
        console.error('인기 웹툰(좋아요) 조회 실패:', error);
        throw error;
    }
};

// 봤어요가 많은 웹툰 조회 API
export const getPopularByWatched = async (size: number = 10): Promise<WebtoonInfo[]> => {
    try {
        const safeSize = size <= 0 ? 10 : size;
        const response = await axios.get(`${BASE_URL}/popular/watched`, {
            params: { size: safeSize }
        });
        return response.data;
    } catch (error) {
        console.error('인기 웹툰(봤어요) 조회 실패:', error);
        throw error;
    }
};

export const fetchWebtoonRecommendations = async (recommendationRequest: RecommendationRequest) => {
    try {
        const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('요청 시간 초과')), 10000)
        );
        
        const apiRequest = apiClient.post(
            `http://localhost:8080/api/connector/sendL_if`,
            recommendationRequest,
            {}
        );
        
        const response = await Promise.race([apiRequest, timeout]) as any;
        
        if (!response || !response.data || !Array.isArray(response.data)) {
            console.warn('추천 API 응답이 유효하지 않음:', response?.data);
            throw new Error('유효하지 않은 응답 데이터');
        }
        
        // 필터별 테스트용 로직 (실제 서버 작동 시 제거)
        if (!recommendationRequest.use_popularity && 
            !recommendationRequest.use_art_style && 
            !recommendationRequest.use_tags) {
            return response.data.slice(0, Math.floor(response.data.length * 0.2));
        } else if (!recommendationRequest.use_popularity) {
            return response.data.slice(0, Math.floor(response.data.length * 0.6));
        } else if (!recommendationRequest.use_art_style) {
            return response.data.slice(0, Math.floor(response.data.length * 0.8));
        } else if (!recommendationRequest.use_tags) {
            return response.data.slice(0, Math.floor(response.data.length * 0.7));
        }
        
        return response.data;
    } catch (error: any) {
        // API 응답이 500인 경우를 명시적으로 확인
        if (error.response && error.response.status === 500) {
            console.error('웹툰 추천 API 서버 오류(500):', error.message);
            // 서버 오류 상태를 알리기 위해 별도의 형식으로 반환
            return { error: 'SERVER_ERROR', status: 500 };
        }
        
        console.error('웹툰 추천 API 호출 중 오류:', error);
        // 다른 모든 오류에 대한 일반적인 에러 객체 반환
        return { error: 'REQUEST_FAILED', message: error.message || '알 수 없는 오류' };
    }
};
