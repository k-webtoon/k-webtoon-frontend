import axios from 'axios';
import { 
  UserStatsResponse, 
  WebtoonStatsResponse, 
  AuthorStatsResponse, 
  CommentStatsResponse,
  StatsParams   
} from './types';
import { statsMapper } from './mapper';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const statsApi = {
  // 사용자 통계 조회
  getUserStats: async (params: StatsParams) => {
    const response = await api.get('/admin/stats/users', { params });
    return { ...response, data: statsMapper.toUserStats(response.data) };
  },

  // 웹툰 통계 조회
  getWebtoonStats: async (params: StatsParams) => {
    const response = await api.get('/admin/stats/webtoons', { params });
    return { ...response, data: statsMapper.toWebtoonStats(response.data) };
  },

  // 작가 통계 조회
  getAuthorStats: async (params: StatsParams) => {
    const response = await api.get('/admin/stats/authors', { params });
    return { ...response, data: statsMapper.toAuthorStats(response.data) };
  },

  // 댓글 통계 조회
  getCommentStats: async (params: StatsParams) => {
    const response = await api.get('/admin/stats/comments', { params });
    return { ...response, data: statsMapper.toCommentStats(response.data) };
  }
}; 