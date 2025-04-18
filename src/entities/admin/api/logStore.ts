import { create } from "zustand";
import { adminLogStatsApi } from "@/entities/admin/api/logApi";

interface LogStatsState {
  dailyUsers: number;
  weeklyUsers: number;
  monthlyUsers: number;
  topWebtoon: WebtoonViewCountResponse | null;
  topKeywords: KeywordRankResponse[];
  pageDwellTimes: PageDwellTimeResponse[];
  loading: boolean;
  error: string | null;
  fetchLogStats: () => Promise<void>;
}

interface WebtoonViewCountResponse {
  id: number;
  titleName: string;
  author: string;
  thumbnailUrl: string;
}

interface KeywordRankResponse {
  keyword: string;
  count: number;
}

interface PageDwellTimeResponse {
  page: string;
  avgDurationSeconds: number;
}

export const useLogStatsStore = create<LogStatsState>((set) => ({
  dailyUsers: 0,
  weeklyUsers: 0,
  monthlyUsers: 0,
  topWebtoon: null,
  topKeywords: [],
  pageDwellTimes: [],
  loading: false,
  error: null,

  fetchLogStats: async () => {
    set({ loading: true, error: null });
    try {
      const [daily, weekly, monthly, webtoon, keywords, dwellTime] =
        await Promise.all([
          adminLogStatsApi.getDailyActiveUsers(),
          adminLogStatsApi.getRecent7DaysUsers(),
          adminLogStatsApi.getRecent30DaysUsers(),
          adminLogStatsApi.getMostVisitedWebtoonDetail(),
          adminLogStatsApi.getTop10Keywords(),
          adminLogStatsApi.getPageDwellTimeStats(),
        ]);

      set({
        dailyUsers: daily.value,
        weeklyUsers: weekly.value,
        monthlyUsers: monthly.value,
        topWebtoon: webtoon,
        topKeywords: keywords,
        pageDwellTimes: dwellTime,
      });
    } catch (error: any) {
      if (error.response?.status === 403) {
        window.location.href = "/admin/login";
      }
      set({ error: "로그 통계를 불러오는 데 실패했습니다." });
    } finally {
      set({ loading: false });
    }
  },
}));
