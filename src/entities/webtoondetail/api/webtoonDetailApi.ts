import axios from "axios";
import {
  WebtoonDetail,
  Comment,
  CommentRequest,
  CommentPageResponse,
} from "@/entities/webtoondetail/model/types.ts";

const BASE_URL = "http://localhost:8080";

// Axios 인스턴스 생성 (공통 설정)
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터를 통해 Authorization 헤더 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 JWT 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getWebtoonDetail = async (id: number): Promise<WebtoonDetail> => {
  const response = await apiClient.get(`/api/webtoons/${id}`);
  return response.data;
};

// 댓글 관련 API
export const commentApi = {
  // 웹툰의 댓글 목록 조회 (페이지네이션)
  getComments: async (
    webtoonId: number,
    page: number = 0,
    size: number = 10
  ): Promise<CommentPageResponse> => {
    const response = await apiClient.get(`/api/comments/${webtoonId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getBestComments: async (webtoonId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/api/comments/best/${webtoonId}`);
    return response.data;
  },

  // 댓글 작성
  addComment: async (
    webtoonId: number,
    requestDto: CommentRequest
  ): Promise<Comment> => {
    const response = await apiClient.post(
      `/api/comments/${webtoonId}`,
      requestDto
    );
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/api/comments/${id}`);
    return response.data;
  },

  // 댓글 좋아요
  likeComment: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/api/comments/${id}/like`);
    return response.data;
  },

  // 댓글 좋아요 취소
  unlikeComment: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/api/comments/${id}/unlike`);
    return response.data;
  },
};
