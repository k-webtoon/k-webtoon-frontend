import React from "react";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { FollowUser } from "@/entities/user/model/types";
import { useProfileImages } from "@/entities/user/api/useProfileImages.ts";

interface FollowersListProps {
  followers: FollowUser[];
}

const FollowersList: React.FC<FollowersListProps> = ({ followers }) => {
  const userIds = followers.map((follower) => follower.indexId);
  const { profileImages, loading, error } = useProfileImages(userIds);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (loading) return <div className="text-gray-500">Loading...</div>;

  const handleCardClick = (userId: number) => {
    window.location.href = `/user/${userId}/profile`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">팔로워 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {followers.map((follower) => (
          <Card
            key={follower.indexId}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(follower.indexId)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {/* 프로필 이미지 */}
                <img
                  src={
                    profileImages[follower.indexId] ||
                    "/images/profile-placeholder.jpg"
                  }
                  alt={follower.nickname}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/profile-placeholder.jpg";
                  }}
                />
                {/* 사용자 정보 */}
                <div>
                  <h3 className="font-medium">{follower.nickname}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {follower.userEmail}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {followers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">아직 팔로워가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersList;
