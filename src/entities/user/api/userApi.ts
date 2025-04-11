import axios from "axios";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types.ts";

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

// 현재 로그인한 사용자 정보 조회
export const getCurrentUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await apiClient.get(`${USER_BASE_URL}/me`);
    return response.data;
  } catch (error) {
    console.error('현재 사용자 정보 가져오기 실패:', error);
    throw error;
  }
};

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
    `http://localhost:8080/api/webtoons/reviews/${userId}/likes`
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