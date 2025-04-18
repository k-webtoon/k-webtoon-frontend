import React, { useEffect, useState } from "react";
import {
  CommentWithAnalysis,
  WebtoonComment,
} from "@/entities/webtoondetail/model/types";
import { commentApi } from "@/entities/webtoondetail/api/webtoonDetailApi.ts";

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
  const [comments, setComments] = useState<CommentWithAnalysis[]>([]);
  const [bestComments, setBestComments] = useState<WebtoonComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 댓글 조회 (분석 결과가 오면 랜덤 인덱스 고정, 없으면 분석중)
  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        const response = await commentApi.getComments(webtoonId, currentPage);

        setComments((prev) => {
          return response.content.map((c) => {
            const messages = [c.message1, c.message2, c.message3].filter(
              Boolean
            );
            // 기존 상태에서 같은 댓글 id의 randomMessageIndex를 찾아서 유지
            const prevComment = prev.find((p) => p.comment.id === c.comment.id);
            return {
              ...c,
              randomMessageIndex:
                prevComment && prevComment.randomMessageIndex !== null
                  ? prevComment.randomMessageIndex
                  : messages.length > 0
                  ? Math.floor(Math.random() * messages.length)
                  : null,
              isAnalyzing: messages.length === 0,
            };
          });
        });
        if (isMounted) {
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("댓글 데이터 로딩 실패:", error);
      }
    };

    fetchComments();

    const interval = setInterval(fetchComments, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [webtoonId, currentPage]);

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

  // 댓글 작성 (기존과 동일)
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

      const tempComment: CommentWithAnalysis = {
        comment: response,
        feelTop3: null,
        message1: null,
        message2: null,
        message3: null,
        randomMessageIndex: null,
        isAnalyzing: true,
      };

      setComments((prev) => [tempComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment.comment.id !== commentId)
      );
      alert("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다. 본인 댓글만 삭제할 수 있습니다.");
    }
  };

  const handleToggleLike = async (commentId: number, isLiked: boolean) => {
    try {
      if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
        return;
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.comment.id === commentId
            ? {
                ...comment,
                comment: {
                  ...comment.comment,
                  isLiked: !isLiked,
                  likeCount: isLiked
                    ? comment.comment.likeCount - 1
                    : comment.comment.likeCount + 1,
                },
              }
            : comment
        )
      );

      if (isLiked) {
        await commentApi.unlikeComment(commentId);
      } else {
        await commentApi.likeComment(commentId);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  // 랜덤 메시지 추출 (고정)
  function getRandomMessage(comment: CommentWithAnalysis): string | null {
    const messages = [
      comment.message1,
      comment.message2,
      comment.message3,
    ].filter(Boolean);
    if (
      messages.length === 0 ||
      comment.randomMessageIndex === null ||
      comment.randomMessageIndex >= messages.length
    )
      return null;
    return messages[comment.randomMessageIndex];
  }

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

        {/* 베스트 댓글 섹션 (랜덤 메시지 없음) */}
        {bestComments.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestComments.map((comment) => (
                <div
                  key={comment.id}
                  className="group p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl transition-all duration-300 hover:shadow-md relative"
                >
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold text-gray-900">
                      {comment.nickname}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(comment.createdDate)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp">
                    {comment.content}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-orange-100">
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
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    BEST
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 일반 댓글 목록 (랜덤 메시지/로딩 처리) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comments.map((comment) => (
            <div
              key={comment.comment.id}
              className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl transition-all duration-300 hover:shadow-md"
            >
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-900">
                  {comment.comment.nickname}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(comment.comment.createdDate)}
                </span>
              </div>
              <p className="text-gray-600 mb-6 line-clamp">
                {comment.comment.content}
              </p>
              {/* 대댓글 느낌의 AI 메시지 */}
              {comment.isAnalyzing ? (
                <div className="ml-4 mb-4 px-4 py-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl text-sm text-indigo-800 shadow-sm flex items-center gap-2">
                  <span className="loader w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                  <span>AI 분석중...</span>
                </div>
              ) : (
                getRandomMessage(comment) && (
                  <div className="ml-4 mb-4 px-4 py-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl text-sm text-indigo-800 shadow-sm">
                    {getRandomMessage(comment)}
                  </div>
                )
              )}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDeleteComment(comment.comment.id)}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  삭제
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleLike(
                        comment.comment.id,
                        comment.comment.isLiked
                      )
                    }
                    className={`text-lg ${
                      comment.comment.isLiked
                        ? "text-red-500 animate-pulse"
                        : "text-gray-400"
                    } hover:scale-110 transition-transform`}
                  >
                    ♥
                  </button>
                  <span className="text-gray-600 font-medium">
                    {comment.comment.likeCount}
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
                    : "bg-gradient-to-r from-gray/50 to-gray/100 text-gray-600 hover:bg-gradient-to-r hover:text-white"
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
