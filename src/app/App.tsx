import "./global.css";
import { BrowserRouter } from "react-router-dom";
import RoutesConfig from "@/app/routes";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth/api/store.ts";
import { TrackingProvider } from "@/pages/TrackingProvider";

function App() {
    const initialize = useAuthStore(state => state.initialize);

    // 앱 초기화 시 사용자 정보 로드
    useEffect(() => {
        initialize();
    }, []);

  return (
    <BrowserRouter>
      <TrackingProvider />
      <RoutesConfig />
    </BrowserRouter>
  );
}

export default App;
