export enum AccountStatus {
  ACTIVE,       // 활성 상태
  SUSPENDED,    // 정지 상태 (임시)
  DEACTIVATED   // 비활성화 상태 (영구)
}
// Status Types
export type UserStatusType = 'active' | 'dormant' | 'suspended';

// Status Constants
export const USER_STATUS = {
  ACTIVE: 'active' as const,
  DORMANT: 'dormant' as const,
  SUSPENDED: 'suspended' as const,
} as const;

// User Types
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

export const userStatusLabels: Record<typeof USER_STATUS[keyof typeof USER_STATUS], string> = {
  [USER_STATUS.ACTIVE]: '정상',
  [USER_STATUS.DORMANT]: '휴면',
  [USER_STATUS.SUSPENDED]: '정지'
};

export const userStatusColors: Record<typeof USER_STATUS[keyof typeof USER_STATUS], { bg: string; text: string }> = {
  [USER_STATUS.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800' },
  [USER_STATUS.DORMANT]: { bg: 'bg-gray-100', text: 'text-gray-800' },
  [USER_STATUS.SUSPENDED]: { bg: 'bg-red-100', text: 'text-red-800' }
};

export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: '관리자',
  [UserRole.USER]: '일반 사용자',
  [UserRole.CREATOR]: '작가',
  [UserRole.MODERATOR]: '모더레이터'
};


export interface AppUser {
  indexId: number;
  userEmail: string;
  userPassword: string;
  createDateTime: string;
  deletedDateTime?: string;
  userAge?: number;
  gender?: string;
  nickname?: string;
  role: string;
  phoneNumber?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  accountStatus: AccountStatus;
}

