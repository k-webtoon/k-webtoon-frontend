import { create } from 'zustand';
import { topWebtoons, searchWebtoons } from '@/app/api/webtoonsApi.ts';
import { WebtoonInfo } from '@/entities/webtoon/model/types.ts';

// 상태 인터페이스 정의
interface WebtoonState {
    // 상태 데이터
    topWebtoonList: WebtoonInfo | null;
    searchResults: WebtoonInfo | null;
    isLoading: boolean;
    error: string | null;

    // 액션
    fetchTopWebtoons: (page?: number, size?: number) => Promise<void>;
    searchWebtoonsByName: (titleName: string) => Promise<void>;
    resetSearchResults: () => void;
}

// Zustand 스토어 생성
export const useWebtoonStore = create<WebtoonState>((set) => ({
    // 초기 상태
    topWebtoonList: null,
    searchResults: null,
    isLoading: false,
    error: null,

    // 인기 웹툰 목록 가져오기
    fetchTopWebtoons: async (page = 0, size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const data = await topWebtoons(page, size);
            set({ topWebtoonList: data, isLoading: false });
        } catch (error) {
            console.error('인기 웹툰 로딩 오류:', error);
            set({
                error: '인기 웹툰을 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 웹툰 이름으로 검색
    searchWebtoonsByName: async (titleName: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await searchWebtoons(titleName);
            set({ searchResults: data, isLoading: false });
        } catch (error) {
            console.error('웹툰 검색 오류:', error);
            set({
                error: '웹툰 검색 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 검색 결과 초기화
    resetSearchResults: () => {
        set({ searchResults: null });
    },
}));