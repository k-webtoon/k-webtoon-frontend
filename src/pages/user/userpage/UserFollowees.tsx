import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUserStore } from "@/entities/user/api/userStore.ts";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/shared/ui/shadcn/avatar.tsx"; // 아직 구현되지 않음
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserFollowees = () => {
  return <div>이 유저가 팔로우한 사람들</div>;
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
