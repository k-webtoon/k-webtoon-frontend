import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "@/entities/user/api/userStore.ts";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserLikeWebtoon = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);

  const { likedWebtoons, loading, error, fetchLikedWebtoons } = useUserStore();

  useEffect(() => {
    if (numericUserId) {
      fetchLikedWebtoons(numericUserId);
    }
  }, [numericUserId, fetchLikedWebtoons]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          // <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
          <div
            key={index}
            className="h-[300px] w-full rounded-xl bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={() => fetchLikedWebtoons(numericUserId)}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (likedWebtoons.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">좋아요한 웹툰이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">좋아요한 웹툰</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {likedWebtoons.map((webtoon) => (
          <WebtoonCard key={webtoon.id} webtoon={webtoon} />
        ))}
      </div>
    </div>
  );
};

function WebtoonCard({
  webtoon,
}: {
  webtoon: { id: number; title: string; thumbnailUrl: string };
}) {
  return (
    <a href={`/webtoon/${webtoon.id}`}>
      <Card className="h-[300px] overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-[220px] overflow-hidden">
          <img
            src={webtoon.thumbnailUrl || "/placeholder.svg"}
            alt={webtoon.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg line-clamp-2">{webtoon.title}</h3>
        </CardContent>
      </Card>
    </a>
  );
}

export default UserLikeWebtoon;
