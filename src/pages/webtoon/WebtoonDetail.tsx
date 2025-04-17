import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWebtoonDetailStore } from "@/entities/webtoondetail/model/store";
import {
  getWebtoonDetail,
  commentApi,
} from "@/entities/webtoondetail/api/webtoonDetailApi.ts";
import { CommentRequest } from "@/entities/webtoondetail/model/types";
import { useAuthStore } from "@/entities/auth/api/store.ts";
import { CommentSection } from "@/pages/webtoon/WebtoonComment.tsx";

function WebtoonDetail() {
  const { id } = useParams<{ id: string }>();
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const {
    webtoon,
    comments,
    bestComments,
    currentPage,
    totalPages,
    setWebtoon,
    setComments,
    setBestComments,
    setCurrentPage,
    setTotalPages,
    addComment,
    removeComment,
    updateComment: updateCommentInStore,
    updateCommentLike,
  } = useWebtoonDetailStore();

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const webtoonData = await getWebtoonDetail(Number(id));
          setWebtoon(webtoonData);
        } catch (error) {
          console.error("웹툰 데이터 로딩 실패:", error);
        }
      }
    };
    fetchData();
  }, [id, setWebtoon]);

  useEffect(() => {
    const fetchComments = async () => {
      if (id) {
        try {
          const response = await commentApi.getComments(
            Number(id),
            currentPage
          );
          setComments(response.content);
          setTotalPages(response.totalPages);
        } catch (error) {
          console.error("댓글 데이터 로딩 실패:", error);
        }
      }
    };
    fetchComments();
  }, [id, currentPage, setComments, setTotalPages]);

  useEffect(() => {
    const fetchBestComments = async () => {
      if (id) {
        try {
          const bestComments = await commentApi.getBestComments(Number(id));
          setBestComments(bestComments);
        } catch (error) {
          console.error("베스트 댓글 로딩 실패:", error);
        }
      }
    };
    fetchBestComments();
  }, [id, setBestComments]);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!id || !newComment.trim()) return;
    try {
      const requestDto: CommentRequest = { content: newComment };
      const response = await commentApi.addComment(Number(id), requestDto);
      addComment(response);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      removeComment(commentId);
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
      updateCommentLike(commentId, isLiked);

      if (isLiked) {
        await commentApi.unlikeComment(commentId);
      } else {
        await commentApi.likeComment(commentId);
      }

      const [commentsRes, bestRes] = await Promise.all([
        commentApi.getComments(Number(id), currentPage),
        commentApi.getBestComments(Number(id)),
      ]);
      setComments(commentsRes.content);
      setBestComments(bestRes);
    } catch (error) {
      updateCommentLike(commentId, !isLiked);
      console.error("좋아요 처리 실패:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search?query=$${tag}`);
  };
  const handleAuthorClick = (author: string) => {
    navigate(`/search?query=~${author}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleGoToWebtoonPage = () => {
    if (webtoon?.webtoonPageUrl) {
      window.open(webtoon.webtoonPageUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!webtoon)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  const mediaMixTags = [];
  if (webtoon.osmuAnime)
    mediaMixTags.push({
      type: "애니메이션",
      color: "bg-gradient-to-r from-pink-50 to-pink-100 text-pink-600",
    });
  if (webtoon.osmuDrama)
    mediaMixTags.push({
      type: "드라마",
      color: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600",
    });
  if (webtoon.osmuGame)
    mediaMixTags.push({
      type: "게임",
      color: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600",
    });
  if (webtoon.osmuMovie)
    mediaMixTags.push({
      type: "영화",
      color: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600",
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 상단 웹툰 정보 섹션 */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-16">
            {/* 썸네일 섹션 */}
            <div className="w-full md:w-[420px] flex-shrink-0">
              <div className="relative group">
                <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-white p-1">
                  <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden">
                    <img
                      src={webtoon.thumbnailUrl}
                      alt={webtoon.titleName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 p-1">
                      {mediaMixTags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 ${tag.color} rounded-full text-sm font-medium shadow-sm backdrop-blur-sm`}
                        >
                          {tag.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full shadow-lg shadow-amber-200/50">
                    <span className="text-2xl text-white">★</span>
                    <span className="text-xl font-bold text-white">
                      {webtoon.starScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 웹툰 정보 섹션 */}
            <div className="flex-1 space-y-10 pt-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                  {webtoon.titleName}
                </h1>
                <p
                  className="text-2xl text-gray-600 cursor-pointer"
                  onClick={() => handleAuthorClick(webtoon.author)}
                >
                  {webtoon.author}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {webtoon.tag.map((tag, index) => (
                  <span
                    key={index}
                    className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-sm font-medium hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                  작품 소개
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {webtoon.synopsis}
                </p>
              </div>

              {/* 연령/완결/공식페이지 버튼 flex row */}
              <div className="flex gap-8 items-center">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg text-gray-700">
                    연령
                  </span>
                  <span className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-lg font-medium text-gray-700 shadow-sm">
                    {webtoon.age}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-lg text-gray-700">
                    완결
                  </span>
                  <span
                    className={`px-5 py-2.5 rounded-xl text-lg font-medium shadow-sm ${
                      webtoon.finish
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600"
                    }`}
                  >
                    {webtoon.finish ? "O" : "X"}
                  </span>
                  {/* 공식 페이지 바로가기 버튼: 완결 옆에만 위치 */}
                  <button
                    type="button"
                    onClick={handleGoToWebtoonPage}
                    className="ml-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow text-base font-semibold flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
                      />
                    </svg>
                    공식 페이지
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 전체 컨테이너 */}
      <CommentSection
        webtoonId={Number(id)}
        isAuthenticated={isAuthenticated}
        formatDate={formatDate}
      />
    </div>
  );
}

export default WebtoonDetail;
