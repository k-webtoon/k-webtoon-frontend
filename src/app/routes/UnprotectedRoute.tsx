import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from '@/entities/auth/model/userStore.ts';

/**
 * 로그인된 사용자가 비회원 페이지(로그인, 회원가입 등)에 접근하지 못하도록 하는 라우트 가드
 * 로그인된 사용자는 메인 페이지로 리다이렉트됩니다.
 */
const UnprotectedRoute: React.FC = () => {
    const { isAuthenticated } = useUserStore();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default UnprotectedRoute;