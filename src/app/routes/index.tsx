import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute.tsx";
import UnprotectedRoute from "@/app/routes/UnprotectedRoute.tsx";
import AdminProtectedRoute from "@/app/routes/AdminProtectedRoute.tsx";
import Layout from "@/widgets/layout/ui/Layout.tsx";
import Main from "@/pages/main/Main.tsx";
import Login from "@/pages/auth/Login.tsx";
import Signup from "@/pages/auth/signup/Signup";
import FindPassword from "@/pages/auth/FindPassword.tsx";
import WebtoonMain from "@/pages/webtoon/WebtoonMain.tsx";
import WebtoonDetail from "@/pages/webtoon/WebtoonDetail.tsx";
import UserProfile from "@/pages/user/userpage/UserProfile.tsx";
import UserLikeWebtoon from "@/pages/user/userpage/UserLikeWebtoon.tsx";
import UserComments from "@/pages/user/userpage/UserComments.tsx";
import UserFollowers from "@/pages/user/userpage/UserFollowers.tsx";
import UserFollowees from "@/pages/user/userpage/UserFollowees.tsx";
import MyPage from "@/pages/user/MyPage";
import WebtoonSearchResults from "@/pages/search/WebtoonSearchResults.tsx";
import Error from "@/pages/error/Error.tsx";
import MyProfile from "@/pages/user/mypage/MyProfile";
import AdminMain from "@/pages/admin/AdminMain";
import WebtoonManagement from "@/pages/admin/WebtoonManagement";
import UserManagement from "@/pages/admin/UserManagement";
import UserStats from "@/pages/admin/user/UserStats";
import FeedbackStatus from "@/pages/admin/recommendation/FeedbackStatus";
import UserAnalysis from "@/pages/admin/visualization/UserAnalysis";
import TagManagement from "@/pages/admin/settings/TagManagement";
import TextBasedRecommendations from "@/pages/text-based-recommendations/TextBasedRecommendations.tsx";

// 임시 컴포넌트 (아직 구현되지 않은 페이지용)
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <div className="sticky top-24">
          <div className="mb-4">
            <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
              <img
                src="/images/admin-placeholder.jpg"
                alt="관리자"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mb-1">관리자</h1>
            <p className="text-gray-600 mb-4">admin@kwebtoon.com</p>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600">이 페이지는 현재 개발 중입니다.</p>
        </div>
      </div>
    </div>
  </div>
);

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
      </Route>

      {/* 👤 다른 유저 프로필 */}
      <Route path="/user/:userId">
        <Route path="profile" element={<UserProfile />} />
        <Route path="liked-webtoons" element={<UserLikeWebtoon />} />
      </Route>

      {/* 👨‍💼 관리자 페이지 ====================== */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin">
          <Route index element={<AdminMain />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="user-stats" element={<UserStats />} />
          <Route path="webtoon" element={<WebtoonManagement />} />
          <Route path="feedback" element={<FeedbackStatus />} />
          <Route
            path="algorithm"
            element={<PlaceholderComponent title="알고리즘 설정" />}
          />
          <Route
            path="accuracy"
            element={<PlaceholderComponent title="정확도 분석" />}
          />
          <Route path="visualization">
            <Route path="users" element={<UserAnalysis />} />
            <Route
              path="webtoons"
              element={<PlaceholderComponent title="웹툰 분석" />}
            />
            <Route
              path="trends"
              element={<PlaceholderComponent title="트렌드 분석" />}
            />
          </Route>
          <Route path="tags" element={<TagManagement />} />
          <Route
            path="notifications"
            element={<PlaceholderComponent title="알림 관리" />}
          />
          <Route
            path="announcements"
            element={<PlaceholderComponent title="공지사항 관리" />}
          />
        </Route>
      </Route>

      {/* 🚫 오류 */}
      <Route path="*" element={<Error />} />
    </Route>
  </Routes>
);

export default RoutesConfig;
