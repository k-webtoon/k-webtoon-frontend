import { FC, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '@/entities/auth/model/userStore';

/**
 * 관리자 페이지를 보호하는 컴포넌트입니다.
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
const AdminProtectedRoute: FC = () => {
  const location = useLocation();
  const { isAuthenticated, userInfo, checkAuth } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 인증되지 않았거나 관리자가 아닌 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated || !userInfo || userInfo.userRole !== 'ADMIN') {
    console.log('접근 거부:', { isAuthenticated, userRole: userInfo?.userRole });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute; 