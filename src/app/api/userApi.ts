import axios from "axios";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types.ts";
import { LoginDTO } from "@/entities/auth/model/types.ts";

const USER_BASE_URL = "http://localhost:8080/api/user";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: USER_BASE_URL,
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      const message =
        error.response.data?.message || "알 수 없는 오류가 발생했습니다.";

      if (status === 401) {
        // 인증 오류 처리
        localStorage.removeItem("token"); // 토큰 제거
        window.location.href = "/login"; // 로그인 페이지로 강제 이동
      }

      throw {
        name: "ApiError",
        message,
        status,
        stack: error.stack,
      };
    }
    throw error;
  }
);

// 사용자 정보 조회
export const getUserInfo = async (userId: number): Promise<UserInfo> => {
  const response = await apiClient.get(`${USER_BASE_URL}/${userId}/info`);
  return response.data;
};

// 사용자가 작성한 댓글 조회
export const getUserComments = async (
  userId: number
): Promise<UserComment[]> => {
  const response = await apiClient.get(`${USER_BASE_URL}/${userId}/comments`);
  return response.data;
};

// 사용자가 좋아요한 웹툰 조회
export const getLikedWebtoons = async (
  userId: number
): Promise<LikedWebtoon[]> => {
  const response = await apiClient.get(
    `${USER_BASE_URL}/${userId}/liked-webtoons`
  );
  return response.data;
};

// 사용자가 팔로우하는 사용자 목록 조회
export const getFollowees = async (userId: number): Promise<FollowUser[]> => {
  const response = await apiClient.get(`${USER_BASE_URL}/${userId}/followees`);
  return response.data;
};

// 사용자를 팔로우하는 사용자 목록 조회
export const getFollowers = async (userId: number): Promise<FollowUser[]> => {
  const response = await apiClient.get(`${USER_BASE_URL}/${userId}/followers`);
  return response.data;
};

// 사용자 팔로우 기능
export const followUser = async (
  followerId: number,
  followeeId: number
): Promise<void> => {
  await apiClient.post(`${USER_BASE_URL}/follow`, { followerId, followeeId });
};

// 사용자 언팔로우 기능
export const unfollowUser = async (
  followerId: number,
  followeeId: number
): Promise<void> => {
  await apiClient.post(`${USER_BASE_URL}/unfollow`, { followerId, followeeId });
};

// 사용자 관련 API
export const userApi = {
  /**
   * 이메일과 비밀번호로 로그인합니다.
   * @param {LoginDTO} loginData - 이메일과 비밀번호 정보
   * @returns {Promise<string>} - JWT 토큰
   */
  login: async (loginData: LoginDTO): Promise<string> => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/login`,
        loginData
      );
      return response.data;
    } catch (error) {
      console.error("로그인 오류:", error);
      throw error;
    }
  },

  /**
   * 토큰의 유효성을 검증합니다.
   * @param {string} token - 검증할 JWT 토큰
   * @returns {Promise<boolean>} - 토큰 유효 여부
   */
  validateToken: async (token: string): Promise<boolean> => {
    try {
      // 토큰 구조 확인 (JWT는 3개 부분으로 나뉘어져 있음)
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return false;
      }
      // 토큰의 페이로드(payload) 디코딩
      const payload = JSON.parse(atob(tokenParts[1]));
      // 만료 시간 확인
      if (payload.exp) {
        const expTime = payload.exp * 1000; // JWT는 초 단위, JS는 밀리초 단위
        const currentTime = Date.now();
        // 만료되지 않았으면 유효한 것으로 간주
        return expTime > currentTime;
      }
      return true;
    } catch (error) {
      console.error("토큰 검증 오류:", error);
      return false;
    }
  },

  /**
   * 현재 로그인한 사용자 정보를 가져옵니다.
   */
  getUserInfo: async () => {
    try {
      const response = await apiClient.get(`${USER_BASE_URL}/me`);
      return response.data;
    } catch (error: any) {
      console.error("사용자 정보 가져오기 실패:", error);
      throw {
        name: "UserApiError",
        message:
          error.response?.data?.message ||
          "사용자 정보를 가져오는데 실패했습니다.",
        status: error.response?.status,
        stack: error.stack,
      };
    }
  },

  /**
   * ID로 사용자 정보를 가져옵니다.
   */
  getUserById: async (userId: number) => {
    if (!userId || isNaN(userId)) {
      throw new Error("유효하지 않은 사용자 ID입니다.");
    }
    try {
      const response = await apiClient.get(`${USER_BASE_URL}/${userId}/info`);
      return response.data;
    } catch (error: any) {
      console.error(`사용자(ID: ${userId}) 정보 가져오기 실패:`, error);
      throw {
        name: "UserApiError",
        message:
          error.response?.data?.message ||
          "사용자 정보를 가져오는데 실패했습니다.",
        status: error.response?.status,
        stack: error.stack,
      };
    }
  },

  /**
   * 회원가입 기능
   */
  register: async (userData: {
    userEmail: string;
    userPassword: string;
    nickname: string;
  }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/register`,
        userData
      );
      console.log("회원가입 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get(`${USER_BASE_URL}/me`);
      return response.data;
    } catch (error: any) {
      console.error("현재 사용자 정보 가져오기 실패:", error);
      throw {
        name: "UserApiError",
        message:
          error.response?.data?.message ||
          "사용자 정보를 가져오는데 실패했습니다.",
        status: error.response?.status,
        stack: error.stack,
      };
    }
  },
};
