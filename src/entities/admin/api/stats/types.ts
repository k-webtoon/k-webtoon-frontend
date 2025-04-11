// 공통 타입
export interface DateRange {
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
}

// 사용자 통계
export interface UserStatsResponse {
  summary: {
    totalUsers: number;
    dailyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    newUserRate: number;
  };
  monthlyGrowth: Array<{
    month: string;
    users: number;
  }>;
  ageDistribution: Array<{
    ageGroup: string;
    count: number;
  }>;
  dailyNewUsers: Array<{
    date: string;
    newUsers: number;
  }>;
  hourlyTraffic: Array<{
    hour: string;
    users: number;
  }>;
  activeUsers: Array<{
    name: string;
    activity: number;
  }>;
  reportedUsers: Array<{
    name: string;
    reports: number;
  }>;
}

// 웹툰 통계
export interface WebtoonStatsResponse {
  summary: {
    totalWebtoons: number;
    reportedWebtoons: number;
    osmConversions: number;
    averageRating: number;
  };
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  topRatedWebtoons: Array<{
    name: string;
    rating: number;
    episodes: number;
  }>;
  recentWebtoons: Array<{
    name: string;
    date: string;
    genre: string;
  }>;
  activityStats: Array<{
    name: string;
    comments: number;
    likes: number;
    views: number;
  }>;
  monthlyStats: {
    totalViews: number;
    totalActivity: number;
  };
}

// 작가 통계
export interface AuthorStatsResponse {
  summary: {
    totalAuthors: number;
    averageWorksPerAuthor: number;
    averageRating: number;
  };
  monthlyNewAuthors: Array<{
    month: string;
    authors: number;
  }>;
  worksDistribution: Array<{
    works: string;
    count: number;
  }>;
  topAuthors: Array<{
    name: string;
    totalViews: number;
    avgRating: number;
  }>;
}

// 댓글 통계
export interface CommentStatsResponse {
  summary: {
    totalComments: number;
    dailyAverage: number;
    averageLength: number;
  };
  dailyComments: Array<{
    date: string;
    comments: number;
  }>;
  hourlyDistribution: Array<{
    hour: string;
    count: number;
  }>;
  topWebtoonsByComments: Array<{
    name: string;
    comments: number;
    avgLength: number;
  }>;
}

// API 요청 파라미터
export interface StatsParams extends DateRange {
  type: 'users' | 'webtoons' | 'authors' | 'comments';
} 