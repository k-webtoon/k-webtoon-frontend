import React, { useEffect, useState } from "react";
import { getBioApi } from "@/entities/user/api/userActivityApi.ts";

interface BioSectionProps {
  userId: number;
}

const UserBioSection: React.FC<BioSectionProps> = ({ userId }) => {
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 초기 데이터 로드
useEffect(() => {
  const fetchBio = async () => {
    setLoading(true);
    const currentUserId = userId;

    try {
      const bioData = await getBioApi(currentUserId);
      console.log("[getBioApi 응답] bioData:", bioData); // 문자열로 찍혀야 함
      if (currentUserId === userId) {
        setBio(bioData); // 👈 이게 핵심!
      }
    } catch (err: any) {
      console.error("소개 조회 에러:", err);
      setBio(null);
    } finally {
      setLoading(false);
    }
  };

  if (userId) fetchBio();
}, [userId]);

  if (loading) {
    console.log("[BIO] 로딩 중...");
    return <p className="text-gray-500">소개를 불러오는 중...</p>;
  }

  console.log("[BIO 렌더링 전]", bio);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">소개</h3>
      <p className="text-gray-900 whitespace-pre-wrap">
        {bio !== null ? bio : "소개가 없습니다."}
      </p>
    </div>
  );
};

export default UserBioSection;
