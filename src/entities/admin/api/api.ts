// src/entities/admin/api/admin.ts

import axios from 'axios';
import { DashboardSummary } from '../model/types';  

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const adminApi = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard/summary`, {
      withCredentials: true,
    });
    return response.data;
  },
  createWebtoon: async (webtoonData: any) => {
    const response = await axios.post(`${API_BASE_URL}/admin/webtoons`, webtoonData, {
      withCredentials: true,
    });
    return response.data;
  },
  updateWebtoon: async (webtoonId: any, webtoonData: any) => {
    const response = await axios.put(`${API_BASE_URL}/admin/webtoons/${webtoonId}`, webtoonData, {
      withCredentials: true,
    });
    return response.data;
  },
  deleteWebtoon: async (webtoonId: any) => {
    await axios.delete(`${API_BASE_URL}/admin/webtoons/${webtoonId}`, {
      withCredentials: true,
    });
  },
  // 다른 Admin API 호출도 여기에 추가할 수 있습니다.
};