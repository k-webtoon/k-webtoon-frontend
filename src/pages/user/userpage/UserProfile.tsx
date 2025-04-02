// src/pages/user/userpage/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore.ts";
import FollowButton from "@/components/FollowButton";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";
import useAuthStore from "@/entities/auth/model/userStore.ts";
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);

  const {
    userInfo,
    likedWebtoons,
    loading,
    error,
    fetchUserInfo,
    fetchLikedWebtoons,
  } = useUserStore();
  const { token } = useAuthStore();

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (numericUserId) {
      fetchUserInfo(numericUserId);
      fetchLikedWebtoons(numericUserId);
    }

    // 컴포넌트 언마운트 시 상태 초기화
    return () => {
      useUserStore.getState().resetUserData();
    };
  }, [numericUserId, fetchUserInfo, fetchLikedWebtoons]);

  const toggleFollow = async () => {
    const myUserId = 1; // 실제로는 로그인된 사용자 ID를 가져와야 함

    try {
      if (isFollowing) {
        await useUserStore
          .getState()
          .unfollowUserAction(myUserId, numericUserId);
      } else {
        await useUserStore.getState().followUserAction(myUserId, numericUserId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("팔로우 상태 변경 중 오류 발생:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full font-[Pretendard]">
        {/* <Skeleton className="w-full h-[360px]" /> */}
        <div className="w-full h-[360px] bg-gray-200 animate-pulse"></div>
        <div className="mt-10 space-y-6">
          {/* <Skeleton className="h-12 w-48" /> */}
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            {/* 스켈레톤 대신 div 사용 */}
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
    <div className="w-full font-[Pretendard]">
      {/* 유저 정보 */}
      <div className="w-full h-[360px] relative">
        <img
          src="/images/background.jpg"
          alt="배경"
          className="w-full h-full object-cover"
        />
        <div className="absolute left-24 bottom-8 flex items-center space-x-10 z-10">
          <img
            src="/images/profile-placeholder.jpg" // 실제 프로필 이미지가 있으면 변경 필요
            alt="프로필"
            className="w-[180px] h-[180px] rounded-full object-cover border-[6px] border-white shadow-xl"
          />
          <div className="bg-white text-black rounded-2xl px-6 py-4 shadow-md">
            <p className="text-[18px] font-semibold mb-2">
              {userInfo?.nickname || "사용자"}
            </p>
            <div className="flex space-x-8 text-[13px] text-gray-600">
              <Stat label="팔로워" value={userInfo?.followerCount || 0} />
              <Stat label="팔로잉" value={userInfo?.followeeCount || 0} />
              <Stat label="댓글수" value={userInfo?.commentCount || 0} />
            </div>
            {token && (
              <FollowButton
                isFollowing={isFollowing}
                toggleFollow={toggleFollow}
              />
            )}
          </div>
        </div>
      </div>

      {/* 좋아요한 웹툰 */}
      <Section title="좋아요한 웹툰">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {likedWebtoons.slice(0, 4).map((webtoon) => (
            <LikedWebtoonCard key={webtoon.id} webtoon={webtoon} />
          ))}
          {likedWebtoons.length === 0 && (
            <p className="col-span-full text-center py-4 text-gray-500">
              좋아요한 웹툰이 없습니다.
            </p>
          )}
        </div>
        {likedWebtoons.length > 4 && (
          <div className="mt-4 text-right">
            <Link
              to={`/user/${userId}/likes`}
              className="text-blue-500 hover:underline"
            >
              더보기 ({likedWebtoons.length})
            </Link>
          </div>
        )}
      </Section>

      {/* 작성한 댓글 링크 */}
      <Section title="작성한 댓글">
        <Link
          to={`/user/${userId}/comments`}
          className="text-blue-500 hover:underline"
        >
          작성한 댓글 보기 ({userInfo?.commentCount || 0})
        </Link>
      </Section>

      {/* 팔로워/팔로잉 링크 */}
      <Section title="팔로우 관계">
        <div className="flex gap-8">
          <Link
            to={`/user/${userId}/followers`}
            className="text-blue-500 hover:underline"
          >
            팔로워 보기 ({userInfo?.followerCount || 0})
          </Link>
          <Link
            to={`/user/${userId}/followees`}
            className="text-blue-500 hover:underline"
          >
            팔로잉 보기 ({userInfo?.followeeCount || 0})
          </Link>
        </div>
      </Section>
    </div>
  );
};

// 통계 컴포넌트
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-black font-bold text-lg">{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}

// 섹션 컴포넌트
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 mb-16">
      <h2 className="text-xl font-semibold mb-4 text-left">{title}</h2>
      {children}
    </section>
  );
}

// 좋아요한 웹툰 카드 컴포넌트
function LikedWebtoonCard({
  webtoon,
}: {
  webtoon: { id: number; title: string; thumbnailUrl: string };
}) {
  return (
    <Link to={`/webtoon/${webtoon.id}`}>
      <Card className="h-[280px] overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-[200px] overflow-hidden">
          <img
            src={webtoon.thumbnailUrl || "/placeholder.svg"}
            alt={webtoon.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg line-clamp-1">{webtoon.title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}

export default UserProfile;
