import { 
  UserStatsResponse, 
  WebtoonStatsResponse, 
  AuthorStatsResponse, 
  CommentStatsResponse 
} from './types';

// 백엔드 응답을 프론트엔드 타입으로 변환하는 맵퍼
export const statsMapper = {
  // 사용자 통계 맵퍼
  toUserStats(backendResponse: any): UserStatsResponse {
    return {
      summary: {
        totalUsers: backendResponse.totalUserCount || 0,
        dailyActiveUsers: backendResponse.dailyActiveCount || 0,
        monthlyActiveUsers: backendResponse.monthlyActiveCount || 0,
        averageSessionDuration: backendResponse.avgSessionTime || 0,
        newUserRate: backendResponse.newUserGrowthRate || 0
      },
      monthlyGrowth: (backendResponse.monthlyUserGrowth || []).map((item: any) => ({
        month: item.yearMonth,
        users: item.count
      })),
      ageDistribution: (backendResponse.userAgeGroups || []).map((item: any) => ({
        ageGroup: item.ageRange,
        count: item.userCount
      })),
      dailyNewUsers: (backendResponse.dailyNewUserStats || []).map((item: any) => ({
        date: item.date,
        newUsers: item.count
      })),
      hourlyTraffic: (backendResponse.hourlyUserStats || []).map((item: any) => ({
        hour: item.hourOfDay.toString(),
        users: item.userCount
      })),
      activeUsers: (backendResponse.mostActiveUsers || []).map((item: any) => ({
        name: item.username,
        activity: item.activityScore
      })),
      reportedUsers: (backendResponse.reportedUserStats || []).map((item: any) => ({
        name: item.username,
        reports: item.reportCount
      }))
    };
  },

  // 웹툰 통계 맵퍼
  toWebtoonStats(backendResponse: any): WebtoonStatsResponse {
    return {
      summary: {
        totalWebtoons: backendResponse.totalWebtoonCount || 0,
        reportedWebtoons: backendResponse.reportedCount || 0,
        osmConversions: backendResponse.osmConversionCount || 0,
        averageRating: backendResponse.avgRating || 0
      },
      statusDistribution: (backendResponse.statusStats || []).map((item: any) => ({
        status: item.status,
        count: item.count
      })),
      topRatedWebtoons: (backendResponse.topRatedList || []).map((item: any) => ({
        name: item.title,
        rating: item.rating,
        episodes: item.episodeCount
      })),
      recentWebtoons: (backendResponse.recentlyAdded || []).map((item: any) => ({
        name: item.title,
        date: item.createdAt.split('T')[0],
        genre: item.mainGenre
      })),
      activityStats: (backendResponse.activityMetrics || []).map((item: any) => ({
        name: item.title,
        comments: item.commentCount,
        likes: item.likeCount,
        views: item.viewCount
      })),
      monthlyStats: {
        totalViews: backendResponse.monthlyViewCount || 0,
        totalActivity: backendResponse.monthlyActivityCount || 0
      }
    };
  },

  // 작가 통계 맵퍼
  toAuthorStats(backendResponse: any): AuthorStatsResponse {
    return {
      summary: {
        totalAuthors: backendResponse.totalAuthorCount || 0,
        averageWorksPerAuthor: backendResponse.avgWorksPerAuthor || 0,
        averageRating: backendResponse.avgAuthorRating || 0
      },
      monthlyNewAuthors: (backendResponse.monthlyNewAuthors || []).map((item: any) => ({
        month: item.yearMonth,
        authors: item.count
      })),
      worksDistribution: (backendResponse.workCountDistribution || []).map((item: any) => ({
        works: item.workCount.toString(),
        count: item.authorCount
      })),
      topAuthors: (backendResponse.topAuthorsList || []).map((item: any) => ({
        name: item.authorName,
        totalViews: item.totalViewCount,
        avgRating: item.averageRating
      }))
    };
  },

  // 댓글 통계 맵퍼
  toCommentStats(backendResponse: any): CommentStatsResponse {
    return {
      summary: {
        totalComments: backendResponse.totalCommentCount || 0,
        dailyAverage: backendResponse.avgDailyComments || 0,
        averageLength: backendResponse.avgCommentLength || 0
      },
      dailyComments: (backendResponse.dailyCommentStats || []).map((item: any) => ({
        date: item.date,
        comments: item.count
      })),
      hourlyDistribution: (backendResponse.hourlyCommentStats || []).map((item: any) => ({
        hour: item.hourOfDay.toString(),
        count: item.commentCount
      })),
      topWebtoonsByComments: (backendResponse.mostCommentedWebtoons || []).map((item: any) => ({
        name: item.webtoonTitle,
        comments: item.commentCount,
        avgLength: item.averageLength
      }))
    };
  }
}; 