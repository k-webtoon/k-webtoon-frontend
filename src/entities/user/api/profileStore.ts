// profileStore.ts
import { create } from "zustand";
import { updateProfileImageApi } from "@/entities/user/api/userActivityApi.ts";
import { getUserActivityInfoApi } from "@/entities/user/api/userActivityApi.ts";
import { useUserStore } from "./userStore.ts";

interface ProfileState {
  loading: boolean;
  error: string | null;
  updateProfileImage: (file: File) => Promise<void>;
}

interface UserActivityState {
  profileData: {
    profileImageUrl: string | null;
    bio: string | null;
  };
  loading: boolean;
  error: string | null;
  fetchUserActivity: (userId: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,
  error: null,

  updateProfileImage: async (file) => {
    set({ loading: true, error: null });
    try {
      const fileName = await updateProfileImageApi(file);

      // 모든 관련 스토어 동기화
      const userStore = useUserStore.getState();
      if (userStore.userInfo) {
        userStore.setUserInfo({
          ...userStore.userInfo,
          profileImageUrl: fileName,
        });
      }

      // 사용자 활동 스토어 강제 갱신
      const activityStore = useUserActivityStore.getState();
      if (userStore.userInfo?.indexId) {
        await activityStore.fetchUserActivity(userStore.userInfo.indexId);
      }

      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export const useUserActivityStore = create<UserActivityState>((set) => ({
  profileData: { profileImageUrl: null, bio: null },
  loading: false,
  error: null,

  fetchUserActivity: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserActivityInfoApi(userId);

      set({
        profileData: {
          profileImageUrl: data.profileImageUrl,
          bio: data.bio,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  },
}));
