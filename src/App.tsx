import "./global.css";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";
import { useEffect } from "react";
import useAuthStore from "@/entities/auth/model/authStore.ts";

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