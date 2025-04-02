import { create } from 'zustand';
import { authApi } from '@/app/api/authApi.ts';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;

    login: (userEmail: string, userPassword: string) => Promise<void>;
    checkAuth: () => Promise<void>;
}

// 토큰 검증 함수 - 단순히 토큰 존재 여부만 확인
const validateStoredToken = (): string | null => {
    const token = localStorage.getItem('token');
    return token;
};

// 상태 초기화 함수
const initializeAuthState = () => {
    const token = validateStoredToken();
    return {
        token: token,
        isAuthenticated: !!token, // 토큰이 있으면 true, 없으면 false
        loading: false,
        error: null
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
            const token = await authApi.login({ userEmail, userPassword });

            // 토큰 존재 확인
            if (!token) {
                throw new Error('로그인에 실패했습니다: 토큰이 없습니다.');
            }

            // 토큰 저장
            localStorage.setItem('token', token);

            // 디버깅 정보
            console.log("로그인 성공, 토큰:", token);

            // 상태 업데이트
            set({ token, isAuthenticated: true, loading: false });

            // 업데이트된 상태 확인
            const updatedState = get();
            console.log("로그인 후 상태:", updatedState);

            return;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
            console.error('로그인 오류:', error);
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

    /**
     * 현재 토큰의 유효성을 검증합니다.
     */
    checkAuth: async () => {
        // 로딩 상태 설정
        set({ loading: true });

        // 로컬 스토리지에서 토큰 확인
        const storedToken = localStorage.getItem('token');
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
            } else {
                // 토큰이 유효하지 않으면 제거하고 인증 상태 false로 설정
                localStorage.removeItem('token');
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
    }
}));

export default useAuthStore;