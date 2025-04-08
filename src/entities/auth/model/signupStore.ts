import { create } from "zustand";
import { registerUser } from "@/app/api/signup";
import { UserRegisterDTO } from "./types";

interface SignupState {
  loading: boolean;
  error: string | null;
  register: (data: UserRegisterDTO) => Promise<void>;
}

export const useSignupStore = create<SignupState>((set) => ({
  loading: false,
  error: null,

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      await registerUser(userData);
      set({ loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "회원가입에 실패했습니다.",
      });
      throw error;
    }
  },
}));
