import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/auth/api/store.ts';

const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated, loading, initialize } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        initialize();
        setIsChecking(false);
    }, [initialize]);

    if (isChecking || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증된 경우 자식 라우트 렌더링
    return <Outlet />;
};

export default ProtectedRoute;