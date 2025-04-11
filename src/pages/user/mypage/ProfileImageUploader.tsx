import React, { useEffect } from "react";
import {
  useProfileStore,
  useUserActivityStore,
} from "@/entities/user/api/profileStore.ts";
import { UserCircle2 } from "lucide-react"; // Lucide 아이콘 추가

interface ProfileImageUploaderProps {
  userId: number;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  userId,
}) => {
  const { updateProfileImage, loading } = useProfileStore();
  const { profileData, fetchUserActivity } = useUserActivityStore();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [imageError, setImageError] = React.useState(false);

  // 프로필 데이터 자동 조회
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUserActivity(userId);
        setImageError(false);
      } catch (error) {
        console.error("프로필 조회 오류:", error);
        setImageError(true);
      }
    };
    loadData();
  }, [userId, fetchUserActivity]);

  // 이미지 URL 생성 함수
  const buildImageUrl = () => {
    if (imageError || !profileData?.profileImageUrl) {
      return null; // 이미지 없음을 나타내는 null 반환
    }

    try {
      const baseUrl = profileData.profileImageUrl.startsWith("http")
        ? profileData.profileImageUrl
        : `http://localhost:8080/img/${profileData.profileImageUrl}`;

      return `${baseUrl}?ts=${Date.now()}`; // 캐시 무효화
    } catch (error) {
      console.error("이미지 URL 생성 오류:", error);
      return null;
    }
  };

  // 파일 업로드 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 유효성 검사
    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("2MB 이하 이미지만 업로드 가능합니다.");
      return;
    }
    setErrorMessage(null);

    try {
      await updateProfileImage(file);
      await fetchUserActivity(userId);
      setImageError(false);
      console.log("이미지 업데이트 성공!");
    } catch (error: any) {
      setErrorMessage(error.message || "이미지 업로드 실패");
      setImageError(true);
    }
  };

  return (
    <div className="mb-4">
      <div className="w-full aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative group bg-gray-100">
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

        <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-white text-sm">
            {loading ? "업로드 중..." : "이미지 변경"}
          </span>
        </label>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
