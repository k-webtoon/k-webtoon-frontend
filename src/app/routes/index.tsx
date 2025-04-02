import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserProfile from "@/pages/user/userpage/UserProfile.tsx";
import UserLikeWebtoon from "@/pages/user/userpage/UserLikeWebtoon.tsx";
import UserComments from "@/pages/user/userpage/UserComments.tsx";
import UserFollowers from "@/pages/user/userpage/UserFollowers.tsx";
import UserFollowees from "@/pages/user/userpage/UserFollowees.tsx";
import MyPage from "@/pages/user/MyPage";
import Search from "@/pages/search/Search.tsx";
import Error from "@/pages/error/Error.tsx";
import MyProfile from "@/pages/user/mypage/MyProfile";

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />

      {/* 🔓 비회원만 접근 가능 ====================== */}
      <Route element={<UnprotectedRoute />}>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="find/password" element={<FindPassword />} />
      </Route>

      {/* 🌐 웹툰 */}
      <Route path="/webtoon" element={<WebtoonMain />} />
      <Route path="/webtoon/:id" element={<WebtoonDetail />} />
      <Route path="/search" element={<Search />} />

      {/* 🔐 회원만 접근 가능 ====================== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile" element={<MyProfile />} />
        {/* 추가적인 마이페이지 관련 라우트들 */}
        <Route path="/mypage/liked-webtoons" element={<UserLikeWebtoon />} />
        <Route path="/mypage/comments" element={<UserComments />} />
        <Route path="/mypage/followers" element={<UserFollowers />} />
        <Route path="/mypage/followees" element={<UserFollowees />} />
      </Route>

      {/* 👤 다른 유저 프로필 */}
      <Route path="/user/:userId">
        <Route path="profile" element={<UserProfile />} />
        <Route path="comments" element={<UserComments />} />
        <Route path="followees" element={<UserFollowees />} />
        <Route path="followers" element={<UserFollowers />} />
        <Route path="liked-webtoons" element={<UserLikeWebtoon />} />
      </Route>

      {/* 🚫 오류 */}
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
