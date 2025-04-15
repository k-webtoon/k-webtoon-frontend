import React, { useEffect, useState } from "react";
import { clsx } from "clsx";
import { getBioApi, updateBioApi } from "@/entities/user/api/userActivityApi.ts";

interface BioSectionProps {
  userId: number;
}

export const BioSection = ({ userId }: BioSectionProps) => {
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");

  // 초기 데이터 로드
  useEffect(() => {
    console.log("id: ", userId);
    const fetchBio = async () => {
      try {
        setLoading(true);
        setError(null);
        const bioData = await getBioApi(userId);
        console.log("받은 bio 데이터: ", bioData);
      setBio(bioData.bio); // ✅ 수정된 부분
      } catch (err: any) {
        console.error("소개 조회 에러:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBio();
  }, [userId]);

  // 편집 모드 진입 시 초기값 설정
  useEffect(() => {
    if (isEditing) setEditedBio(bio || "");
  }, [isEditing, bio]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      await updateBioApi(editedBio);
      setBio(editedBio);
      setIsEditing(false);
      alert("소개가 수정되었습니다.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">소개</h3>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            수정
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            className={clsx(
              "w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            )}
            rows={4}
            placeholder="자신을 소개해주세요"
            disabled={loading}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedBio(bio || "");
              }}
              className="px-3 py-1.5 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-900 whitespace-pre-wrap">
          {bio || "소개가 없습니다."}
        </p>
      )}
    </div>
  );
};
