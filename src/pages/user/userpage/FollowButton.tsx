import React, { useEffect, useState } from "react";
import { useFollowStore } from "@/entities/user/model/followStore";

interface FollowButtonProps {
  userId: number;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const { isFollowing, toggleFollow } = useFollowStore();
  const [loading, setLoading] = useState(false);

  const handleFollowClick = async () => {
    setLoading(true);
    try {
      await toggleFollow(userId);
      alert("팔로우/언팔로우 상태가 변경되었습니다.");
    } catch (error) {
      console.error("팔로우/언팔로우 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowClick}
      disabled={loading}
      className={`px-4 py-2 rounded-md transition-colors ${
        isFollowing
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "처리 중..." : isFollowing ? "팔로우 취소" : "팔로우"}
    </button>
  );
};

export default FollowButton;
