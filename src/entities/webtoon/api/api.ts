import axios from "axios";
import {WebtoonResponse, WebtoonPaginatedResponse} from "@/entities/webtoon/model/types.ts";

const BASE_URL = 'http://localhost:8080/api/webtoons';

// 아이디로 웹툰 검색 API (단일)
export const getWebtoonById = async (id: number): Promise<WebtoonResponse> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// 단어로 웹툰 검색 API (리스트)
export const searchWebtoons = async (titleName: string): Promise<WebtoonPaginatedResponse> => {
    const response = await axios.get(
        `${BASE_URL}/search/name?titleName=${titleName}`
    );
    return response.data;
};

// 작가로 웹툰 검색 API (리스트)
export const searchWebtoonsByAuthor = async (authorName: string, page: number = 0, size: number = 10): Promise<WebtoonPaginatedResponse> => {
  const response = await axios.get(`${BASE_URL}/search/author`, {
    params: { authorName, page, size }
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




