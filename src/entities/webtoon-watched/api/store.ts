import { create } from 'zustand';
import { getUserWatchedWebtoons, toggleWebtoonWatched } from "@/entities/webtoon-watched/api/api.ts";
import { WebtoonWatchedRequest, WebtoonWatchedState, WebtoonWatchedResponse } from "@/entities/webtoon-watched/model/types.ts";
import { useAuthStore } from "@/entities/auth/api/store.ts";

export const useWebtoonWatchedStore = create<WebtoonWatchedState>((set) => ({
    isLoading: false,
    error: null,
    watchedWebtoons: new Map<number, boolean>(),
    temporaryWatched: new Map<number, boolean>(),

    // 사용자의 봤어요 목록 조회
    getWatchedWebtoons: async (userId: number) => {
        try {
            // 인증 스토어에서 현재 로그인한 사용자 정보 가져오기
            const currentUserInfo = useAuthStore?.getState()?.userInfo;
            const currentUserId = currentUserInfo?.userId;

            set({ isLoading: true, error: null });
            const response = await getUserWatchedWebtoons(userId);

            // 요청된 사용자 ID가 현재 로그인한 사용자와 같은지 확인
            if (currentUserId && userId === currentUserId) {
                // 현재 로그인한 사용자의 봤어요 목록이면 스토어에 저장
                const newWatchedMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    newWatchedMap.set(item.webtoonId, item.isWatched);
                });

                set({
                    watchedWebtoons: newWatchedMap,
                    isLoading: false
                });
            } else {
                // 다른 사용자의 봤어요 목록이면 임시 상태로만 저장
                const tempWatchedMap = new Map<number, boolean>();
                response.forEach((item: any) => {
                    tempWatchedMap.set(item.webtoonId, item.isWatched);
                });

                set({
                    temporaryWatched: tempWatchedMap,
                    isLoading: false
                });
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '봤어요 목록을 불러오는 데 실패했습니다.';
            set({ isLoading: false, error: errorMessage });
            return [];
        }
    },

    // 특정 웹툰 봤어요 토글
    toggleWatched: async (request: WebtoonWatchedRequest): Promise<WebtoonWatchedResponse | null> => {
        try {
            set({ isLoading: true, error: null });
            const response = await toggleWebtoonWatched(request.webtoonId);

            set((state) => ({
                watchedWebtoons: new Map(state.watchedWebtoons).set(request.webtoonId, response.isWatched),
                isLoading: false
            }));

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '웹툰 봤어요 처리 중 오류가 발생했습니다.';
            set({ isLoading: false, error: errorMessage });
            return null;
        }
    },

    // 특정 웹툰의 봤어요 상태 설정
    setWatchedStatus: (webtoonId: number, isWatched: boolean) => {
        set((state) => ({
            watchedWebtoons: new Map(state.watchedWebtoons).set(webtoonId, isWatched)
        }));
    },

    // 스토어 초기화
    reset: () => {
        set({
            isLoading: false,
            error: null,
            watchedWebtoons: new Map<number, boolean>(),
            temporaryWatched: new Map<number, boolean>()
        });
    }
}));