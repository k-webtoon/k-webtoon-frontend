import { create } from "zustand";
import { followUserApi, unfollowUserApi } from "@/entities/user/api/followApi.ts";

interface FollowState {
  isFollowing: boolean;
  toggleFollow: (userId: number) => Promise<void>;
}

export const useFollowStore = create<FollowState>((set) => ({
  isFollowing: false,
  toggleFollow: async (userId) => {
    set((state) => ({ ...state, isFollowing: !state.isFollowing }));

    try {
      if (!useFollowStore.getState().isFollowing) {
        await followUserApi(userId);
      } else {
        await unfollowUserApi(userId);
      }
    } catch (error) {
      console.error("팔로우/언팔로우 실패:", error);
      set((state) => ({ ...state, isFollowing: !state.isFollowing }));
    }
  },
}));
