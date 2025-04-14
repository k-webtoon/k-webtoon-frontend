import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";
import AdminProtectedRoute from "@/app/routes/AdminProtectedRoute.tsx";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/signup/Signup";
import FindPassword from "@/pages/auth/find/FindPassword.tsx";
import FindId from "@/pages/auth/find/FindId.tsx";
import Find from "@/pages/auth/find/Find";
import ResetPassword from "@/pages/auth/find/ResetPassword.tsx";
import ResetPasswordResult from "@/pages/auth/find/ResetPasswordResult.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserProfile from "@/pages/user/userpage/UserProfile.tsx";
import UserLikeWebtoon from "@/pages/user/userpage/UserLikeWebtoon.tsx";
import MyPage from "@/pages/user/MyPage";
import WebtoonSearchResults from "@/pages/webtoon-search/WebtoonSearchResults.tsx";
import Error from "@/pages/error/Error.tsx";
import MyProfile from "@/pages/user/mypage/MyProfile";
import AdminMain from "@/pages/admin/AdminMain";
import WebtoonManagement from "@/pages/admin/management/WebtoonManagement";
import UserManagement from "@/pages/admin/management/UserManagement";
import CommentManagement from "@/pages/admin/management/CommentManagement";
import UserStats from "@/pages/admin/stats/UserStats";
import WebtoonStats from "@/pages/admin/stats/WebtoonStats";
import AuthorStats from "@/pages/admin/stats/AuthorStats";
import CommentStats from "@/pages/admin/stats/CommentStats";
import FeedbackStatus from "@/pages/admin/recommendation/FeedbackStatus";
import UserAnalysis from "@/pages/admin/visualization/UserAnalysis";
import TagManagement from "@/pages/admin/settings/TagManagement";
import TextBasedRecommendations from "@/pages/webtoon-search-ai/TextBasedRecommendations.tsx";
import AIRecommendation from "@/pages/AIRecommendation/AIRecommendation";
import IdResult from "@/pages/auth/find/IdResult.tsx";
import FindIdSecurityQuestion from "@/pages/auth/find/FindIdSecurityQuestion";
import FindPasswordSecurityQuestion from "@/pages/auth/find/FindPasswordSecurityQuestion";
import AdminLayout from "@/pages/admin/common/AdminLayout";
import AdminAccessDenied from "@/pages/error/AdminAccessDenied.tsx";
import UserAccessDenied from "@/pages/error/UserAccessDenied.tsx";
import OAuthRedirect from "@/entities/auth/ui/OAuthRedirect";

// 임시 컴포넌트 (아직 구현되지 않은 페이지용)
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600">이 페이지는 현재 개발 중입니다.</p>
  </div>
);

const RoutesConfig = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />} />

      {/* 🔓 비회원만 접근 가능 ====================== */}
      <Route element={<UnprotectedRoute />}>
        <Route path="signup/*" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="auth/find" element={<Find />} />
        <Route path="auth/find/id" element={<FindId />} />
        <Route
          path="auth/find/id/security-question"
          element={<FindIdSecurityQuestion />}
        />
        <Route path="auth/find/id/result" element={<IdResult />} />
        <Route path="auth/find/password" element={<FindPassword />} />
        <Route
          path="auth/find/password/security-question"
          element={<FindPasswordSecurityQuestion />}
        />
        <Route path="auth/find/reset-password" element={<ResetPassword />} />
        <Route
          path="auth/find/reset-password/result"
          element={<ResetPasswordResult />}
        />
      </Route>

      {/* 🌐 웹툰 ====================== */}
      <Route path="/webtoon" element={<WebtoonMain />} />
      <Route path="/webtoon/:id" element={<WebtoonDetail />} />
      <Route path="/search" element={<WebtoonSearchResults />} />
      <Route
        path="/text-based-recommendations"
        element={<TextBasedRecommendations />}
      />

      {/* 🔐 회원만 접근 가능 ====================== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile" element={<MyProfile />} />
        {/* 추가적인 마이페이지 관련 라우트들 */}
        <Route path="/mypage/liked-webtoons" element={<UserLikeWebtoon />} />
        {/* 🤖 AI 추천 ====================== */}
        <Route path="/ai-recommendation" element={<AIRecommendation />} />
      </Route>

      {/* 👤 다른 유저 프로필 */}
      <Route path="/user/:userId">
        <Route path="profile" element={<UserProfile />} />
        <Route path="liked-webtoons" element={<UserLikeWebtoon />} />
      </Route>

      {/* 👨‍💼 관리자 페이지 ====================== */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminMain />} />

          {/* 관리 */}
          <Route path="management">
            <Route path="users" element={<UserManagement />} />
            <Route path="webtoons" element={<WebtoonManagement />} />
            <Route path="comments" element={<CommentManagement />} />
          </Route>

          {/* 통계 */}
          <Route path="stats">
            <Route path="users" element={<UserStats />} />
            <Route path="webtoons" element={<WebtoonStats />} />
            <Route path="authors" element={<AuthorStats />} />
            <Route path="comments" element={<CommentStats />} />
          </Route>

          {/* 분석/시각화 */}
          <Route path="visualization">
            <Route path="users" element={<UserAnalysis />} />
          </Route>

          {/* 설정 */}
          <Route path="settings">
            <Route path="tags" element={<TagManagement />} />
          </Route>

          {/* 추천 시스템 */}
          <Route path="recommendation">
            <Route path="feedback" element={<FeedbackStatus />} />
          </Route>
        </Route>
      </Route>
    </Route>

    <Route path="/oauth-redirect" element={<OAuthRedirect />} />

    {/* 🚫 오류 */}
    <Route path="not-admin" element={<AdminAccessDenied />} />
    <Route path="not-user" element={<UserAccessDenied />} />
    <Route path="*" element={<Error />} />
  </Routes>
);

export default RoutesConfig;
