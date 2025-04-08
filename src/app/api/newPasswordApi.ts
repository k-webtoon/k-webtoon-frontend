import axios from "axios";

// API 기본 URL 설정
const AUTH_BASE_URL = "http://localhost:8080/api/auth";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: AUTH_BASE_URL,
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
 * 비밀번호 변경 API 호출 함수
 * @param {Object} data - 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인
 * @returns {Promise<string>} - 성공 메시지 반환
 */
export const changePasswordApi = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<string> => {
  try {
    const response = await apiClient.post("/new-password", data);
    return response.data; // 성공 메시지 반환
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "비밀번호 변경에 실패했습니다."
    );
  }
};
