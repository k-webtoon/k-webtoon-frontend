import { create } from "zustand";
import { getBioApi, updateBioApi } from "@/app/api/userActivityApi";

interface BioState {
  bio: string | null;
  loading: boolean;
  error: string | null;
  fetchBio: (userId: string) => Promise<void>;
  updateBio: (userId: string, newBio: string) => Promise<void>;
}

export const useBioStore = create<BioState>((set) => ({
  bio: null,
  loading: false,
  error: null,

  fetchBio: async (userId) => {
    try {
      set({ loading: true, error: null });
      const bio = await getBioApi(Number(userId));
      set({ bio });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateBio: async (newBio: string) => {
    try {
      set({ loading: true, error: null });
      await updateBioApi(newBio); // userId 파라미터 제거
      set({ bio: newBio });
    } catch (error: any) {
      // 에러 처리
    } finally {
      set({ loading: false });
    }
  },
}));
