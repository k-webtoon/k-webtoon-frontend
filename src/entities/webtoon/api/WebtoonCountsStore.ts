import { create } from 'zustand';

interface CountsState {
  likeCounts: Map<number, number>;
  favoriteCounts: Map<number, number>;
  watchedCounts: Map<number, number>;
  
  // 좋아요 카운트
  increaseLikeCount: (webtoonId: number) => void;
  decreaseLikeCount: (webtoonId: number) => void;
  
  // 즐겨찾기 카운트
  increaseFavoriteCount: (webtoonId: number) => void;
  decreaseFavoriteCount: (webtoonId: number) => void;
  
  // 봤어요 카운트
  increaseWatchedCount: (webtoonId: number) => void;
  decreaseWatchedCount: (webtoonId: number) => void;
  
  // 각 타입별 카운트 조회
  getLikeCount: (webtoonId: number) => number;
  getFavoriteCount: (webtoonId: number) => number;
  getWatchedCount: (webtoonId: number) => number;
  
  reset: () => void;
}

export const useWebtoonCountsStore = create<CountsState>((set, get) => ({
  likeCounts: new Map<number, number>(),
  favoriteCounts: new Map<number, number>(),
  watchedCounts: new Map<number, number>(),
  
  // 좋아요
  increaseLikeCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.likeCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, currentCount + 1);
      return { likeCounts: newCounts };
    });
  },
  
  decreaseLikeCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.likeCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, Math.max(0, currentCount - 1));
      return { likeCounts: newCounts };
    });
  },
  
  // 즐겨찾기
  increaseFavoriteCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.favoriteCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, currentCount + 1);
      return { favoriteCounts: newCounts };
    });
  },
  
  decreaseFavoriteCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.favoriteCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, Math.max(0, currentCount - 1));
      return { favoriteCounts: newCounts };
    });
  },
  
  // 봤어요
  increaseWatchedCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.watchedCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, currentCount + 1);
      return { watchedCounts: newCounts };
    });
  },
  
  decreaseWatchedCount: (webtoonId: number) => {
    set((state) => {
      const newCounts = new Map(state.watchedCounts);
      const currentCount = newCounts.get(webtoonId) || 0;
      newCounts.set(webtoonId, Math.max(0, currentCount - 1));
      return { watchedCounts: newCounts };
    });
  },
  
  getLikeCount: (webtoonId: number) => {
    return get().likeCounts.get(webtoonId) || 0;
  },
  
  getFavoriteCount: (webtoonId: number) => {
    return get().favoriteCounts.get(webtoonId) || 0;
  },
  
  getWatchedCount: (webtoonId: number) => {
    return get().watchedCounts.get(webtoonId) || 0;
  },
  
  reset: () => {
    set({ 
      likeCounts: new Map<number, number>(),
      favoriteCounts: new Map<number, number>(),
      watchedCounts: new Map<number, number>()
    });
  }
}));