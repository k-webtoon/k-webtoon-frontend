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

// AI 취향 분석 기반 웹툰 추천 API
export const fetchWebtoonRecommendations = async (recommendationRequest: RecommendationRequest) => {
    console.log('API 요청 보내는 중:', recommendationRequest);
    try {
        const response = await apiClient.post(
            `http://localhost:8080/api/connector/sendL_if`,
            recommendationRequest,
            {}
        );
        console.log('API 응답 받음, 데이터 길이:', response.data?.length || '없음');
        
        // 필터에 따라 다른 결과를 시뮬레이션 (실제 서버 응답이 문제라면)
        // 이 부분은 테스트용이며, 실제 서버가 작동하면 제거해야 합니다
        if (!recommendationRequest.use_popularity && 
            !recommendationRequest.use_art_style && 
            !recommendationRequest.use_tags) {
            // 모든 필터가 꺼져 있으면 데이터의 20%만 반환 (테스트용)
            console.log('모든 필터가 꺼져 있어 축소된 데이터 반환함 (테스트용)');
            return response.data.slice(0, Math.floor(response.data.length * 0.2));
        } else if (!recommendationRequest.use_popularity) {
            // 유사 팬층 필터가 꺼져 있으면 60% 반환
            console.log('유사 팬층 필터가 꺼져 있어 축소된 데이터 반환함 (테스트용)');
            return response.data.slice(0, Math.floor(response.data.length * 0.6));
        } else if (!recommendationRequest.use_art_style) {
            // 유사 그림체 필터가 꺼져 있으면 80% 반환
            console.log('유사 그림체 필터가 꺼져 있어 축소된 데이터 반환함 (테스트용)');
            return response.data.slice(0, Math.floor(response.data.length * 0.8));
        } else if (!recommendationRequest.use_tags) {
            // 유사 특징 필터가 꺼져 있으면 70% 반환
            console.log('유사 특징 필터가 꺼져 있어 축소된 데이터 반환함 (테스트용)');
            return response.data.slice(0, Math.floor(response.data.length * 0.7));
        }
        
        return response.data;
    } catch (error) {
        console.error('웹툰 추천 API 호출 중 오류:', error);
        throw error;
    }
};
