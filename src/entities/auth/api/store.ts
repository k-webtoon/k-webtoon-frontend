import { create } from "zustand";
import { authApi } from "@/entities/auth/api/api.ts";
import { LoginRequest } from "@/entities/auth/model/types.ts";

interface AuthState {
    // 상태
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    // 액션
    initialize: () => void;
    login: (userEmail: string, userPassword: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // 초기 상태
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // 초기화 - 로컬 스토리지에서 토큰 복원
    initialize: () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            set({ token: storedToken, isAuthenticated: true });
        }
    },

    // 로그인
    login: async (userEmail: string, userPassword: string) => {
        set({loading: true, error: null});
        try {
            const loginData: LoginRequest = {userEmail, userPassword};
            const token = await authApi.login(loginData);
            // 토큰 존재 확인
            if (!token) {
                throw new Error('로그인에 실패했습니다');
            }
            localStorage.setItem('token', token);
            set({token, isAuthenticated: true, loading: false});
            // 업데이트된 상태 확인
            const updatedState = get();
            console.log("로그인 후 상태:", updatedState);
            return;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
            console.error('로그인 오류:', error);
            set({loading: false, error: errorMessage});
            throw new Error(errorMessage);
        }
    },

    // 로그아웃
    logout: () => {
        localStorage.removeItem('token');
        set({token: null, isAuthenticated: false, error: null});
    }
}));