import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/shared/ui/layout/Layout.tsx";
import UserLayout from "@/shared/ui/layout/UserLayout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserMain from "@/pages/user/UserMain.tsx";
import Error from "@/pages/error/Error.tsx";
import SearchBar from "@/features/search/SearchBar.tsx";

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />

      {/* 비회원 ====================== */}
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="find/password" element={<FindPassword />} />

      {/* 웹툰 */}
      <Route path="/webtoon" element={<WebtoonMain />} />
      <Route path="/webtoon/:id" element={<WebtoonDetail />} />
      <Route path="/search" element={<SearchBar />} />

      {/* 오류 */}
      <Route path="*" element={<Error />} />
    </Route>

    {/* 회원 ====================== */}

    <Route path="/mypage" element={<UserLayout />}>
      <Route index element={<Navigate to="/mypage/home" />} />
      <Route path="home" element={<UserMain />} />

      {/* 오류 */}
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
