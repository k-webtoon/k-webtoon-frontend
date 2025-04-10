import "./global.css";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";
import { useEffect } from "react";
import useAuthStore from "@/entities/auth/model/userStore.ts";
import { TrackingProvider } from "@/pages/TrackingProvider"; // 아래에 정의할 파일

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
      <TrackingProvider /> {/* 여기 추가 */}
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
