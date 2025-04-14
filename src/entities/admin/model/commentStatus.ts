export enum CommentStatusEnum {
  VISIBLE = 'visible',     // 일반 댓글
  HIDDEN = 'hidden',       // 블러 처리됨 (사용자 or 운영자)
  REPORTED = 'reported',   // 신고 접수 상태
  BLOCKED = 'blocked',     // 강제 숨김 처리됨 (운영자 판단)
  RESOLVED = 'resolved'    // 신고 처리 완료됨 (노출 여부 확정됨)
}

export type CommentStatus = `${CommentStatusEnum}`;

export const commentStatusLabels: Record<CommentStatus, string> = {
  [CommentStatusEnum.VISIBLE]: '정상',
  [CommentStatusEnum.HIDDEN]: '숨김',
  [CommentStatusEnum.REPORTED]: '신고됨',
  [CommentStatusEnum.BLOCKED]: '블라인드',
  [CommentStatusEnum.RESOLVED]: '처리완료'
};

export const commentStatusColors: Record<CommentStatus, { bg: string; text: string }> = {
  [CommentStatusEnum.VISIBLE]: {
    bg: 'bg-green-100',
    text: 'text-green-800'
  },
  [CommentStatusEnum.HIDDEN]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800'
  },
  [CommentStatusEnum.REPORTED]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800'
  },
  [CommentStatusEnum.BLOCKED]: {
    bg: 'bg-red-100',
    text: 'text-red-800'
  },
  [CommentStatusEnum.RESOLVED]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800'
  }
};

export interface Comment {
  id: number;
  content: string;
  author: string;
  webtoonTitle: string;
  status: CommentStatus;
  reportCount: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
} 