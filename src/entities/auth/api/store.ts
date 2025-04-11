import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { authApi } from "@/entities/auth/api/api.ts";
import {
    AuthState,
    JwtPayload,
    LoginRequest,
    UserInfo
} from "@/entities/auth/model/types.ts";

export const useAuthStore = create<AuthState>((set, get) => ({
    token: null,
    userInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // 초기화 - 로컬 스토리지에서 토큰 복원
    initialize: () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                // 토큰 만료 여부 확인
                const decoded = jwtDecode<JwtPayload>(storedToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    // 토큰이 유효한 경우
                    const userInfo: UserInfo = {
                        email: decoded.sub,
                        role: decoded.role,
                        userId: decoded.id
                    };
                    set({ token: storedToken, userInfo, isAuthenticated: true });
                } else {
                    // 토큰이 만료된 경우
                    localStorage.removeItem('token');
                }
            } catch (error) {
                // 토큰 디코딩 실패
                console.error('토큰 디코딩 오류:', error);
                localStorage.removeItem('token');
            }
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

            try {
                // 토큰 디코딩
                const decoded = jwtDecode<JwtPayload>(token);
                const userInfo: UserInfo = {
                    email: decoded.sub,
                    role: decoded.role,
                    userId: decoded.id
                };

                localStorage.setItem('token', token);
                set({token, userInfo, isAuthenticated: true, loading: false});

                // 업데이트된 상태 확인
                const updatedState = get();
                console.log("로그인 후 상태:", updatedState);
            } catch (error) {
                console.error('토큰 디코딩 오류:', error);
                throw new Error('유효하지 않은 토큰입니다');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || '로그인에 실패했습니다.';
            console.error('로그인 오류:', error);
            set({loading: false, error: errorMessage});
            throw new Error(errorMessage);
        }
    },

    // 유저 정보 가져오기
    getUserInfo: () => {
        const { token, userInfo } = get();

        // 이미 디코딩된 유저 정보가 있으면 반환
        if (userInfo) return userInfo;

        // 토큰은 있지만 유저 정보가 없는 경우 디코딩
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                const newUserInfo: UserInfo = {
                    email: decoded.sub,
                    role: decoded.role,
                    userId: decoded.id
                };

                // 상태 업데이트
                set({ userInfo: newUserInfo });
                return newUserInfo;
            } catch (error) {
                console.error('토큰 디코딩 오류:', error);
                return null;
            }
        }

        return null;
    },

    // 로그아웃
    logout: () => {
        localStorage.removeItem('token');
        set({token: null, userInfo: null, isAuthenticated: false, error: null});
    }
}));