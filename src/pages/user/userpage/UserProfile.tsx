// src/pages/user/userpage/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore";
import useAuthStore from "@/entities/auth/model/userStore";
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard";
import { clsx } from "clsx";
import { LikedWebtoon } from "@/entities/user/model/types";
import UserComments from "./UserComments";
import ProfileImageDisplay from "./UserProfileImage";
import { WebtoonInfo } from "@/entities/webtoon/ui/types";
import FollowersList from "../mypage/FollowersList";
import FolloweesList from "../mypage/FolloweesList";
import UserBioSection from "./UserBioSection";
import FollowButton from "./FollowButton";

type TabType = "overview" | "followers" | "followees";

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
const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  const {
    userInfo,
    likedWebtoons,
    comments,
    followers,
    followees,
    loading,
    error,
    fetchUserInfo,
    fetchLikedWebtoons,
    fetchUserComments,
    fetchFollowers,
    fetchFollowees,
    followUserAction,
    unfollowUserAction,
    checkFollowStatusAction,
  } = useUserStore();

  // @ts-ignore
  const { user } = useAuthStore();

  useEffect(() => {
    if (numericUserId) {
      fetchUserInfo(numericUserId);
      fetchLikedWebtoons(numericUserId);
      fetchUserComments(numericUserId);
      fetchFollowers(numericUserId);
      fetchFollowees(numericUserId);
    }
  }, [numericUserId]);

  // 팔로우 상태 확인
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && numericUserId) {
        try {
          const isFollowing = await checkFollowStatusAction(
            user.indexId,
            numericUserId
          );
          setIsFollowing(isFollowing);
        } catch (error) {
          console.error("팔로우 상태 확인 중 오류 발생:", error);
        }
      }
    };

    checkFollowStatus();
  }, [user, numericUserId, checkFollowStatusAction]);

  const toggleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    setFollowError(null);

    try {
      if (isFollowing) {
        await unfollowUserAction(user.indexId, numericUserId);
      } else {
        await followUserAction(user.indexId, numericUserId);
      }
      setIsFollowing(!isFollowing);

      // 팔로워 목록 새로고침
      await fetchFollowers(numericUserId);
    } catch (error) {
      console.error("팔로우 상태 변경 중 오류 발생:", error);
      setFollowError("팔로우 상태 변경에 실패했습니다.");
    } finally {
      setFollowLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "followers":
        return <FollowersList followers={followers || []} />;
      case "followees":
        return <FolloweesList followees={followees || []} />;
      default:
        return (
          <>
            {/* 좋아요한 웹툰 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">좋아요한 웹툰</h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="h-[280px] w-full rounded-xl bg-gray-200 animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-12">
                  좋아요한 웹툰을 불러오는 중 오류가 발생했습니다.
                </div>
              ) : likedWebtoons.length === 0 ? (
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedWebtoons.map((webtoon) => (
                    <WebtoonCard
                      key={webtoon.id}
                      webtoon={convertToTopWebtoonInfo(webtoon)}
                      size="sm"
                      showActionButtons={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 작성한 댓글 섹션 */}
            <UserComments comments={comments} loading={loading} error={error} />
          </>
        );
    }
  };

  if (loading) {
    return (
      <div className="w-full font-[Pretendard]">
        <div className="w-full h-[360px] bg-gray-200 animate-pulse"></div>
        <div className="mt-10 space-y-6">
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-[280px] w-full rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[280px] w-full rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-[280px] w-full rounded-xl bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => fetchUserInfo(numericUserId)}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-full md:w-1/4">
          <div className="sticky top-24">
            <ProfileImageDisplay userId={numericUserId} />

            {/* 소개 섹션 */}
            <UserBioSection userId={numericUserId} />

            <div className="mb-6">
              <FollowButton userId={numericUserId} />
            </div>

            {/* 팔로우 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <button
                onClick={() => setActiveTab("followers")}
                className="flex items-center gap-2 hover:text-blue-500 mb-2 w-full text-left"
              >
                <span className="font-semibold">
                  {userInfo?.followerCount || 0}
                </span>{" "}
                팔로워
              </button>
              <button
                onClick={() => setActiveTab("followees")}
                className="flex items-center gap-2 hover:text-blue-500 w-full text-left"
              >
                <span className="font-semibold">
                  {userInfo?.followeeCount || 0}
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
                onClick={() => setActiveTab("followers")}
                className={clsx(
                  "w-full px-4 py-2 text-left rounded-md",
                  activeTab === "followers"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                팔로워
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
                팔로잉
              </button>
            </nav>
          </div>
        </div>

        {/* 오른쪽 콘텐츠 섹션 */}
        <div className="flex-1">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserProfile;
