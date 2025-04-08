import { create } from "zustand";
import { updateProfileImageApi } from "@/app/api/userActivityApi";
import { getUserActivityInfoApi } from "@/app/api/userActivityApi";

interface ProfileState {
  loading: boolean;
  error: string | null;
  updateProfileImage: (file: File) => Promise<void>;
}

interface UserActivityState {
  profileData: {
    profileImagePath: string | null;
    bio: string | null;
  } | null;
  loading: boolean;
  error: string | null;
  fetchUserActivity: (userId: number) => Promise<void>;
}

// 프로필 사진 올리기
export const useProfileStore = create<ProfileState>((set) => ({
  loading: false,
  error: null,

  updateProfileImage: async (file) => {
    set({ loading: true, error: null });
    try {
      await updateProfileImageApi(file);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export const useUserActivityStore = create<UserActivityState>((set) => ({
  profileData: null,
  loading: false,
  error: null,

  fetchUserActivity: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await getUserActivityInfoApi(userId);
      set({
        profileData: {
          profileImagePath: data.profileImagePath,
          bio: data.bio,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },
}));
