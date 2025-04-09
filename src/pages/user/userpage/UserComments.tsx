import React, { useEffect, useState } from "react";
import { CommentCard } from "@/entities/user/ui/CommentCard";
import { UserComment } from "@/entities/user/model/types";
import { clsx } from "clsx";

interface UserCommentsProps {
  comments: UserComment[];
  loading?: boolean;
  error?: string | null;
}

const UserComments = ({
  comments,
  loading = false,
  error = null,
}: UserCommentsProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [commentsPerPage] = useState(10); // 페이지당 댓글 수 설정
  const [paginatedComments, setPaginatedComments] = useState<UserComment[]>([]);

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const startIndex = currentPage * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    setPaginatedComments(comments.slice(startIndex, endIndex));
  }, [comments, currentPage]);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">작성한 댓글</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            webtoonId={comment.webtoonId}
          />
        ))}
        {paginatedComments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-lg font-medium">아직 작성한 댓글이 없습니다</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
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

export default UserComments;
