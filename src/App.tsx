import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@/entities/session';
import RoutesConfig from '@/app/routes';

function App() {
  const { isAuthenticated, user, fetchUserInfo } = useAuthStore();

  // 앱 초기화 시 사용자 정보 로드
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUserInfo();
    }
  }, []);

  return (
    <BrowserRouter>
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App; 