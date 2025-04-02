import { create } from "zustand";
import {
  getUserInfo,
  getUserComments,
  getLikedWebtoons,
  getFollowees,
  getFollowers,
  followUser,
  unfollowUser,
} from "@/app/api/userApi.ts";
import {
  UserInfo,
  UserComment,
  LikedWebtoon,
  FollowUser,
} from "@/entities/user/model/types.ts";

interface UserState {
  // 상태
  userInfo: UserInfo | null;
  comments: UserComment[];
  likedWebtoons: LikedWebtoon[];
  followers: FollowUser[];
  followees: FollowUser[];
  loading: boolean;
  error: string | null;

  // 액션
  fetchUserInfo: (userId: number) => Promise<void>;
  fetchUserComments: (userId: number) => Promise<void>;
  fetchLikedWebtoons: (userId: number) => Promise<void>;
  fetchFollowers: (userId: number) => Promise<void>;
  fetchFollowees: (userId: number) => Promise<void>;
  followUserAction: (followerId: number, followeeId: number) => Promise<void>;
  unfollowUserAction: (followerId: number, followeeId: number) => Promise<void>;
  resetUserData: () => void;

  // 마이페이지 전용 액션
  fetchMyInfo: (userId: number) => Promise<void>;
  fetchMyLikedWebtoons: (userId: number) => Promise<void>;
  fetchMyComments: (userId: number) => Promise<void>;

  // 프로필 업데이트 액션
  setUserInfo: (userInfo: UserInfo | null) => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => Promise<void>;
  updateUserBio: (bio: string) => Promise<void>;

  // 새로운 액션
  checkFollowStatusAction: (followerId: number, followeeId: number) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  userInfo: null,
  comments: [],
  likedWebtoons: [],
  followers: [],
  followees: [],
  loading: false,
  error: null,

  // 사용자 정보 가져오기
  fetchUserInfo: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const info = await getUserInfo(userId);
      set({ userInfo: info, loading: false });
    } catch (error) {
      console.error("사용자 정보 로딩 오류:", error);
      set({
        error: "사용자 정보를 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  // 사용자 댓글 가져오기
  fetchUserComments: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const comments = await getUserComments(userId);
      set({ comments, loading: false });
    } catch (error) {
      console.error("댓글 로딩 오류:", error);
      set({ error: "댓글을 불러오는 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 좋아요한 웹툰 가져오기
  fetchLikedWebtoons: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const webtoons = await getLikedWebtoons(userId);
      set({ likedWebtoons: webtoons, loading: false });
    } catch (error) {
      console.error("좋아요한 웹툰 로딩 오류:", error);
      set({
        error: "좋아요한 웹툰을 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  // 팔로워 가져오기
  fetchFollowers: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const followers = await getFollowers(userId);
      set({ followers, loading: false });
    } catch (error) {
      console.error("팔로워 로딩 오류:", error);
      set({ error: "팔로워를 불러오는 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 팔로잉 가져오기
  fetchFollowees: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const followees = await getFollowees(userId);
      set({ followees, loading: false });
    } catch (error) {
      console.error("팔로잉 로딩 오류:", error);
      set({ error: "팔로잉을 불러오는 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 팔로우하기
  followUserAction: async (followerId: number, followeeId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`/api/follow/${followerId}/follow/${followeeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("팔로우에 실패했습니다.");
      }

      // 팔로우 상태 업데이트
      set((state) => ({
        userInfo: state.userInfo
          ? { ...state.userInfo, followerCount: (state.userInfo.followerCount || 0) + 1 }
          : null,
      }));
    } catch (error) {
      console.error("팔로우 중 오류 발생:", error);
      throw error;
    }
  },

  // 언팔로우하기
  unfollowUserAction: async (followerId: number, followeeId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`/api/follow/${followerId}/unfollow/${followeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("언팔로우에 실패했습니다.");
      }

      // 언팔로우 상태 업데이트
      set((state) => ({
        userInfo: state.userInfo
          ? { ...state.userInfo, followerCount: Math.max(0, (state.userInfo.followerCount || 0) - 1) }
          : null,
      }));
    } catch (error) {
      console.error("언팔로우 중 오류 발생:", error);
      throw error;
    }
  },

  // 상태 초기화
  resetUserData: () => {
    set({
      userInfo: null,
      comments: [],
      likedWebtoons: [],
      followers: [],
      followees: [],
      loading: false,
      error: null,
    });
  },

  // 마이페이지 전용 액션들
  fetchMyInfo: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const info = await getUserInfo(userId);
      set({ userInfo: info, loading: false });
    } catch (error) {
      console.error("내 정보 로딩 오류:", error);
      set({
        error: "내 정보를 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  fetchMyLikedWebtoons: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const webtoons = await getLikedWebtoons(userId);
      set({ likedWebtoons: webtoons, loading: false });
    } catch (error) {
      console.error("내가 좋아요한 웹툰 로딩 오류:", error);
      set({
        error: "내가 좋아요한 웹툰을 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  fetchMyComments: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const comments = await getUserComments(userId);
      set({ comments, loading: false });
    } catch (error) {
      console.error("내 댓글 로딩 오류:", error);
      set({ error: "내 댓글을 불러오는 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 프로필 업데이트 액션
  setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),

  updateUserInfo: async (userInfo: Partial<UserInfo>) => {
    try {
      // API 호출
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("프로필 업데이트에 실패했습니다.");
      }

      const updatedUserInfo = await response.json();
      set((state) => ({
        userInfo: state.userInfo ? { ...state.userInfo, ...updatedUserInfo } : null,
      }));
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      throw error;
    }
  },

  updateUserBio: async (bio: string) => {
    try {
      // TODO: API 호출 구현
      set((state) => ({
        userInfo: state.userInfo ? { ...state.userInfo, bio } : null,
      }));
    } catch (error) {
      console.error("소개 업데이트 오류:", error);
      throw error;
    }
  },

  // 새로운 액션
  checkFollowStatusAction: async (followerId: number, followeeId: number): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const response = await fetch(`/api/follow/${followerId}/status/${followeeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("팔로우 상태 확인에 실패했습니다.");
      }

      const data = await response.json();
      return data.isFollowing;
    } catch (error) {
      console.error("팔로우 상태 확인 중 오류 발생:", error);
      throw error;
    }
  },
}));
