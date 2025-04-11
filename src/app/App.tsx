import "./global.css";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth/api/store.ts";
import { TrackingProvider } from "@/pages/TrackingProvider";
import {useUserStore} from "@/entities/user/api/userStore.ts";

function App() {
  const { isAuthenticated } = useAuthStore();
  const { fetchCurrentUserInfo } = useUserStore();

  // 앱 초기화 시 사용자 정보 로드
    useEffect(() => {
        const loadUserInfo = async () => {
            if (isAuthenticated) {
                try {
                    const userInfo = await fetchCurrentUserInfo();
                    console.log('사용자 정보 로드 완료:', userInfo);
                } catch (error) {
                    console.error('사용자 정보 로드 실패:', error);
                }
            }
        };

        loadUserInfo();
    }, [isAuthenticated]);


  return (
    <BrowserRouter>
      <TrackingProvider />
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
