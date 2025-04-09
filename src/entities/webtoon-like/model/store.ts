import { create } from 'zustand';
import { webtoonLike, fetchUserLikes } from "@/entities/webtoon-like/api/api.ts";
import { WebtoonLikeRequest, WebtoonLikeState, WebtoonLikeResponse } from "@/entities/webtoon-like/ui/types.ts";

export const useWebtoonLikeStore = create<WebtoonLikeState>((set) => ({
    isLoading: false,
    error: null,
    likedWebtoons: new Map<number, boolean>(),

    // 사용자의 좋아요 목록 조회
    fetchAllLikes: async (userId?: number) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetchUserLikes(userId);

            const newLikedMap = new Map<number, boolean>();
            response.forEach((item:any) => {
                newLikedMap.set(item.webtoonId, item.isLiked);
            });

            set({ likedWebtoons: newLikedMap, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '좋아요 목록을 불러오는 데 실패했습니다.';
            set({ isLoading: false, error: errorMessage });
        }
    },

    // 특정 웹툰 좋아요 토글
    toggleLike: async (request: WebtoonLikeRequest): Promise<WebtoonLikeResponse | null> => {
        try {
            set({ isLoading: true, error: null });

            const response = await webtoonLike(request.webtoonId);

            set((state) => ({
                likedWebtoons: new Map(state.likedWebtoons).set(request.webtoonId, response.isLiked),
                isLoading: false
            }));

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '웹툰 좋아요 처리 중 오류가 발생했습니다.';
            set({ isLoading: false, error: errorMessage });
            return null;
        }
    },

    // 특정 웹툰의 좋아요 상태 설정
    setLikedStatus: (webtoonId: number, isLiked: boolean) => {
        set((state) => ({
            likedWebtoons: new Map(state.likedWebtoons).set(webtoonId, isLiked)
        }));
    },

    // 스토어 초기화
    reset: () => {
        set({
            isLoading: false,
            error: null,
            likedWebtoons: new Map<number, boolean>()
        });
    }
}));