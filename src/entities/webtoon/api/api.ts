import axios from "axios";
import {
    WebtoonResponse, 
    WebtoonPaginatedResponse,
    WebtoonInfo
} from "@/entities/webtoon/model/types";

const BASE_URL = 'http://localhost:8080/api/webtoons';

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

