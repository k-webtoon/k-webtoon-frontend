import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserStore } from "@/entities/user/api/userStore.ts";
import {
  UserInfo,
  LikedWebtoon,
} from "@/entities/user/model/types";
import { WebtoonInfo } from "@/entities/webtoon/model/types.ts";
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { clsx } from "clsx";
import { useUserActivityStore } from "@/entities/user/api/profileStore.ts";
import ChangePassword from "./ChangePassword";
import ProfileImageUploader from "./ProfileImageUploader";
import FollowersList from "./FollowersList";
import FolloweesList from "./FolloweesList";
import { BioSection } from "./BioSection";
import { CommentSection } from "./CommentSection";

// 탭 타입 정의
type TabType =
  | "overview"
  | "settings"
  | "security"
  | "privacy"
  | "followers"
  | "followees"
  | "recommendation-settings"; // 새로운 탭 추가

// LikedWebtoon을 TopWebtoonInfo로 변환하는 함수
const convertToTopWebtoonInfo = (webtoon: LikedWebtoon): WebtoonInfo => ({
  id: webtoon.id,
  titleId: webtoon.id,
  titleName: webtoon.title,
  author: "작가명", // API에서 제공하지 않는 경우 기본값
  adult: false,
  age: "전체연령가",
  finish: false,
  thumbnailUrl: webtoon.thumbnailUrl,
  synopsis: "",
  rankGenreTypes: ["DRAMA"],
  starScore: 0,
});

export const MyProfile = () => {
  // location에서 전달된 사용자 정보 확인
  const location = useLocation();
  const locationUserInfo = location.state?.userInfo;

  // @ts-ignore
  const {
    userInfo,
    comments,
    likedWebtoons,
    followers,
    followees,
    error,
    fetchCurrentUserInfo,
    fetchMyInfo,
    fetchMyLikedWebtoons,
    fetchMyComments,
    fetchFollowers,
    fetchFollowees,
  } = useUserStore();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    commentVisibility: "public",
    likeVisibility: "public",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 컴포넌트 마운트 시 사용자 정보 로드
useEffect(() => {
  const userId = locationUserInfo?.indexId;

  const fetchData = async () => {
    try {
      if (!userId) {
        console.warn("사용자 ID가 없습니다. location 정보 확인 필요", locationUserInfo);
        return;
      }

      console.log("프로필 페이지에서 사용할 사용자 ID:", userId);
      await Promise.all([
        fetchMyInfo(userId),
        fetchMyLikedWebtoons(userId),
        fetchMyComments(userId),
        fetchFollowers(userId),
        fetchFollowees(userId),
      ]);
    } catch (err) {
      console.error("프로필 관련 데이터 로딩 중 에러 발생", err);
      // TODO: 사용자에게 메시지 노출하려면 setMessage 사용 가능
      // setMessage({ type: 'error', text: '프로필 정보를 불러오는 데 실패했습니다.' });
    }
  };

  fetchData();
}, [
  locationUserInfo,
  fetchMyInfo,
  fetchMyLikedWebtoons,
  fetchMyComments,
  fetchFollowers,
  fetchFollowees,
]);


  const { fetchUserActivity, loading: activityLoading } =
    useUserActivityStore();

  useEffect(() => {
    const userId = locationUserInfo?.indexId;

    if (userId) {
      fetchUserActivity(userId);
    }
  }, [locationUserInfo, fetchUserActivity]);

  // 공개 범위 설정 핸들러
  const handlePrivacyChange = async (setting: string, value: string) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
    // TODO: 공개 범위 설정 API 호출
    setMessage({ type: "success", text: "설정이 저장되었습니다." });
  };

  // 탭 콘텐츠 렌더링 함수
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <>
            {/* 활동 요약 카드 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">활동 요약</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium">찜한 웹툰</h3>
                    <p className="text-2xl font-bold">{likedWebtoons.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium">작성한 댓글</h3>
                    <p className="text-2xl font-bold">{comments.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium">팔로워</h3>
                    <p className="text-2xl font-bold">{followers.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-medium">팔로잉</h3>
                    <p className="text-2xl font-bold">{followees.length}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* 좋아요한 웹툰 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">좋아요한 웹툰</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedWebtoons.map((webtoon) => (
                  <WebtoonCard
                    key={webtoon.id}
                    webtoon={convertToTopWebtoonInfo(webtoon)}
                    size="sm"
                    showActionButtons={false}
                  />
                ))}
                {likedWebtoons.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      아직 좋아요한 웹툰이 없습니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 작성한 댓글 섹션 */}
            <CommentSection comments={comments} />
          </>
        );

      case "followers":
        return <FollowersList followers={followers} />;
      case "followees":
        return <FolloweesList followees={followees} />;
      case "security":
        return <ChangePassword />;
      case "privacy":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">공개 범위 설정</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로필 공개 범위
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) =>
                    handlePrivacyChange("profileVisibility", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">전체 공개</option>
                  <option value="followers">팔로워만</option>
                  <option value="private">비공개</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  댓글 공개 범위
                </label>
                <select
                  value={privacySettings.commentVisibility}
                  onChange={(e) =>
                    handlePrivacyChange("commentVisibility", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">전체 공개</option>
                  <option value="followers">팔로워만</option>
                  <option value="private">비공개</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  좋아요한 웹툰 공개 범위
                </label>
                <select
                  value={privacySettings.likeVisibility}
                  onChange={(e) =>
                    handlePrivacyChange("likeVisibility", e.target.value)
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">전체 공개</option>
                  <option value="followers">팔로워만</option>
                  <option value="private">비공개</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 에러 상태 처리
  if (error) {
    return <div>에러: {error}</div>;
  }

  // 사용자 정보가 없는 경우 처리
  if (!userInfo) {
    return <div>사용자 정보를 찾을 수 없습니다.</div>;
  }

  // 메인 컴포넌트 렌더링
  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            {/* 프로필 이미지 영역*/}
            <ProfileImageUploader userId={userInfo.indexId} />
            {/* 소개 섹션 */}
            <BioSection userId={userInfo.indexId} />

            {/* 팔로우 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <button
                onClick={() => setActiveTab("followers")}
                className="flex items-center gap-2 hover:text-blue-500 mb-2 w-full text-left"
              >
                <span className="font-semibold">
                  {userInfo.followerCount || 0}
                </span>{" "}
                팔로워
              </button>
              <button
                onClick={() => setActiveTab("followees")}
                className="flex items-center gap-2 hover:text-blue-500 w-full text-left"
              >
                <span className="font-semibold">
                  {userInfo.followeeCount || 0}
                </span>{" "}
                팔로잉
              </button>
            </div>

            {/* 탭 네비게이션 */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "overview"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                프로필 개요
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                보안
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "privacy"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                공개 범위
              </button>
              <button
                onClick={() => setActiveTab("followers")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "followers"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                팔로워 목록
              </button>
              <button
                onClick={() => setActiveTab("followees")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "followees"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                팔로잉 목록
              </button>
            </nav>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 섹션 */}
        <div className="flex-1">
          {message && (
            <div
              className={clsx(
                "mb-4 p-4 rounded",
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {message.text}
            </div>
          )}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
