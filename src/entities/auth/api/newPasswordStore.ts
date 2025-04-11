import { create } from "zustand";
import { changePasswordApi } from "@/entities/auth/api/newPasswordApi.ts";

interface PasswordState {
  loading: boolean;
  error: string | null;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => Promise<void>;
}

export const usePasswordStore = create<PasswordState>((set) => ({
  loading: false,
  error: null,

  changePassword: async (data) => {
    set({ loading: true, error: null });
    try {
      await changePasswordApi(data);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error; // 컴포넌트에서 에러 처리 가능하도록 재던짐
    }
  },
}));
