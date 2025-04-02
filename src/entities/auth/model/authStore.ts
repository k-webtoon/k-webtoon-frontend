import { create } from "zustand";
import { authApi } from "../../../app/api/authApi.tsx";
import { userApi } from "../../../app/api/userApi.ts";

interface User {
  indexId: number;
  nickname: string;
  userEmail: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;

  login: (userEmail: string, userPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
}

const validateStoredToken = (): string | null => {
  const token = localStorage.getItem("token");
  return token;
};

const initializeAuthState = () => {
  const token = validateStoredToken();
  return {
    token: token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    user: null,
  };
};

const useAuthStore = create<AuthState>((set, get) => ({
  ...initializeAuthState(),

  login: async (userEmail: string, userPassword: string) => {
    set({ loading: true, error: null });
    try {
      const loginData = {
        userEmail,
        userPassword,
      };

      // response는 직접 JWT 토큰 문자열
      const token = await authApi.login(loginData);
      console.log("로그인 응답 토큰:", token);

      if (token) {
        localStorage.setItem("token", token);
        console.log("토큰 저장됨:", token);

        set({
          token: token,
          isAuthenticated: true,
          loading: false,
          user: null, // 초기에는 null로 설정
        });

        // 토큰 저장 후 사용자 정보 조회
        try {
          await get().fetchUserInfo();
        } catch (e) {
          console.error("로그인 후 사용자 정보 가져오기 실패:", e);
        }
      } else {
        throw new Error("서버 응답에 토큰이 없습니다.");
      }
    } catch (error: any) {
      console.error("로그인 처리 중 오류:", {
        error,
        message: error.response?.data?.message,
        status: error.response?.status,
      });

      set({
        loading: false,
        error: error.response?.data?.message || "로그인에 실패했습니다.",
        isAuthenticated: false,
        token: null,
        user: null,
      });

      throw error;
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    const storedToken = localStorage.getItem("token");
    console.log("인증 확인 시작:", { storedToken });

    if (!storedToken) {
      console.log("토큰 없음, 인증 상태 초기화");
      set({ token: null, isAuthenticated: false, loading: false, user: null });
      return;
    }

    try {
      const isValid = await authApi.validateToken(storedToken);
      console.log("토큰 검증 결과:", isValid);

      if (isValid) {
        set({ token: storedToken, isAuthenticated: true, loading: false });
        console.log("토큰 유효, 사용자 정보 조회 시작");

        try {
          await get().fetchUserInfo();
        } catch (e) {
          console.error("사용자 정보 조회 실패:", e);
          // 사용자 정보 조회 실패 시에도 인증 상태는 유지
        }
      } else {
        console.log("토큰 무효, 인증 상태 초기화");
        localStorage.removeItem("token");
        set({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("인증 확인 중 오류:", error);
      set({
        loading: false,
        error: "인증 확인 중 오류가 발생했습니다.",
      });
    }
  },

  fetchUserInfo: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const userInfo = await userApi.getUserInfo();
      console.log("사용자 정보 조회 성공:", userInfo);

      set({
        user: userInfo,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      set({
        loading: false,
        error: "사용자 정보를 가져오는데 실패했습니다.",
      });
    }
  },
}));

export default useAuthStore;
