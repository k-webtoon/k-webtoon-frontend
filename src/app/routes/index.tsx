import { Route, Routes } from "react-router-dom";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/Signup.tsx";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserMain from "@/pages/user/UserMain.tsx";
import Search from "@/pages/search/Search.tsx";
import Error from "@/pages/error/Error.tsx";
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

            {/*<Route path=*/}
            {/* 웹툰 */}
            <Route path="/webtoon" element={<WebtoonMain />} />
            <Route path="/webtoon/:id" element={<WebtoonDetail />} />
            <Route path="/search" element={<Search />} />


            {/* 회원만 접근 가능 ====================== */}
            <Route element={<ProtectedRoute />} >
                <Route path="/mypage" element={<UserMain />} />
            </Route>

            {/* 오류 */}
            <Route path="*" element={<Error />} />

        </Route>
    </Routes>
);

export default RoutesConfig;
