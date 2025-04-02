import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore.ts";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/shared/ui/shadcn/avatar.tsx"; // 아직 구현되지 않음
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserFollowees = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);

  const { userInfo, followees, loading, error, fetchUserInfo, fetchFollowees } =
    useUserStore();

  useEffect(() => {
    if (numericUserId) {
      fetchUserInfo(numericUserId);
      fetchFollowees(numericUserId);
    }
  }, [numericUserId, fetchUserInfo, fetchFollowees]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          // <Skeleton key={index} className="h-20 w-full rounded-xl" />
          <div
            key={index}
            className="h-20 w-full rounded-xl bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => fetchFollowees(numericUserId)}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (followees.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">팔로우하는 사용자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {userInfo?.nickname || "사용자"}님이 팔로우하는 사용자
      </h1>

      <div className="space-y-4">
        {followees.map((followee) => (
          <UserCard key={followee.indexId} user={followee} />
        ))}
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

export default UserFollowees;
