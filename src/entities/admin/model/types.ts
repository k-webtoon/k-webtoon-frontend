// src/entities/admin/model/types.ts

// Dashboard Types
export interface DashboardSummary {
  totalComments: number;
  totalWebtoons: number;
  totalUsers: number;
} 

// User Types
export type UserStatus = 'active' | 'dormant' | 'suspended';

export const UserStatusEnum = {
  ACTIVE: 'active' as const,
  DORMANT: 'dormant' as const,
  SUSPENDED: 'suspended' as const,
};

export const userStatusLabels: Record<UserStatus, string> = {
  active: '활성',
  dormant: '휴면',
  suspended: '정지',
};

export const userStatusColors: Record<UserStatus, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  dormant: { bg: 'bg-gray-100', text: 'text-gray-800' },
  suspended: { bg: 'bg-red-100', text: 'text-red-800' },
};

// Webtoon Types
export type WebtoonStatus = 'active' | 'inactive' | 'deleted' | 'pending' | 'blocked';

export const WebtoonStatusEnum = {
  ACTIVE: 'active' as const,    // 연재 중 (정상 노출)
  INACTIVE: 'inactive' as const,  // 완결 / 작가가 숨김 처리
  DELETED: 'deleted' as const,    // 삭제 (소프트 삭제)
  PENDING: 'pending' as const,    // 작가가 등록 후 승인 대기
  BLOCKED: 'blocked' as const,    // 운영자 블라인드 처리
};

export const webtoonStatusLabels: Record<WebtoonStatus, string> = {
  active: '연재중',
  inactive: '완결/숨김',
  deleted: '삭제됨',
  pending: '승인대기',
  blocked: '블라인드',
};

export const webtoonStatusColors: Record<WebtoonStatus, { bg: string; text: string }> = {
  active: { bg: 'bg-blue-100', text: 'text-blue-800' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
  deleted: { bg: 'bg-red-100', text: 'text-red-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  blocked: { bg: 'bg-purple-100', text: 'text-purple-800' },
};

// Comment Types
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

// Entity Interfaces
export interface Webtoon {
  id: number;
  title: string;
  author: string;
  description: string;
  genre: string;
  status: WebtoonStatus;
  views: number;
  rating: number;
  lastUpdated: Date;
  createdAt: Date;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
  status: UserStatus;
  lastLoginDate: Date;
  createdAt: Date;
}

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

export interface Report {
  id: number;
  type: string;
  content: string;
  createdAt: string;
  webtoonTitle: string;
} 

export interface SystemUpdate {
  id: number;
  title: string;
  content: string;
  createdAt: string;
} 

