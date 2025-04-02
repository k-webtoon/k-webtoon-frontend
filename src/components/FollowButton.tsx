// src/components/FollowButton.tsx
import React from "react";

function FollowButton({ isFollowing, toggleFollow }: { isFollowing: boolean; toggleFollow: () => void }) {
    return (
        <button
            onClick={toggleFollow}  // 버튼 클릭 시 팔로우 상태 변경
            className={`${
                isFollowing ? "bg-gray-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded-md mt-4`}
        >
            {isFollowing ? "팔로잉 중" : "팔로우"}
        </button>
    );
}

export default FollowButton;
