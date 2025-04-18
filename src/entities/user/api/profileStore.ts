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

// 상태 갱신 로직 분리
const updateUserStoreProfile = (fileName: string) => {
  const userStore = useUserStore.getState();
  if (userStore.userInfo) {
    userStore.setUserInfo({
      ...userStore.userInfo,
      profileImageUrl: fileName,
    });
  }
};

export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,
  error: null,

  updateProfileImage: async (file) => {
    set({ loading: true, error: null });
    try {
      const fileName = await updateProfileImageApi(file);
      updateUserStoreProfile(fileName); // 동기적 업데이트
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
