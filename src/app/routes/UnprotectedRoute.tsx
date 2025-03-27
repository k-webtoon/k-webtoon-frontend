import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from '@/entities/auth/model/authStore.ts';

/**
 * 로그인된 사용자가 비회원 페이지(로그인, 회원가입 등)에 접근하지 못하도록 하는 라우트 가드
 * 로그인된 사용자는 메인 페이지로 리다이렉트됩니다.
 */
const UnprotectedRoute = () => {
    const { isAuthenticated } = useAuthStore(); // 사용자 인증 상태 확인 훅(구현에 맞게 수정 필요)

    // 로그인된 사용자는 메인 페이지로 리다이렉트
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 비로그인 사용자는 하위 라우트로 접근 허용
    return <Outlet />;
};

export default UnprotectedRoute;