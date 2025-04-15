// Webtoon Types
export type WebtoonStatus =
  | "active"
  | "inactive"
  | "deleted"
  | "pending"
  | "blocked";

export const WebtoonStatusEnum = {
  ACTIVE: "active" as const, // 연재 중 (정상 노출)
  INACTIVE: "inactive" as const, // 완결 / 작가가 숨김 처리
  DELETED: "deleted" as const, // 삭제 (소프트 삭제)
  PENDING: "pending" as const, // 작가가 등록 후 승인 대기
  BLOCKED: "blocked" as const, // 운영자 블라인드 처리
};

export const webtoonStatusLabels: Record<WebtoonStatus, string> = {
  active: "연재중",
  inactive: "완결/숨김",
  deleted: "삭제됨",
  pending: "승인대기",
  blocked: "블라인드",
};

export const webtoonStatusColors: Record<
  WebtoonStatus,
  { bg: string; text: string }
> = {
  active: { bg: "bg-blue-100", text: "text-blue-800" },
  inactive: { bg: "bg-gray-100", text: "text-gray-800" },
  deleted: { bg: "bg-red-100", text: "text-red-800" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  blocked: { bg: "bg-purple-100", text: "text-purple-800" },
};

// Comment Types
export enum CommentStatusEnum {
  VISIBLE = "visible", // 일반 댓글
  HIDDEN = "hidden", // 블러 처리됨 (사용자 or 운영자)
  REPORTED = "reported", // 신고 접수 상태
  BLOCKED = "blocked", // 강제 숨김 처리됨 (운영자 판단)
  RESOLVED = "resolved", // 신고 처리 완료됨 (노출 여부 확정됨)
}

export type CommentStatus = `${CommentStatusEnum}`;

export const commentStatusLabels: Record<CommentStatus, string> = {
  [CommentStatusEnum.VISIBLE]: "정상",
  [CommentStatusEnum.HIDDEN]: "숨김",
  [CommentStatusEnum.REPORTED]: "신고됨",
  [CommentStatusEnum.BLOCKED]: "블라인드",
  [CommentStatusEnum.RESOLVED]: "처리완료",
};

export const commentStatusColors: Record<
  CommentStatus,
  { bg: string; text: string }
> = {
  [CommentStatusEnum.VISIBLE]: {
    bg: "bg-green-100",
    text: "text-green-800",
  },
  [CommentStatusEnum.HIDDEN]: {
    bg: "bg-gray-100",
    text: "text-gray-800",
  },
  [CommentStatusEnum.REPORTED]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
  },
  [CommentStatusEnum.BLOCKED]: {
    bg: "bg-red-100",
    text: "text-red-800",
  },
  [CommentStatusEnum.RESOLVED]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
  },
};

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

/// 사용자 조회 인터페이스들

// 페이지네이션 인터페이스
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 (0부터 시작)
  size: number;
}

// 사용자 리스트 조회 DTO

export interface UserListDTO {
  indexId: number;
  userEmail: string;
  accountStatus: string; // "ACTIVE", "DORMANT", "SUSPENDED"
  createDateTime: string; // ISO 8601
}

// 상제 사용자 DTO
export interface UserDetailDTO {
  indexId: number;
  userEmail: string;
  accountStatus: string;
  createDateTime: string;
  nickname?: string;
  userAge?: number;
  gender?: string;
  phoneNumber?: string;
}

// 프론트엔드 상태 타입
export type UserStatus = "active" | "suspended" | "deactivated";

// 상태 매핑 객체
export const AccountStatusMap: Record<string, UserStatus> = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DEACTIVATED: "deactivated",
};

// 상태 표시 설정
export const userStatusConfig = {
  labels: {
    active: "활성",
    suspended: "휴면",
    deactivated: "정지",
  },
  colors: {
    active: { bg: "bg-green-100", text: "text-green-800" },
    suspended: { bg: "bg-yellow-100", text: "text-yellow-800" },
    deactivated: { bg: "bg-red-100", text: "text-red-800" },
  },
};

// 사용자 통계 요약
export interface UserCountSummary {
  total: number;
  active: number;
  suspended: number;
  deactivated: number;
}

// 상태별 사용자 리스트
export interface UserListByStatus {
  indexId: number;
  userEmail: string;
  nickname?: string;
  accountStatus: string;
  createDateTime: string;
}

// 계정 상태 변경 요청 타입
export interface AccountStatusRequest {
  email: string;
}

// 모달 표시 상태 타입
export interface ModalState {
  isOpen: boolean;
  userId?: number;
}

// 사용자 상세 정보 DTO
export interface ModalUserDetailDTO {
  indexId: number;
  userEmail: string;
  createDateTime: string;
  accountStatus: string;
  userAge?: number;
  gender?: string;
  nickname?: string;
  phoneNumber?: string;
  securityQuestion?: string;
}
