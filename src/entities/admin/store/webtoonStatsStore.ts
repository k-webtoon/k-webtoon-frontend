import { create } from 'zustand';
import { WebtoonStatsResponse } from '../api/types';
import { webtoonStatsApi } from '../api/webtoonStatsApi';

interface WebtoonStatsState {
  data: WebtoonStatsResponse | null;
  loading: boolean;
  error: string | null;
  fetchWebtoonStats: () => Promise<void>;
}

export const useWebtoonStatsStore = create<WebtoonStatsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchWebtoonStats: async () => {
    set({ loading: true, error: null });
    try {
      const [
        totalCount,
        genreDistribution,
        osmuRatio,
        scoreStats,
        commentCount,
        deletedCommentRatio,
      ] = await Promise.all([
        webtoonStatsApi.getTotalCount(),
        webtoonStatsApi.getGenreDistribution(),
        webtoonStatsApi.getOsmuRatio(),
        webtoonStatsApi.getScoreStats(),
        webtoonStatsApi.getCommentCount(),
        webtoonStatsApi.getDeletedCommentRatio(),
      ]);

      set({
        data: {
          totalCount,
          genreDistribution,
          osmuRatio,
          scoreStats: scoreStats as { average: number; standardDeviation: number },
          commentStats: {
            totalCount: commentCount,
            deletedRatio: deletedCommentRatio,
          },
        },
        loading: false,
      });
    } catch (error) {
      set({ error: '통계 데이터를 불러오는데 실패했습니다.', loading: false });
    }
  },
})); 