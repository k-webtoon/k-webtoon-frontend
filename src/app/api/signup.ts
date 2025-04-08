import axios from "axios";

const BASE_URL = "http://localhost:8080";

// Axios 인스턴스 생성
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

// 회원가입 API 호출 함수
export const registerUser = async (userData: {
  userEmail: string;
  userPassword: string;
  userAge: number;
  gender: string;
  nickname: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
}) => {
  const response = await axios.post(`${BASE_URL}/api/auth/register`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
