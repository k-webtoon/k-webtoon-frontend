// src/pages/user/userpage/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore";
import useAuthStore from "@/entities/auth/model/authStore";
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard";
import { CommentCard } from "@/entities/user/ui/CommentCard";
import { FollowUserCard } from "@/entities/user/ui/FollowUserCard";
import FollowButton from "@/components/FollowButton";
import { clsx } from "clsx";
import { LikedWebtoon } from "@/entities/user/model/types";
import { TopWebtoonInfo } from "@/entities/webtoon/model/types";

type TabType = "overview" | "followers" | "followees";

// LikedWebtoon을 TopWebtoonInfo로 변환하는 함수
const convertToTopWebtoonInfo = (likedWebtoon: LikedWebtoon): TopWebtoonInfo => {
  return {
    id: likedWebtoon.id,
    titleId: likedWebtoon.id,
    titleName: likedWebtoon.title,
    author: "작가명", // API에서 제공하지 않는 경우 기본값
    adult: false,
    age: "전체연령가",
    finish: false,
    thumbnailUrl: likedWebtoon.thumbnailUrl,
    synopsis: "",
    rankGenreTypes: ["DRAMA"],
    starScore: 0
  };
};
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
    checkFollowStatusAction
  } = useUserStore();

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
          const isFollowing = await checkFollowStatusAction(user.indexId, numericUserId);
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
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">팔로워 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followers?.map((follower) => (
                <FollowUserCard key={follower.indexId} user={follower} />
              ))}
              {(!followers || followers.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium">아직 팔로워가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        );
      case "followees":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">팔로잉 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {followees?.map((followee) => (
                <FollowUserCard key={followee.indexId} user={followee} />
              ))}
              {(!followees || followees.length === 0) && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium">아직 팔로잉하는 사용자가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* 좋아요한 웹툰 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">좋아요한 웹툰</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedWebtoons?.slice(0, 6).map((webtoon) => (
                  <WebtoonCard
                    key={webtoon.id}
                    webtoon={convertToTopWebtoonInfo(webtoon)}
                    size="sm"
                    showActionButtons={false}
                  />
                ))}
                {(!likedWebtoons || likedWebtoons.length === 0) && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-lg font-medium">아직 좋아요한 웹툰이 없습니다</p>
                  </div>
                )}
              </div>
            </div>

            {/* 작성한 댓글 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">작성한 댓글</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comments?.slice(0, 6).map((comment) => (
                  <CommentCard key={comment.id} comment={comment} webtoonId={comment.webtoonId} />
                ))}
                {(!comments || comments.length === 0) && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg font-medium">아직 작성한 댓글이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
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
            <div className="mb-4">
              <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                <img
                  src={userInfo?.profileImage || "/images/profile-placeholder.jpg"}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold mb-1">{userInfo?.nickname || "사용자"}</h1>
              <p className="text-gray-600 mb-4">{userInfo?.userEmail}</p>
              {user && user.indexId !== numericUserId && (
                <div className="relative">
                  <button
                    onClick={toggleFollow}
                    disabled={followLoading}
                    className={clsx(
                      "w-full px-4 py-2 rounded-md transition-colors",
                      isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-500 text-white hover:bg-blue-600",
                      followLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {followLoading ? "처리 중..." : isFollowing ? "팔로우 취소" : "팔로우"}
                  </button>
                  {followError && (
                    <p className="mt-2 text-sm text-red-500">{followError}</p>
                  )}
                </div>
              )}
            </div>

            {/* 소개 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">소개</h3>
              <p className="text-gray-900 whitespace-pre-wrap">
                {userInfo?.bio || "소개가 없습니다."}
              </p>
            </div>

            {/* 팔로우 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <button
                onClick={() => setActiveTab("followers")}
                className="flex items-center gap-2 hover:text-blue-500 mb-2 w-full text-left"
              >
                <span className="font-semibold">{userInfo?.followerCount || 0}</span> 팔로워
              </button>
              <button
                onClick={() => setActiveTab("followees")}
                className="flex items-center gap-2 hover:text-blue-500 w-full text-left"
              >
                <span className="font-semibold">{userInfo?.followeeCount || 0}</span> 팔로잉
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
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
