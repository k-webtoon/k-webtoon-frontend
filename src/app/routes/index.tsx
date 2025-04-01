import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import SearchBar from "@/features/search/ui/SearchBar.tsx";
import UserMain from "@/pages/user/UserMain.tsx";
import MyLikeWebtoon from "@/pages/user/MyLikeWebtoon.tsx";
import MyComments from "@/pages/user/MyComments.tsx";
import MyFollowers from "@/pages/user/MyFollowers.tsx";
import MyFollowees from "@/pages/user/MyFollowees.tsx";
import UserLayout from "@/pages/user/UserLayout.tsx";
import UserProfile from "@/pages/user/UserProfile.tsx";
import UserLikeWebtoon from "@/pages/user/UserLikeWebtoon.tsx";
import UserComments from "@/pages/user/UserComments.tsx";
import UserFollowers from "@/pages/user/UserFollowers.tsx";
import UserFollowees from "@/pages/user/UserFollowees.tsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";
import Error from "@/pages/error/Error.tsx";

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />

      {/* 🔓 비회원만 접근 가능 */}
      <Route element={<UnprotectedRoute />}>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="find/password" element={<FindPassword />} />
      </Route>

      {/* 🌐 웹툰 관련 */}
      <Route path="webtoon" element={<WebtoonMain />} />
      <Route path="webtoon/:id" element={<WebtoonDetail />} />
      <Route path="search" element={<SearchBar />} />

      {/* 🔐 마이페이지 (로그인 유저만) */}
      <Route path="mypage" element={<ProtectedRoute />}>
        <Route index element={<UserMain />} />
        <Route path="home" element={<UserMain />} />
        <Route path="likes" element={<MyLikeWebtoon />} />
        <Route path="comments" element={<MyComments />} />
        <Route path="followers" element={<MyFollowers />} />
        <Route path="followees" element={<MyFollowees />} />
        <Route path="*" element={<Error />} />
      </Route>

      {/* 👤 다른 유저 프로필 */}
      <Route path="user/:userId" element={<UserLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<UserProfile />} />
        <Route path="likes" element={<UserLikeWebtoon />} />
        <Route path="comments" element={<UserComments />} />
        <Route path="followers" element={<UserFollowers />} />
        <Route path="followees" element={<UserFollowees />} />
      </Route>

      {/* 🚫 잘못된 경로 */}
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
