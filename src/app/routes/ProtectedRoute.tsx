import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/auth/api/store.ts';

// 인증된 사용자만 접근할 수 있는 페이지를 보호하는 라우트 가드
const ProtectedRoute = () => {
    const location = useLocation();
    const { isAuthenticated, initialize } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        initialize();
        setIsChecking(false);
    }, [initialize]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        return <Navigate to="/not-user" state={{ from: location }} replace />;
    }

    // 인증된 경우 하위 라우트로 접근 허용
    return <Outlet />;
};

export default ProtectedRoute;