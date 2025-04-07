import axios from "axios";
import {WebtoonPaginatedResponse} from "@/entities/webtoon/model/types.ts";

const BASE_URL = 'http://localhost:8080/api/webtoons';

// 조회수 높은 웹툰 리스트 조회 API
export const topWebtoons = async (page: number = 0, size: number = 10):Promise<WebtoonPaginatedResponse> => {
  const response = await axios.get(`${BASE_URL}/top`, {
    params: { page, size }
  });
  return response.data;
};

// 이름으로 웹툰 검색 API
export const searchWebtoons = async (titleName: string):Promise<WebtoonPaginatedResponse> => {
  const response = await axios.get(
    `${BASE_URL}/search/name?titleName=${titleName}`
  );
  return response.data;
};



