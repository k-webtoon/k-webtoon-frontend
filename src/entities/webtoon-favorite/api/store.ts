import { create } from 'zustand';
import { getUserFavoriteWebtoons, toggleWebtoonFavorite } from "@/entities/webtoon-favorite/api/api.ts";
import { WebtoonFavoriteRequest, WebtoonFavoriteState, WebtoonFavoriteResponse } from "@/entities/webtoon-favorite/model/types.ts";
import { useAuthStore } from "@/entities/auth/api/store.ts";

export const useWebtoonFavoriteStore = create<WebtoonFavoriteState>((set) => ({
    isLoading: false,
    error: null,
    favoriteWebtoons: new Map<number, boolean>(),
    temporaryFavorites: new Map<number, boolean>(),

    // 사용자의 즐겨찾기 목록 조회
    getFavoriteWebtoons: async (userId?: number) => {
        try {
            // 인증 스토어에서 현재 로그인한 사용자 정보 가져오기
            const currentUserInfo = useAuthStore?.getState()?.userInfo;
            const currentUserId = currentUserInfo?.userId;

            set({ isLoading: true, error: null });
            const response = await getUserFavoriteWebtoons(userId);

            // 요청된 사용자 ID가 현재 로그인한 사용자와 같은지 확인
            if (currentUserId && userId === currentUserId) {
                // 현재 로그인한 사용자의 즐겨찾기 목록이면 스토어에 저장
                const newFavoriteMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    newFavoriteMap.set(item.webtoonId, item.isFavorite);
                });

                set({
                    favoriteWebtoons: newFavoriteMap,
                    isLoading: false
                });
            } else {
                // 다른 사용자의 즐겨찾기 목록이면 임시 상태로만 저장
                const tempFavoriteMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    tempFavoriteMap.set(item.webtoonId, item.isFavorite);
                });

                set({
                    temporaryFavorites: tempFavoriteMap,
                    isLoading: false
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '즐겨찾기 목록을 불러오는 데 실패했습니다.';
            set({ isLoading: false, error: errorMessage });
            return [];
        }
    },

    // 특정 웹툰 즐겨찾기 토글
    toggleFavorite: async (request: WebtoonFavoriteRequest): Promise<WebtoonFavoriteResponse | null> => {
        try {
            set({ isLoading: true, error: null });
            const response = await toggleWebtoonFavorite(request.webtoonId);

            set((state) => ({
                favoriteWebtoons: new Map(state.favoriteWebtoons).set(request.webtoonId, response.isFavorite),
                isLoading: false
            }));

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '웹툰 즐겨찾기 처리 중 오류가 발생했습니다.';
            set({ isLoading: false, error: errorMessage });
            return null;
        }
    },

    // 특정 웹툰의 즐겨찾기 상태 설정
    setFavoriteStatus: (webtoonId: number, isFavorite: boolean) => {
        set((state) => ({
            favoriteWebtoons: new Map(state.favoriteWebtoons).set(webtoonId, isFavorite)
        }));
    },

    // 스토어 초기화
    reset: () => {
        set({
            isLoading: false,
            error: null,
            favoriteWebtoons: new Map<number, boolean>(),
            temporaryFavorites: new Map<number, boolean>()
        });
    }
}));