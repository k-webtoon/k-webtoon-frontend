import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '@/entities/auth/model/userStore.ts';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트입니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const { isAuthenticated, fetchUserInfo, setAuthenticated, loading } = useUserStore();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');

                if (token && userId) {
                    await fetchUserInfo(Number(userId));
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error("인증 확인 중 오류:", error);
                setAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        verifyAuth();
    }, [fetchUserInfo, setAuthenticated]);

    if (isChecking || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log("인증되지 않음, 로그인 페이지로 리다이렉트");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("인증됨, 보호된 컨텐츠 표시");
    return <Outlet />;
};

export default ProtectedRoute;