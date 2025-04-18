import axios from 'axios';
import { 
  UserStatsResponse,
  AgeDistributionDto,
  GenderRatioDto,
  GenderAgeActivityDto,
  UserStatusRatioDto,
  DailySignupDto
} from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송 허용
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // 토큰 로깅
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
  (response) => {
    console.log('Response:', response); // 응답 로깅
    return response;
  },
  (error) => {
    console.error('Response error:', error.response || error); // 에러 로깅
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 에러 처리 헬퍼 함수
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    console.error('Error response:', error.response.data);
    throw new Error(error.response.data.message || '서버에서 오류가 발생했습니다');
  } else if (error.request) {
    console.error('Error request:', error.request);
    throw new Error('서버에 연결할 수 없습니다');
  } else {
    console.error('Error message:', error.message);
    throw new Error('알 수 없는 오류가 발생했습니다');
  }
};

export const userStatsApi = {
  getTotalUserCount: async () => {
    try {
      const response = await api.get<number>('/api/admin/stats/users/count');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getAgeDistribution: async () => {
    try {
      const response = await api.get<AgeDistributionDto[]>('/api/admin/stats/users/age-distribution');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getGenderDistribution: async () => {
    try {
      const response = await api.get<GenderRatioDto[]>('/api/admin/stats/users/gender-distribution');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getGenderAgeActivity: async () => {
    try {
      const response = await api.get<GenderAgeActivityDto[]>('/api/admin/stats/users/gender-age-activity');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getUserStatusRatio: async () => {
    try {
      const response = await api.get<UserStatusRatioDto[]>('/api/admin/stats/users/status-ratio');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
  
  getDailySignups: async () => {
    try {
      const response = await api.get<DailySignupDto[]>('/api/admin/stats/users/daily-signups');
      return response;
    } catch (error) {
      handleApiError(error);
    }
  },
}; 