import { create } from 'zustand';
import { getUserLikedWebtoons, toggleWebtoonLike } from "@/entities/webtoon-like/api/api.ts";
import { WebtoonLikeRequest, WebtoonLikeState, WebtoonLikeResponse } from "@/entities/webtoon-like/model/types.ts";
import { useAuthStore } from "@/entities/auth/api/store.ts";

export const useWebtoonLikeStore = create<WebtoonLikeState>((set) => ({
    isLoading: false,
    error: null,
    likedWebtoons: new Map<number, boolean>(),
    temporaryLikes: new Map<number, boolean>(),

    // 사용자의 좋아요 목록 조회
    getLikedWebtoons: async (userId: number) => {
        try {
            // 인증 스토어에서 현재 로그인한 사용자 정보 가져오기
            const currentUserInfo = useAuthStore?.getState()?.userInfo;
            const currentUserId = currentUserInfo?.userId;

            set({ isLoading: true, error: null });
            const response = await getUserLikedWebtoons(userId);

            // 요청된 사용자 ID가 현재 로그인한 사용자와 같은지 확인
            if (currentUserId && userId === currentUserId) {
                // 현재 로그인한 사용자의 좋아요 목록이면 스토어에 저장
                const newLikedMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    newLikedMap.set(item.webtoonId, item.isLiked);
                });

                set({
                    likedWebtoons: newLikedMap,
                    isLoading: false
                });

            } else {
                // 다른 사용자의 좋아요 목록이면 임시 상태로만 저장
                const tempLikedMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    tempLikedMap.set(item.webtoonId, item.isLiked);
                });

                set({
                    temporaryLikes: tempLikedMap,
                    isLoading: false
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '좋아요 목록을 불러오는 데 실패했습니다.';
            set({ isLoading: false, error: errorMessage });
            return [];
        }
    },

    // 특정 웹툰 좋아요 토글
    toggleLike: async (request: WebtoonLikeRequest): Promise<WebtoonLikeResponse | null> => {
        try {
            set({ isLoading: true, error: null });
            const response = await toggleWebtoonLike(request.webtoonId);

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
            likedWebtoons: new Map<number, boolean>(),
            temporaryLikes: new Map<number, boolean>()
        });
    }
}));