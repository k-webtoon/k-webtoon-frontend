import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    WebtoonRecommendationItem,
    TextSearchOptions
} from '@/entities/webtoon-search-ai/model/types.ts';
import {
    getTextBasedWebtoonRecommendations,
    filterRecommendationsBySimilarity,
    sortRecommendationsBySimilarity
} from '@/entities/webtoon-search-ai/api/api.ts';
import { getWebtoonById } from '@/entities/webtoon/api/api.ts';
import { WebtoonInfo } from '@/entities/webtoon/model/types.ts';

// 텍스트 기반 웹툰 추천 스토어 상태 인터페이스
interface TextBasedRecommendationState {
    // 상태
    recommendations: WebtoonRecommendationItem[];
    isLoading: boolean;
    fetchingDetails: boolean;
    error: string | null;
    lastSearchQuery: string;
    searchOptions: TextSearchOptions;
    webtoonDetails: Record<number, WebtoonInfo>;

    // 액션
    fetchTextBasedRecommendations: (textQuery: string, options?: TextSearchOptions) => Promise<void>;
    fetchWebtoonDetails: (id: number) => Promise<WebtoonInfo | null>;
    fetchAllRecommendationDetails: () => Promise<void>;
    setSearchOptions: (options: Partial<TextSearchOptions>) => void;
    clearRecommendations: () => void;
    filterByThreshold: (threshold: number) => void;
    sortBySimilarity: () => void;
    limitResults: (limit: number) => void;
}

// 기본 검색 옵션
const defaultSearchOptions: TextSearchOptions = {
    filterThreshold: 0.3,
    limit: 10,
    includeDetails: false
};

export const useTextBasedRecommendationStore = create<TextBasedRecommendationState>()(
    devtools(
        (set, get) => ({
            recommendations: [],
            isLoading: false,
            fetchingDetails: false,
            error: null,
            lastSearchQuery: '',
            searchOptions: { ...defaultSearchOptions },
            webtoonDetails: {},

            // 텍스트 기반 웹툰 추천 가져오기 액션
            fetchTextBasedRecommendations: async (textQuery: string, options?: TextSearchOptions) => {
                try {
                    set({ isLoading: true, error: null, lastSearchQuery: textQuery });

                    const mergedOptions = {
                        filterThreshold: options?.filterThreshold || get().searchOptions.filterThreshold || 0,
                        limit: options?.limit || get().searchOptions.limit || 0
                    };

                    const results = await getTextBasedWebtoonRecommendations(textQuery, mergedOptions);

                    const fullOptions = {
                        ...get().searchOptions,
                        ...(options || {}),
                    };

                    set({
                        recommendations: results,
                        isLoading: false,
                        searchOptions: fullOptions
                    });

                    if (fullOptions.includeDetails) {
                        get().fetchAllRecommendationDetails();
                    }
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : '텍스트 기반 웹툰 추천을 가져오는 중 오류가 발생했습니다'
                    });
                }
            },

            // 단일 웹툰 세부 정보 가져오기
            fetchWebtoonDetails: async (id: number) => {
                try {
                    if (get().webtoonDetails[id]) {
                        return get().webtoonDetails[id];
                    }

                    set({ fetchingDetails: true });

                    const webtoonInfo = await getWebtoonById(id);

                    set(state => ({
                        webtoonDetails: {
                            ...state.webtoonDetails,
                            [id]: webtoonInfo
                        },
                        fetchingDetails: false
                    }));

                    return webtoonInfo;
                } catch (error) {
                    set({
                        fetchingDetails: false,
                        error: error instanceof Error ? error.message : `웹툰 ID ${id}의 세부 정보를 가져오는 중 오류가 발생했습니다`
                    });
                    return null;
                }
            },

            // 모든 추천 웹툰의 세부 정보 가져오기
            fetchAllRecommendationDetails: async () => {
                try {
                    set({ fetchingDetails: true });

                    const { recommendations } = get();
                    const webtoonIds = recommendations.map(item => item.id);

                    const uniqueIds = [...new Set(webtoonIds)].filter(
                        id => !get().webtoonDetails[id]
                    );

                    if (uniqueIds.length === 0) {
                        set({ fetchingDetails: false });
                        return;
                    }

                    const detailsPromises = uniqueIds.map(id => getWebtoonById(id));
                    const webtoonDetails = await Promise.all(detailsPromises);

                    const newDetailsObj = webtoonDetails.reduce((acc, detail, index) => {
                        if (detail) {
                            acc[uniqueIds[index]] = detail;
                        }
                        return acc;
                    }, {} as Record<number, WebtoonInfo>);

                    set(state => ({
                        webtoonDetails: {
                            ...state.webtoonDetails,
                            ...newDetailsObj
                        },
                        fetchingDetails: false
                    }));
                } catch (error) {
                    set({
                        fetchingDetails: false,
                        error: error instanceof Error ? error.message : '웹툰 세부 정보를 가져오는 중 오류가 발생했습니다'
                    });
                }
            },

            // 검색 옵션 설정
            setSearchOptions: (options: Partial<TextSearchOptions>) => {
                set({
                    searchOptions: {
                        ...get().searchOptions,
                        ...options
                    }
                });
            },

            // 추천 결과 초기화
            clearRecommendations: () => {
                set({
                    recommendations: [],
                    lastSearchQuery: '',
                    error: null
                });
            },

            // 유사도 기준 필터링
            filterByThreshold: (threshold: number) => {
                const { recommendations } = get();
                set({
                    recommendations: filterRecommendationsBySimilarity(recommendations, threshold),
                    searchOptions: {
                        ...get().searchOptions,
                        filterThreshold: threshold
                    }
                });
            },

            // 유사도 기준 정렬
            sortBySimilarity: () => {
                const { recommendations } = get();
                set({
                    recommendations: sortRecommendationsBySimilarity(recommendations)
                });
            },

            // 결과 개수 제한
            limitResults: (limit: number) => {
                const { recommendations } = get();
                set({
                    recommendations: recommendations.slice(0, limit),
                    searchOptions: {
                        ...get().searchOptions,
                        limit
                    }
                });
            }
        }),
        { name: 'text-based-recommendation-store' }
    )
);