import axios from "axios";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types.ts";

const BASE_URL = "http://localhost:8080/api/user";

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

// 사용자 정보 조회
export const getUserInfo = async (userId: number): Promise<UserInfo> => {
  const response = await apiClient.get(`/${userId}/info`);
  return response.data;
};

// 사용자가 작성한 댓글 조회
export const getUserComments = async (
  userId: number
): Promise<UserComment[]> => {
  const response = await apiClient.get(`/${userId}/comments`);
  return response.data;
};

// 사용자가 좋아요한 웹툰 조회
export const getLikedWebtoons = async (
  userId: number
): Promise<LikedWebtoon[]> => {
  const response = await apiClient.get(`/${userId}/liked-webtoons`);
  return response.data;
};

// 사용자가 팔로우하는 사용자 목록 조회
export const getFollowees = async (userId: number): Promise<FollowUser[]> => {
  const response = await apiClient.get(`/${userId}/followees`);
  return response.data;
};

// 사용자를 팔로우하는 사용자 목록 조회
export const getFollowers = async (userId: number): Promise<FollowUser[]> => {
  const response = await apiClient.get(`/${userId}/followers`);
  return response.data;
};

// 사용자 팔로우 기능
export const followUser = async (
  followerId: number,
  followeeId: number
): Promise<void> => {
  await apiClient.post(`/follow`, { followerId, followeeId });
};

// 사용자 언팔로우 기능
export const unfollowUser = async (
  followerId: number,
  followeeId: number
): Promise<void> => {
  await apiClient.post(`/unfollow`, { followerId, followeeId });
};

export const userApi = {
  /**
   * 현재 로그인한 사용자 정보를 가져옵니다.
   */
  getUserInfo: async () => {
    try {
      // 생성한 apiClient 인스턴스 사용 (토큰이 자동 추가됨)
      const response = await apiClient.get("/me");
      console.log("사용자 정보 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      throw error;
    }
  },

  /**
   * ID로 사용자 정보를 가져옵니다.
   */
  getUserById: async (userId: number) => {
    try {
      // 기존 apiClient 사용
      return await getUserInfo(userId);
    } catch (error) {
      console.error(`사용자(ID: ${userId}) 정보 가져오기 실패:`, error);
      throw error;
    }
  },
};
