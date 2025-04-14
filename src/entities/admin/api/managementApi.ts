import axios, { AxiosError } from 'axios';
import {
  UserFilterParams,
  UserListResponse,
  UserResponse,
  UpdateUserStatusRequest,
  CreateUserRequest,
  WebtoonFilterParams,
  WebtoonListResponse,
  WebtoonResponse,
  UpdateWebtoonStatusRequest,
  CreateWebtoonRequest
} from './types';

/** API 기본 URL 설정 */
const API_BASE_URL = 'http://localhost:8080/api';

/** axios 인스턴스 생성 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * - 모든 요청에 인증 토큰을 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 401 에러 발생 시 토큰 갱신 시도
 * - 토큰 갱신 실패 시 로그아웃 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // 토큰이 만료된 경우
    if (error.response?.status === 401 && originalRequest) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API 응답 타입 정의
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  stats: {
    [key: string]: number;
  };
}

interface FilterParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  genre?: string;
}

// ===== 사용자 관리 API =====

/**
 * 사용자 목록을 조회합니다.
 * @param params 필터링, 정렬, 페이지네이션 옵션
 * @returns 페이지네이션된 사용자 목록과 통계 정보
 */
export const fetchUsers = async (params: UserFilterParams): Promise<UserListResponse> => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

/**
 * 사용자의 상태를 변경합니다.
 * @param userId 사용자 ID
 * @param status 변경할 상태 정보
 */
export const updateUserStatus = async (userId: number, status: UpdateUserStatusRequest): Promise<void> => {
  await apiClient.patch(`/admin/users/${userId}/status`, status);
};

/**
 * 사용자를 삭제합니다.
 * @param userId 사용자 ID
 */
export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}`);
};

/**
 * 새로운 사용자를 생성합니다.
 * @param data 사용자 생성 정보
 * @returns 생성된 사용자 정보
 */
export const createUser = async (data: CreateUserRequest): Promise<UserResponse> => {
  const response = await apiClient.post('/admin/users', data);
  return response.data;
};

/**
 * 사용자 정보를 수정합니다.
 * @param userId 사용자 ID
 * @param data 수정할 사용자 정보
 * @returns 수정된 사용자 정보
 */
export const updateUser = async (userId: number, data: Partial<CreateUserRequest>): Promise<UserResponse> => {
  const response = await apiClient.put(`/admin/users/${userId}`, data);
  return response.data;
};

/**
 * 사용자 목록을 엑셀 파일로 내보냅니다.
 * @param params 필터링 옵션
 * @returns Blob 형태의 엑셀 파일
 */
export const exportUsersToExcel = async (params: Omit<UserFilterParams, 'page' | 'limit'>): Promise<Blob> => {
  const response = await apiClient.get('/admin/users/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
};

// ===== 웹툰 관리 API =====

/**
 * 웹툰 목록을 조회합니다.
 * @param params 필터링, 정렬, 페이지네이션 옵션
 * @returns 페이지네이션된 웹툰 목록과 통계 정보
 */
export const fetchWebtoons = async (params: WebtoonFilterParams): Promise<WebtoonListResponse> => {
  const response = await apiClient.get('/admin/webtoons', { params });
  return response.data;
};

/**
 * 웹툰의 상태를 변경합니다.
 * @param webtoonId 웹툰 ID
 * @param status 변경할 상태 정보
 */
export const updateWebtoonStatus = async (webtoonId: number, status: UpdateWebtoonStatusRequest): Promise<void> => {
  await apiClient.patch(`/admin/webtoons/${webtoonId}/status`, status);
};

/**
 * 웹툰을 삭제합니다.
 * @param webtoonId 웹툰 ID
 */
export const deleteWebtoon = async (webtoonId: number): Promise<void> => {
  await apiClient.delete(`/admin/webtoons/${webtoonId}`);
};

/**
 * 새로운 웹툰을 생성합니다.
 * @param data 웹툰 생성 정보
 * @returns 생성된 웹툰 정보
 */
export const createWebtoon = async (data: CreateWebtoonRequest): Promise<WebtoonResponse> => {
  const response = await apiClient.post('/admin/webtoons', data);
  return response.data;
};

/**
 * 웹툰 정보를 수정합니다.
 * @param webtoonId 웹툰 ID
 * @param data 수정할 웹툰 정보
 * @returns 수정된 웹툰 정보
 */
export const updateWebtoon = async (webtoonId: number, data: Partial<CreateWebtoonRequest>): Promise<WebtoonResponse> => {
  const response = await apiClient.put(`/admin/webtoons/${webtoonId}`, data);
  return response.data;
};

/**
 * 웹툰 목록을 엑셀 파일로 내보냅니다.
 * @param params 필터링 옵션
 * @returns Blob 형태의 엑셀 파일
 */
export const exportWebtoonsToExcel = async (params: Omit<WebtoonFilterParams, 'page' | 'limit'>): Promise<Blob> => {
  const response = await apiClient.get('/admin/webtoons/export', {
    params,
    responseType: 'blob'
  });
  return response.data;
};