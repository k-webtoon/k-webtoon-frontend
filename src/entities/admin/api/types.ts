// 사용자 통계 관련 타입
export interface AgeDistributionDto {
  ageGroup: string;
  count: number;
}

export interface GenderRatioDto {
  gender: string;
  ratio: number;
  count: number;
}

export interface GenderAgeActivityDto {
  gender: string;
  ageGroup: string;
  activityCount: number;
}

export interface UserStatusRatioDto {
  status: string;
  ratio: number;
  count: number;
}

export interface DailySignupDto {
  date: string;
  count: number;
}

// API 응답 타입
export interface UserStatsResponse {
  totalCount: number;
  ageDistribution: AgeDistributionDto[];
  genderDistribution: GenderRatioDto[];
  genderAgeActivity: GenderAgeActivityDto[];
  userStatusRatio: UserStatusRatioDto[];
  dailySignups: DailySignupDto[];
}

// 웹툰 통계 관련 타입
export interface WebtoonStatsResponse {
  totalCount: number;
  genreDistribution: Record<string, number>;
  osmuRatio: Record<string, number>;
  scoreStats: {
    average: number;
    standardDeviation: number;
  };
  commentStats: {
    totalCount: number;
    deletedRatio: number;
  };
} 