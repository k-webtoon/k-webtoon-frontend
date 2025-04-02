import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/entities/auth/model/userStore.ts';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트입니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const { loading, checkAuth } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth();
                console.log("인증 확인 완료:", useAuthStore.getState());
            } catch (error) {
                console.error("인증 확인 중 오류:", error);
            } finally {
                setIsChecking(false);
            }
        };
        verifyAuth();
    }, [checkAuth]);

    // 인증 확인 중이거나 애플리케이션 로딩 중인 경우
    if (isChecking || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 최신 상태 직접 확인
    const currentState = useAuthStore.getState();
    console.log("현재 인증 상태:", {
        isAuthenticated: currentState.isAuthenticated,
        token: currentState.token,
        storageToken: localStorage.getItem('token')
    });

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!currentState.isAuthenticated) {
        console.log("인증되지 않음, 로그인 페이지로 리다이렉트");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 인증된 경우 자식 라우트 렌더링
    console.log("인증됨, 보호된 컨텐츠 표시");
    return <Outlet />;
};

export default ProtectedRoute;