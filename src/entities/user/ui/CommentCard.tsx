import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { UserComment } from "../model/types";

interface CommentCardProps {
  comment: UserComment;
  webtoonId: number;
  onDelete?: () => void;
}

// 타임스탬프를 사용자가 보기 편한 형식으로 변환하는 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1분 이내
  if (diffInSeconds < 60) {
    return '방금 전';
  }
  // 1시간 이내
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  }
  // 24시간 이내
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  }
  // 7일 이내
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  }
  // 그 이상은 날짜 형식으로 표시
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const CommentCard: React.FC<CommentCardProps> = ({ comment, webtoonId, onDelete }) => {
  return (
    <Link to={`/webtoon/${webtoonId}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500">{comment.nickname}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{formatDate(comment.createdDate)}</span>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <p className="text-base line-clamp-2">{comment.content}</p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>좋아요 {comment.likeCount}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}; 