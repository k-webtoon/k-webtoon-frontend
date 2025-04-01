import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "@/entities/user/model/userStore.ts";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";
// import { formatDistance } from "date-fns"; // 아직 구현되지 않음
// import { ko } from "date-fns/locale"; // 아직 구현되지 않음
// import { Skeleton } from "@/shared/ui/shadcn/skeleton.tsx"; // 아직 구현되지 않음

const UserComments = () => {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = parseInt(userId || "0", 10);

  const {
    userInfo,
    comments,
    loading,
    error,
    fetchUserInfo,
    fetchUserComments,
  } = useUserStore();

  useEffect(() => {
    if (numericUserId) {
      fetchUserInfo(numericUserId);
      fetchUserComments(numericUserId);
    }
  }, [numericUserId, fetchUserInfo, fetchUserComments]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          // <Skeleton key={index} className="h-32 w-full rounded-xl" />
          <div
            key={index}
            className="h-32 w-full rounded-xl bg-gray-200 animate-pulse"
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
          onClick={() => fetchUserComments(numericUserId)}
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="w-full p-8 text-center">
        <p className="text-gray-500">작성한 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {userInfo?.nickname || "사용자"}님이 작성한 댓글
      </h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

function CommentCard({
  comment,
}: {
  comment: {
    id: number;
    content: string;
    createdDate: string;
    likeCount: number;
  };
}) {
  // 날짜 형식 변환 - date-fns 라이브러리가 아직 구현되지 않음
  // const formattedDate = formatDistance(
  //   new Date(comment.createdDate),
  //   new Date(),
  //   { addSuffix: true, locale: ko }
  // );

  // 임시 날짜 포맷 구현
  const formattedDate = new Date(comment.createdDate).toLocaleDateString();

  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-2 text-gray-700">{comment.content}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formattedDate}</span>
          <span>좋아요 {comment.likeCount}개</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserComments;
