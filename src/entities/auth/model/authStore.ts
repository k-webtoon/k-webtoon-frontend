import { create } from "zustand";
import { authApi } from "../../../app/api/authApi.tsx";
import { userApi } from "../../../app/api/userApi.ts";

interface User {
  indexId: number;
  nickname: string;
  userEmail: string;
  // 다른 사용자 속성들...
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null; // 사용자 정보 추가

  login: (userEmail: string, userPassword: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchUserInfo: () => Promise<void>; // 사용자 정보 가져오는 함수 추가
}

// 토큰 검증 함수 - 단순히 토큰 존재 여부만 확인
const validateStoredToken = (): string | null => {
  const token = localStorage.getItem("token");
  return token;
};

// 상태 초기화 함수
const initializeAuthState = () => {
  const token = validateStoredToken();
  return {
    token: token,
    isAuthenticated: !!token, // 토큰이 있으면 true, 없으면 false
    loading: false,
    error: null,
    user: null,
  };
};

const useAuthStore = create<AuthState>((set, get) => ({
  ...initializeAuthState(),

  /**
   * 사용자 로그인을 처리합니다.
   */
  login: async (userEmail: string, userPassword: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(userEmail, userPassword);
      console.log("로그인 응답:", response);

      if (response.data.token) {
        // 토큰 저장
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log("토큰 저장됨:", token);

        // 상태 업데이트
        set({
          token,
          isAuthenticated: true,
          loading: false,
          // 응답에 user 정보가 있다면 설정
          user: response.data.indexId
            ? {
                indexId: response.data.indexId,
                nickname: response.data.nickname,
                userEmail: response.data.userEmail,
              }
            : null,
        });

        // 로그인 성공 후 사용자 정보 가져오기 시도
        if (!response.data.indexId) {
          try {
            await get().fetchUserInfo();
          } catch (e) {
            console.error("로그인 후 사용자 정보 가져오기 실패:", e);
          }
        }
      } else {
        throw new Error("토큰이 없습니다");
      }
    } catch (error: any) {
      console.error("로그인 오류:", error);
      set({
        loading: false,
        error: error.response?.data?.message || "로그인에 실패했습니다.",
      });
    }
  },

  /**
   * 현재 토큰의 유효성을 검증합니다.
   */
  checkAuth: async () => {
    // 로딩 상태 설정
    set({ loading: true });

    // 로컬 스토리지에서 토큰 확인
    const storedToken = localStorage.getItem("token");
    console.log("인증 확인 시작:", { storedToken });

    // 토큰이 없으면 인증 상태 false로 설정하고 종료
    if (!storedToken) {
      console.log("토큰 없음, 인증 상태 false로 설정");
      set({ token: null, isAuthenticated: false, loading: false });
      return;
    }

    try {
      // 서버에 토큰 유효성 검증 요청
      const isValid = await authApi.validateToken(storedToken);
      console.log("토큰 검증 결과:", isValid);

      if (isValid) {
        // 토큰이 유효하면 인증 상태 true로 설정
        set({ token: storedToken, isAuthenticated: true, loading: false });
        console.log("토큰 유효함, 인증 상태 true로 설정");

        // 토큰이 유효하면 사용자 정보도 가져오기
        try {
          await get().fetchUserInfo();
        } catch (e) {
          console.error("사용자 정보 가져오기 실패:", e);
        }
      } else {
        // 토큰이 유효하지 않으면 제거하고 인증 상태 false로 설정
        localStorage.removeItem("token");
        set({ token: null, isAuthenticated: false, loading: false });
        console.log("토큰 유효하지 않음, 인증 상태 false로 설정");
      }
    } catch (error) {
      console.error("토큰 검증 중 오류:", error);
      // 오류 발생 시 토큰이 만료되었거나 서버에 문제가 있을 수 있으므로,
      // 보안을 위해 토큰을 제거하지는 않고 현재 상태를 유지합니다.
      // 단, 로딩 상태는 해제합니다.
      set({ loading: false });
    }
  },

  /**
   * 사용자 정보를 가져옵니다.
   */
  fetchUserInfo: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const userInfo = await userApi.getUserInfo();
      set({ user: userInfo, loading: false });
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      set({ loading: false });
      // 에러가 발생해도 로그아웃하지 않고 인증 상태 유지
    }
  },
}));

export default useAuthStore;
