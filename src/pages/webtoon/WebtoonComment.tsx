import { useEffect, useState } from "react";
import { Comment } from "@/entities/webtoondetail/model/types";
import { commentApi } from "@/entities/webtoondetail/api/webtoonDetailApi";

interface CommentSectionProps {
  webtoonId: number;
  isAuthenticated: boolean;
  formatDate: (dateString: string) => string;
}

export const CommentSection = ({
  webtoonId,
  isAuthenticated,
  formatDate,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [bestComments, setBestComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 댓글 목록 가져오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentApi.getComments(webtoonId, currentPage);
        setComments(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("댓글 데이터 로딩 실패:", error);
      }
    };
    fetchComments();
  }, [webtoonId, currentPage]);

  // 베스트 댓글 가져오기
  useEffect(() => {
    const fetchBestComments = async () => {
      try {
        const bestComments = await commentApi.getBestComments(webtoonId);
        setBestComments(bestComments);
      } catch (error) {
        console.error("베스트 댓글 로딩 실패:", error);
      }
    };
    fetchBestComments();
  }, [webtoonId]);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await commentApi.addComment(webtoonId, {
        content: newComment,
      });
      alert("댓글이 작성되었습니다.");
      setComments((prev) => [response, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // 현재 페이지 업데이트
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다. 본인 댓글만 삭제할 수 있습니다.");
    }
  };

  // 좋아요 토글
  const handleToggleLike = async (commentId: number, isLiked: boolean) => {
    try {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 즉시 UI 업데이트
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !isLiked,
                likeCount: isLiked
                  ? comment.likeCount - 1
                  : comment.likeCount + 1,
              }
            : comment
        )
      );

      // 서버 동기화
      if (isLiked) {
        await commentApi.unlikeComment(commentId);
      } else {
        await commentApi.likeComment(commentId);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">댓글</h2>

        {/* 댓글 입력 영역 */}
        <div className="flex gap-4 mb-12">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="flex-1 px-6 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-indigo-500 text-lg placeholder-gray-400 shadow-sm"
          />
          <button
            onClick={() => {
              handleAddComment();
              setNewComment("");
            }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all font-medium text-lg shadow-lg shadow-indigo/50"
          >
            작성
          </button>
        </div>

        {/* 베스트 댓글 섹션 */}
        {bestComments.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl transition-all duration-300 hover:shadow-md relative"
                >
                  {/* 댓글 헤더 */}
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold text-gray-900">
                      {comment.userNickname}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(comment.createdDate)}
                    </span>
                  </div>
                  {/* 댓글 내용 */}
                  <p className="text-gray-600 mb-6 line-clamp">
                    {comment.content}
                  </p>
                  {/* 액션 버튼 영역 */}
                  <div className="flex justify-between items-center pt-4 border-t border-orange-100">
                    {/* 좋아요 버튼 */}
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() =>
                          handleToggleLike(comment.id, comment.isLiked)
                        }
                        className={`text-lg ${
                          comment.isLiked
                            ? "text-red-500 animate-pulse"
                            : "text-gray-400"
                        } hover:scale-110 transition-transform`}
                      >
                        ♥
                      </button>
                      <span className="text-orange-600 font-medium">
                        {comment.likeCount}
                      </span>
                    </div>
                  </div>
                  {/* BEST 뱃지 */}
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    BEST
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 일반 댓글 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl transition-all duration-300 hover:shadow-md"
            >
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-900">
                  {comment.userNickname}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(comment.createdDate)}
                </span>
              </div>
              <p className="text-gray-600 mb-6 line-clamp">{comment.content}</p>

              {/* 액션 버튼 영역 */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  삭제
                </button>
                {/* 좋아요 버튼 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleLike(comment.id, comment.isLiked)
                    }
                    className={`text-lg ${
                      comment.isLiked
                        ? "text-red-500 animate-pulse"
                        : "text-gray-400"
                    } hover:scale-110 transition-transform`}
                  >
                    ♥
                  </button>
                  <span className="text-gray-600 font-medium">
                    {comment.likeCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === i
                    ? "bg-gradient-to-r from-indigo/50 to-indigo/600 text-white shadow-lg shadow-indigo/50"
                    : "bg-gradient-to-r from-gray/50 to-gray/100 text-gray/600 hover:bg-gradient-to-r hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
