import React, { useEffect } from "react";
import { useUserActivityStore } from "@/entities/user/model/profileStore";

interface ProfileImageDisplayProps {
  userId: number;
}

const ProfileImageDisplay: React.FC<ProfileImageDisplayProps> = ({
  userId,
}) => {
  const { profileData, fetchUserActivity } = useUserActivityStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 프로필 데이터 자동 조회
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserActivity(userId);
      } catch (error) {
        console.error("프로필 조회 오류:", error);
        setErrorMessage("프로필 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };
    loadData();
  }, [userId]);

  // 이미지 URL 생성 함수
  const buildImageUrl = () => {
    if (!profileData?.profileImageUrl) {
      return "/images/profile-placeholder.jpg";
    }

    const baseUrl = profileData.profileImageUrl.startsWith("http")
      ? profileData.profileImageUrl
      : `http://localhost:8080/img/${profileData.profileImageUrl}`;

    return `${baseUrl}?ts=${Date.now()}`; // 캐시 무효화
  };

  return (
    <div className="mb-4">
      <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative">
        {/* 프로필 이미지 */}
        <img
          src={buildImageUrl()}
          alt="프로필"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/profile-placeholder.jpg";
            e.currentTarget.onerror = null;
          }}
        />
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default ProfileImageDisplay;
