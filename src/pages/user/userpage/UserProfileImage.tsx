import React, { useEffect } from "react";
import { useUserActivityStore } from "@/entities/user/api/profileStore.ts";
import { UserCircle2 } from "lucide-react"; // Lucide 아이콘 추가

interface ProfileImageDisplayProps {
  userId: number;
}

const ProfileImageDisplay: React.FC<ProfileImageDisplayProps> = ({
  userId,
}) => {
  const { profileData, fetchUserActivity } = useUserActivityStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserActivity(userId);
        setImageError(false);
      } catch (error) {
        console.error("프로필 조회 오류:", error);
        setErrorMessage("프로필 데이터를 불러오는 중 오류가 발생했습니다.");
        setImageError(true);
      }
    };
    loadData();
  }, [userId]);

  const buildImageUrl = () => {
    if (imageError || !profileData?.profileImageUrl) {
      return null;
    }

    try {
      const baseUrl = profileData.profileImageUrl.startsWith("http")
        ? profileData.profileImageUrl
        : `http://localhost:8080/img/${profileData.profileImageUrl}`;

      return `${baseUrl}?ts=${Date.now()}`;
    } catch (error) {
      console.error("이미지 URL 생성 오류:", error);
      return null;
    }
  };

  return (
    <div className="mb-4">
      <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative bg-gray-100">
        {buildImageUrl() ? (
          <img
            src={buildImageUrl() || undefined}
            alt="프로필"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle2 className="w-3/4 h-3/4 text-gray-400" />
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default ProfileImageDisplay;
