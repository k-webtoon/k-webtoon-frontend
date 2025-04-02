import { create } from 'zustand';
import { likeWebtoon, unlikeWebtoon, getLikedWebtoons } from '@/app/api/webtoonLikeApi';
import { Like } from '@/entities/like/model/types';

interface LikeState {
    likedWebtoons: Like[];
    isLoading: boolean;
    error: string | null;
    fetchLikedWebtoons: () => Promise<void>;
    likeWebtoon: (id: number) => Promise<void>;
    unlikeWebtoon: (id: number) => Promise<void>;
    isWebtoonLiked: (id: number) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
    likedWebtoons: [],
    isLoading: false,
    error: null,

    // 좋아요한 웹툰 목록 가져오기
    fetchLikedWebtoons: async () => {
        try {
            set({ isLoading: true, error: null });
            const data = await getLikedWebtoons();
            set({ likedWebtoons: data, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : '좋아요 목록을 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 웹툰 좋아요
    likeWebtoon: async (id: number) => {
        try {
            set({ isLoading: true, error: null });
            await likeWebtoon(id);

            // 좋아요 상태 업데이트
            const currentLikes = get().likedWebtoons;
            if (!currentLikes.some(like => like.webtoonId === id)) {
                const newLike: Like = {
                    webtoonId: id,
                    likedAt: new Date().toISOString()
                };
                set({ likedWebtoons: [...currentLikes, newLike], isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : '웹툰 좋아요 처리 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 웹툰 좋아요 취소
    unlikeWebtoon: async (id: number) => {
        try {
            set({ isLoading: true, error: null });
            await unlikeWebtoon(id);

            // 좋아요 상태 업데이트
            const filteredLikes = get().likedWebtoons.filter(like => like.webtoonId !== id);
            set({ likedWebtoons: filteredLikes, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : '웹툰 좋아요 취소 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 특정 웹툰이 좋아요 상태인지 확인
    isWebtoonLiked: (id: number) => {
        return get().likedWebtoons.some(like => like.webtoonId === id);
    }
}));
