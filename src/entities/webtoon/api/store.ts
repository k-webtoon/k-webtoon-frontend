import { create } from 'zustand';
import { topWebtoons, searchWebtoons, searchWebtoons_Author, searchWebtoons_Tags, getWebtoonById } from '@/entities/webtoon/api/api';
import { WebtoonState } from '@/entities/webtoon/model/types';

// Zustand 스토어 생성
export const useWebtoonStore = create<WebtoonState>((set) => ({
    // 초기 상태
    currentWebtoon: null,
    searchResults: null,
    topWebtoonList: null,
    isLoading: false,
    error: null,

    // 아이디로 웹툰 검색 API (단일)
    fetchWebtoonById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getWebtoonById(id);
            set({ currentWebtoon: data, isLoading: false });
        } catch (error) {
            console.error('웹툰 상세 조회 오류:', error);
            set({
                error: '웹툰 상세 정보를 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },

    // 단어로 웹툰 검색 API (리스트)
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

    // 작가로 웹툰 검색 API (리스트)
    searchWebtoonsByAuthor: async (authorName: string, page: number = 0, size: number = 10) => {
        set({ isLoading: true, error: null });
        try {
          const data = await searchWebtoons_Author(authorName, page, size);
          set({ searchResults: data, isLoading: false });
        } catch (error) {
          console.error('웹툰 작가 검색 오류:', error);
          set({
            error: '작가로 웹툰 검색 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },
    
      // 태그로 웹툰 검색
      searchWebtoonsByTags: async (tagName: string, page: number = 0, size: number = 10) => {
        set({ isLoading: true, error: null });
        try {
          const data = await searchWebtoons_Tags(tagName, page, size); // 태그로 검색하는 API 호출
          set({ searchResults: data, isLoading: false });
        } catch (error) {
          console.error('태그로 웹툰 검색 오류:', error);
          set({
            error: '태그로 웹툰 검색 중 오류가 발생했습니다.',
            isLoading: false
          });
        }
      },


    // 조회수 높은 웹툰 조회 (리스트)
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

    // 현재 웹툰 상태 초기화
    resetCurrentWebtoon: () => {
        set({ currentWebtoon: null });
    },

    // 검색 결과 초기화
    resetSearchResults: () => {
        set({ searchResults: null });
    },
}));