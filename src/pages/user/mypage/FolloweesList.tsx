import React, { useMemo, useCallback } from "react";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { FollowUser } from "@/entities/user/model/types";
import { useProfileImages } from "@/entities/user/api/useProfileImages.ts";
import { UserCircle2 } from "lucide-react";

interface FolloweesListProps {
  followees: FollowUser[];
}

const FolloweesList: React.FC<FolloweesListProps> = React.memo(
  ({ followees }) => {
    const userIds = useMemo(
      () => followees.map((followee) => followee.indexId),
      [followees]
    );

    const { profileImages, loading, error } = useProfileImages(userIds);

    const handleCardClick = useCallback((userId: number) => {
      window.location.href = `/user/${userId}/profile`;
    }, []);

    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (loading) return <div className="text-gray-500">Loading...</div>;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">팔로잉 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followees.map((followee) => (
            <Card
              key={followee.indexId}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(followee.indexId)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {/* 프로필 이미지 영역 수정 */}
                  {profileImages[followee.indexId] ? (
                    <img
                      src={profileImages[followee.indexId] ?? undefined}
                      alt={followee.nickname}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/profile-placeholder.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <UserCircle2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {/* 사용자 정보 */}
                  <div>
                    <h3 className="font-medium">{followee.nickname}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {followee.userEmail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {followees.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium">
                아직 팔로잉하는 사용자가 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default FolloweesList;
