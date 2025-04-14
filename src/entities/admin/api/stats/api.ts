import axios from 'axios';
import { 
  UserStatsResponse, 
  WebtoonStatsResponse, 
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
    const response = await api.get('/api/admin/stats/users', { params });
    console.log('사용자 통계 응답:', response.data);
    return { ...response, data: statsMapper.toUserStats(response.data) };
  },

  // 웹툰 통계 조회
  getWebtoonStats: async (params: StatsParams) => {
    const response = await api.get('/api/admin/stats/webtoons', { params });
    console.log('웹툰 통계 응답:', response.data);
    return { ...response, data: statsMapper.toWebtoonStats(response.data) };
  },

  // 댓글 통계 조회
  getCommentStats: async (params: StatsParams) => {
    const response = await api.get('/api/admin/stats/comments', { params });
    console.log('댓글 통계 응답:', response.data);
    return { ...response, data: statsMapper.toCommentStats(response.data) };
  }
}; 