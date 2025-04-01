import { Route, Routes } from "react-router-dom";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserMain from "@/pages/user/UserMain.tsx";
import Error from "@/pages/error/Error.tsx";
import SearchBar from "@/features/search/ui/SearchBar.tsx";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";

const RoutesConfig = () => (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />

            {/* 비회원만 접근 가능 ====================== */}
            <Route element={<UnprotectedRoute />}>
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="find/password" element={<FindPassword />} />
            </Route>

            {/* 웹툰 */}
            <Route path="/webtoon" element={<WebtoonMain />} />
            <Route path="/webtoon/:id" element={<WebtoonDetail />} />
            <Route path="/search" element={<SearchBar />} />


            {/* 회원만 접근 가능 ====================== */}
            <Route element={<ProtectedRoute />} >
                <Route path="/mypage" element={<UserMain />} />
                    {/* 마이페이지 (로그인 사용자) */}
              <Route path="home" element={<UserMain />} />
              <Route path="likes" element={<MyLikeWebtoon />} />
              <Route path="comments" element={<MyComments />} />
              <Route path="followers" element={<MyFollowers />} />
              <Route path="followees" element={<MyFollowees />} />
              <Route path="*" element={<Error />} />
            </Route>

            {/* 오류 */}
            <Route path="*" element={<Error />} />
      {/* 유저 페이지 (다른 유저 프로필) */}
      {/*<Route path="user/:userId" element={<UserLayout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<UserProfile />} />
        <Route path="likes" element={<UserLikeWebtoon />} />
        <Route path="comments" element={<UserComments />} />
        <Route path="followers" element={<UserFollowers />} />
        <Route path="followees" element={<UserFollowees />} />
      </Route>*/}
        </Route>
    </Routes>
);

export default RoutesConfig;
