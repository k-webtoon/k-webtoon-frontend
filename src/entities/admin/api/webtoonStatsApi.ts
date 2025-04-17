import axios from 'axios';
import { WebtoonStatsResponse } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const webtoonStatsApi = {
  getTotalCount: async () => {
    const response = await api.get<number>('/api/admin/stats/webtoons/count');
    return response.data;
  },

  getGenreDistribution: async () => {
    const response = await api.get<Record<string, number>>('/api/admin/stats/webtoons/genre-distribution');
    return response.data;
  },

  getOsmuRatio: async () => {
    const response = await api.get<Record<string, number>>('/api/admin/stats/webtoons/osmu-ratio');
    return response.data;
  },

  getScoreStats: async () => {
    const response = await api.get<Record<string, number>>('/api/admin/stats/webtoons/score-stats');
    return response.data;
  },

  getCommentCount: async () => {
    const response = await api.get<number>('/api/admin/stats/webtoons/comments/count');
    return response.data;
  },

  getDeletedCommentRatio: async () => {
    const response = await api.get<number>('/api/admin/stats/webtoons/comments/deleted-ratio');
    return response.data;
  },
}; 