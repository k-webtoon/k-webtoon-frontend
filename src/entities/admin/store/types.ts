import { UserStatsResponse } from '@/entities/admin/api/types';

export interface UserStatsState {
  data: UserStatsResponse | null;
  loading: boolean;
  error: string | null;
}

export interface UserStatsStore extends UserStatsState {
  fetchUserStats: () => Promise<void>;
  reset: () => void;
} 