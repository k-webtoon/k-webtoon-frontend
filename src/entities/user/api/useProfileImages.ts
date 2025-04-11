import { useState, useEffect, useRef } from "react";
import { getUserProfileImageApi } from "@/entities/user/api/userActivityApi.ts";

const cachedProfileImages: Record<number, string | null> = {}; // 캐시 저장소

export const useProfileImages = (userIds: number[]) => {
  const [profileImages, setProfileImages] = useState<
    Record<number, string | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchedIdsRef = useRef<Set<number>>(new Set()); // 이미 호출된 ID 추적

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // 새로 요청해야 할 ID만 필터링
        const idsToFetch = userIds.filter(
          (id) => !fetchedIdsRef.current.has(id)
        );

        if (idsToFetch.length > 0) {
          const results = await Promise.all(
            idsToFetch.map((id) =>
              getUserProfileImageApi(id)
                .then((url) => url || null)
                .catch(() => null)
            )
          );

          // 새로 가져온 데이터를 캐시에 저장
          idsToFetch.forEach((id, index) => {
            cachedProfileImages[id] = results[index];
            fetchedIdsRef.current.add(id); // 호출된 ID 기록
          });
        }

        // 현재 userIds에 해당하는 이미지를 반환
        const imageMap = userIds.reduce((acc, id) => {
          acc[id] = cachedProfileImages[id] || null;
          return acc;
        }, {} as Record<number, string | null>);

        setProfileImages(imageMap);
      } catch (err) {
        console.error("프로필 이미지 로드 실패:", err);
        setError("프로필 이미지를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (userIds.length > 0) fetchImages();
    else setLoading(false);
  }, [userIds]);

  return { profileImages, loading, error };
};
