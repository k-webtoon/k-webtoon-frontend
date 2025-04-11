import axios from "axios";

// API 기본 URL 설정
const FOLLOW_BASE_URL = "http://localhost:8080/api/follow";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: FOLLOW_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터를 통해 Authorization 헤더 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 팔로우 API 호출 함수
 * @param {number} followeeId - 팔로우할 사용자 ID
 */
export const followUserApi = async (followeeId: number): Promise<void> => {
  try {
    await apiClient.post(`/${followeeId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "팔로우 요청에 실패했습니다."
    );
  }
};

/**
 * 언팔로우 API 호출 함수
 * @param {number} followeeId - 언팔로우할 사용자 ID
 */
export const unfollowUserApi = async (followeeId: number): Promise<void> => {
  try {
    await apiClient.delete(`/${followeeId}/unfollow`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "언팔로우 요청에 실패했습니다."
    );
  }
};
