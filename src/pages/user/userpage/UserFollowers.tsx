import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/shared/ui/shadcn/avatar.tsx"; // 아직 구현되지 않음
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserFollowers = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);

  const { userInfo, followers, loading, error, fetchUserInfo, fetchFollowers } = useUserStore();

  useEffect(() => {
    if (numericUserId) {
      fetchUserInfo(numericUserId);
      fetchFollowers(numericUserId);
    }
  }, [numericUserId, fetchUserInfo, fetchFollowers]);

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => fetchFollowers(numericUserId)}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 max-w-7xl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {userInfo?.nickname || "사용자"}님의 팔로워
          </h1>
          <p className="text-gray-500 mt-1">총 {followers?.length || 0}명</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {followers?.map((follower) => (
            <Link to={`/user/${follower.indexId}`} key={follower.indexId}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold overflow-hidden">
                      <img
                        src="/images/profile-placeholder.jpg"
                        alt="프로필"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {follower.nickname}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {follower.userEmail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {(!followers || followers.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium">팔로워가 없습니다.</p>
              <p className="text-sm">다른 사용자들과 소통해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function UserCard({
  user,
}: {
  user: { indexId: number; nickname: string; userEmail: string };
}) {
  // 이메일에서 첫 글자 추출 (아바타 폴백용)
  const initial = user.nickname ? user.nickname[0].toUpperCase() : "U";

  return (
    <Card>
      <CardContent className="p-4 flex items-center">
        {/* Avatar 컴포넌트가 아직 구현되지 않아 임시 대체 */}
        {/* <Avatar className="h-12 w-12 mr-4">
          <AvatarImage
            src={`/api/user/${user.indexId}/avatar`}
            alt={user.nickname}
          />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar> */}
        <div className="h-12 w-12 mr-4 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
          {initial}
        </div>
        <div>
          <Link
            to={`/user/${user.indexId}`}
            className="font-medium hover:underline"
          >
            {user.nickname || "사용자"}
          </Link>
          <p className="text-sm text-gray-500">{user.userEmail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserFollowers;
