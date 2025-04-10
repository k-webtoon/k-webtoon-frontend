import React, { useEffect, useState } from "react";
import { getBioApi } from "@/app/api/userActivityApi";

interface BioSectionProps {
  userId: number;
}

const UserBioSection: React.FC<BioSectionProps> = ({ userId }) => {
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchBio = async () => {
      try {
        setLoading(true);
        const bioData = await getBioApi(userId);
        setBio(bioData || null);
      } catch (err: any) {
        console.error("소개 조회 에러:", err);
        setBio(null); // 에러 발생 시 null로 설정
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBio();
  }, [userId]);

  if (loading) {
    return <p className="text-gray-500">소개를 불러오는 중...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">소개</h3>
      <p className="text-gray-900 whitespace-pre-wrap">
        {bio || "소개가 없습니다."}
      </p>
    </div>
  );
};

export default UserBioSection;
