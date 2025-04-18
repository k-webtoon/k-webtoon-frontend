import { create } from 'zustand';
import { userStatsApi } from '@/entities/admin/api/userStatsApi';
import { UserStatsStore } from './types';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const useUserStatsStore = create<UserStatsStore>((set) => ({
  ...initialState,

  fetchUserStats: async () => {
    try {
      set({ loading: true, error: null });
      
      // 개별 API 호출
      const [
        totalCountRes,
        ageDistRes,
        genderDistRes,
        genderAgeRes,
        statusRes,
        dailyRes
      ] = await Promise.all([
        userStatsApi.getTotalUserCount(),
        userStatsApi.getAgeDistribution(),
        userStatsApi.getGenderDistribution(),
        userStatsApi.getGenderAgeActivity(),
        userStatsApi.getUserStatusRatio(),
        userStatsApi.getDailySignups()
      ]);

      // 응답 데이터를 하나의 객체로 통합
      set({ 
        data: {
          totalCount: totalCountRes.data,
          ageDistribution: ageDistRes.data,
          genderDistribution: genderDistRes.data,
          genderAgeActivity: genderAgeRes.data,
          userStatusRatio: statusRes.data,
          dailySignups: dailyRes.data
        },
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '통계 데이터를 불러오는 중 오류가 발생했습니다',
        loading: false 
      });
    }
  },

  reset: () => set(initialState),
})); 