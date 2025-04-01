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
      set({
        error: "팔로워를 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
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
      set({
        error: "팔로잉을 불러오는 중 오류가 발생했습니다.",
        loading: false,
      });
    }
  },

  // 팔로우 액션
  followUserAction: async (followerId: number, followeeId: number) => {
    set({ loading: true, error: null });
    try {
      await followUser(followerId, followeeId);
      set((state) => ({
        loading: false,
        // 팔로워 목록 업데이트 (본인이 팔로우한 경우)
        followers:
          followeeId === state.userInfo?.indexId
            ? [
                ...state.followers,
                {
                  indexId: followerId,
                  userEmail: "", // API에서 반환되지 않으면 빈 문자열로 설정
                  nickname: "", // API에서 반환되지 않으면 빈 문자열로 설정
                },
              ]
            : state.followers,
      }));
    } catch (error) {
      console.error("팔로우 오류:", error);
      set({ error: "팔로우 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 언팔로우 액션
  unfollowUserAction: async (followerId: number, followeeId: number) => {
    set({ loading: true, error: null });
    try {
      await unfollowUser(followerId, followeeId);
      set((state) => ({
        loading: false,
        // 팔로워 목록 업데이트 (본인이 언팔로우한 경우)
        followers:
          followeeId === state.userInfo?.indexId
            ? state.followers.filter(
                (follower) => follower.indexId !== followerId
              )
            : state.followers,
      }));
    } catch (error) {
      console.error("언팔로우 오류:", error);
      set({ error: "언팔로우 중 오류가 발생했습니다.", loading: false });
    }
  },

  // 사용자 데이터 초기화
  resetUserData: () => {
    set({
      userInfo: null,
      comments: [],
      likedWebtoons: [],
      followers: [],
      followees: [],
      error: null,
    });
  },
}));
