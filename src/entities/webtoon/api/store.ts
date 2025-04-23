import { create } from 'zustand';
import { 
    topWebtoons, 
    searchWebtoons, 
    searchWebtoons_Author, 
    searchWebtoons_Tags, 
    getWebtoonById,
    getPopularByFavorites,
    getPopularByLikes,
    getPopularByWatched,
    fetchWebtoonRecommendations
} from '@/entities/webtoon/api/api';
import {WebtoonState, RecommendationRequest} from '@/entities/webtoon/model/types';

export const useWebtoonStore = create<WebtoonState>((set) => ({
    // 초기 상태
    currentWebtoon: null,
    searchResults: null,
    topWebtoonList: null,
    popularByFavorites: null,
    popularByLikes: null,
    popularByWatched: null,
    recommendations: [],
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
    
    // 즐겨찾기 기준 인기 웹툰 조회
    fetchPopularByFavorites: async (size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getPopularByFavorites(size);
            set({ popularByFavorites: data, isLoading: false });
        } catch (error) {
            console.error('인기 웹툰(즐겨찾기) 로딩 오류:', error);
            set({
                error: '인기 웹툰(즐겨찾기)을 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },
    
    // 좋아요 기준 인기 웹툰 조회
    fetchPopularByLikes: async (size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getPopularByLikes(size);
            set({ popularByLikes: data, isLoading: false }); // 바로 배열 데이터 저장
        } catch (error) {
            console.error('인기 웹툰(좋아요) 로딩 오류:', error);
            set({
                error: '인기 웹툰(좋아요)을 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },
    
    // 봤어요 기준 인기 웹툰 조회
    fetchPopularByWatched: async (size = 10) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getPopularByWatched(size);
            set({ popularByWatched: data, isLoading: false });
        } catch (error) {
            console.error('인기 웹툰(봤어요) 로딩 오류:', error);
            set({
                error: '인기 웹툰(봤어요)을 불러오는 중 오류가 발생했습니다.',
                isLoading: false
            });
        }
    },
    
    // 웹툰 추천 조회
    fetchRecommendWebtoons: async (requestData: RecommendationRequest) => {
        try {
            set({ isLoading: true, error: null });
            
            const data = await fetchWebtoonRecommendations(requestData);
            
            // API에서 에러 객체를 반환한 경우
            if (data && typeof data === 'object' && 'error' in data) {
                console.warn(`[Store] 추천 API 오류: ${data.error}`, data);
                
                if (data.error === 'SERVER_ERROR' && data.status === 500) {
                    set({ 
                        recommendations: [],
                        error: 'SERVER_ERROR',
                        isLoading: false 
                    });
                    return { error: 'SERVER_ERROR', status: 500 };
                }
                
                set({ 
                    recommendations: [],
                    error: data.error,
                    isLoading: false 
                });
                return data;
            }
            
            const safeData = Array.isArray(data) ? data : [];
            set({ recommendations: safeData, isLoading: false });
            return safeData;
        } catch (error) {
            console.error('[Store] 추천 웹툰 요청 오류:', error);
            set({ 
                recommendations: [],
                error: 'UNEXPECTED_ERROR',
                isLoading: false 
            });
            return { error: 'UNEXPECTED_ERROR', message: String(error) };
        }
    },

    resetRecommendations: () => {
        set({ recommendations: [] });
    },
}));

