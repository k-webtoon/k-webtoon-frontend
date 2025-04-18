import { useState, useEffect, useMemo } from "react";
import { getUserProfileImageApi } from "@/entities/user/api/userActivityApi.ts";

const cachedProfileImages: Record<number, string | null> = {};

export const useProfileImages = (userIds: number[]) => {
  const [profileImages, setProfileImages] = useState<
    Record<number, string | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedUserIds = useMemo(() => userIds, [userIds]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // 캐시된 데이터와 요청 필요한 ID 분리
        const newIds = memoizedUserIds.filter(
          (id) => !(id in cachedProfileImages)
        );
        const existingData = memoizedUserIds.reduce((acc, id) => {
          if (id in cachedProfileImages) acc[id] = cachedProfileImages[id];
          return acc;
        }, {} as Record<number, string | null>);

        // 기존 데이터 먼저 반영
        if (Object.keys(existingData).length > 0) {
          setProfileImages(existingData);
        }

        // 새로운 데이터 요청
        if (newIds.length > 0) {
          const newImages = await Promise.all(
            newIds.map((id) =>
              getUserProfileImageApi(id)
                .then((url) => {
                  cachedProfileImages[id] = url || null;
                  return { id, url };
                })
                .catch(() => ({ id, url: null }))
            )
          );

          setProfileImages((prev) => ({
            ...prev,
            ...newImages.reduce((acc, { id, url }) => {
              acc[id] = url;
              return acc;
            }, {} as Record<number, string | null>),
          }));
        }
      } catch (err) {
        setError("이미지 로드 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [memoizedUserIds]);

  return { profileImages, loading, error };
};
