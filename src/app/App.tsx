import "./global.css";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";
import { TrackingProvider } from "@/pages/TrackingProvider";
import { useAuthStore } from "@/entities/auth/api/store.ts";

function App() {
  const { isAuthenticated, user, initialize, fetchUserInfo } = useAuthStore();

  // 토큰으로 로그인 정보 초기화
  useEffect(() => {
    initialize();
  }, []);

  // 인증은 됐는데 user 정보 없으면 불러오기
  useEffect(() => {
    if (isAuthenticated && !user) {
//       fetchUserInfo();
    }
  }, [isAuthenticated, user]);

  return (
    <BrowserRouter>
      <TrackingProvider />
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
