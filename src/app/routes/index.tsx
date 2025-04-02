import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import SearchBar from "@/features/search/ui/SearchBar.tsx";
import UserMain from "@/pages/user/mypage/UserMain.tsx";
import MyLikeWebtoon from "@/pages/user/mypage/MyLikeWebtoon.tsx";
import MyComments from "@/pages/user/mypage/MyComments.tsx";
import MyFollowers from "@/pages/user/mypage/MyFollowers.tsx";
import MyFollowees from "@/pages/user/mypage/MyFollowees.tsx";
import UserProfile from "@/pages/user/userpage/UserProfile.tsx";
import UserLikeWebtoon from "@/pages/user/userpage/UserLikeWebtoon.tsx";
import UserComments from "@/pages/user/userpage/UserComments.tsx";
import UserFollowers from "@/pages/user/userpage/UserFollowers.tsx";
import UserFollowees from "@/pages/user/userpage/UserFollowees.tsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";
import Error from "@/pages/error/Error.tsx";
import MyPage from "@/pages/user/MyPage";
import { MyProfile } from "@/pages/user/mypage/MyProfile";

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
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile" element={<MyProfile />} />
      </Route>

      {/* 👤 다른 유저 프로필 */}
      <Route path="/user/:userId">
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="comments" element={<UserComments />} />
        <Route path="followees" element={<UserFollowees />} />
        <Route path="followers" element={<UserFollowers />} />
        <Route path="liked-webtoons" element={<UserLikeWebtoon />} />
      </Route>

      {/* 🚫 잘못된 경로 */}
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
