import React from "react";

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean; // 지금 팔로우 상태 (true면 이미 팔로우 중)
  onToggle: () => Promise<void>;
  loading: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  isFollowing,
  onToggle,
  loading,
}) => {
  const handleClick = async () => {
    if (!loading) {
      try {
        await onToggle();
      } catch (err) {
        console.error("팔로우 상태 변경 중 오류:", err);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded-md transition-colors font-semibold ${
        !isFollowing
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading
        ? "처리 중..."
        : !isFollowing
        ? "팔로우"
        : "팔로우 취소"}
    </button>
  );
};

export default FollowButton;
