import { useEffect, useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from '@/entities/auth/api/store.ts';

// 로그인된 사용자가 비회원 페이지(로그인, 회원가입 등)에 접근하지 못하도록 하는 라우트 가드
const UnprotectedRoute = () => {
    const { isAuthenticated, initialize } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // 컴포넌트 마운트 시 인증 초기화 확인
        initialize();
        setIsChecking(false);
    }, [initialize]);

    // 인증 상태 확인 중에는 로딩 표시
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 로그인된 사용자는 메인 페이지로 리다이렉트
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // 비로그인 사용자는 하위 라우트로 접근 허용
    return <Outlet />;
};

export default UnprotectedRoute;