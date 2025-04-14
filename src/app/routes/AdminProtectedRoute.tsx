import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/entities/auth/api/store.ts';

// 관리자 페이지를 보호하는 라우트 가드
// 관리자가 아닌 모든 사용자는 not-admin 페이지로 리다이렉트됩니다.
const AdminProtectedRoute = () => {
  const location = useLocation();
  const { getUserInfo, initialize, isAuthenticated } = useAuthStore();
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

  const userInfo = getUserInfo();
  console.log('라우트 검사:', {
    isAuthenticated,
    userInfo,
    role: userInfo?.role,
    isAdmin: userInfo?.role === 'ADMIN'
  });

  // 관리자가 아닌 경우(로그인하지 않았거나 권한이 없는 경우 모두) not-admin 페이지로 리다이렉트
  if (!userInfo || userInfo.role !== 'ADMIN') {
    console.log('관리자 권한 없음:', { 인증여부: !!userInfo, 역할: userInfo?.role });
    return <Navigate to="/not-admin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;