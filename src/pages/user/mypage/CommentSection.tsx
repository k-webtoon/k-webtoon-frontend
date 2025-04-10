import React, { useEffect, useState } from "react";
import { CommentCard } from "@/entities/user/ui/CommentCard";
import { UserComment } from "@/entities/user/model/types";
import { commentApi } from "@/app/api/webtoonDetailApi"; // 댓글 API 호출
import { useWebtoonDetailStore } from "@/entities/webtoondetail/model/store"; // Zustand 스토어
import { clsx } from "clsx";

interface CommentSectionProps {
  comments: UserComment[]; // 전체 댓글 데이터를 외부에서 받아온다고 가정
  loading?: boolean;
  error?: string | null;
}

export const CommentSection = ({
  comments,
  loading = false,
  error = null,
}: CommentSectionProps) => {
  const { removeComment } = useWebtoonDetailStore(); // Zustand 스토어에서 댓글 제거 함수 가져오기

  const [currentPage, setCurrentPage] = useState(0);
  const [commentsPerPage] = useState(10); // 페이지당 댓글 수 설정 (필요에 따라 조정 가능)
  const [paginatedComments, setPaginatedComments] = useState<UserComment[]>([]);

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId); // 댓글 삭제 API 호출
      removeComment(commentId); // Zustand 스토어에서 댓글 제거
      alert("댓글이 삭제되었습니다."); // 성공 메시지
      window.location.reload();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다. 본인 댓글만 삭제할 수 있습니다."); // 실패 메시지
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지네이션된 댓글 가져오기
  useEffect(() => {
    const startIndex = currentPage * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setPaginatedComments(comments.slice(startIndex, endIndex));
  }, [comments, currentPage]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">작성한 댓글</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 변경된 부분: comments 대신 paginatedComments 사용 */}
        {paginatedComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            webtoonId={comment.webtoonId}
            onDelete={() => handleCommentDelete(comment.id)} // 삭제 핸들러 연결
          />
        ))}
        {paginatedComments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium">아직 작성한 댓글이 없습니다</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 추가 */}
      <div className="flex justify-center gap-3 mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={clsx(
              "px-6 py-3 rounded-xl font-medium transition-all duration-300",
              currentPage === index
                ? "bg-gradient-to-r from-indigo/50 to-indigo/600 text-white shadow-lg shadow-indigo/50"
                : "bg-gradient-to-r from-gray/50 to-gray/100 text-gray/600 hover:bg-gradient-to-r hover:text-white"
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
