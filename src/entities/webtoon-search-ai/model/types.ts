import {WebtoonInfo} from "@/entities/webtoon/model/types.ts";

// ===============
// 도메인 엔티티 타입
// ===============

// 텍스트 검색 결과 타입
export interface TextSearchResultItem {
    id: number;
    similarity: number;
}

// 웹툰 추천 결과 타입
export interface WebtoonRecommendationItem extends TextSearchResultItem {
    titleName: string;
}

// ===============
// API 요청/응답 타입
// ===============

// 텍스트 기반 AI 검색 API 요청 타입
export interface TextSearchRequest {
    textQuery: string;
    options?: TextSearchOptions;
}

// 텍스트 기반 AI 검색 API 응답 타입
export interface TextBasedRecommendationResponse {
    response: WebtoonRecommendationItem[];
}

// ===============
// 상태 관리 타입
// ===============

export interface TextSearchOptions {
    // 이 값 이상의 유사도를 가진 결과만 반환
    filterThreshold?: number;
    // 반환할 최대 결과 개수
    limit?: number;
    // 상세 정보 포함 여부
    includeDetails?: boolean;
}

export interface TextBasedRecommendationState {
    // 상태 데이터
    recommendations: WebtoonRecommendationItem[];
    isLoading: boolean;
    fetchingDetails: boolean;
    error: string | null;
    lastSearchQuery: string;
    searchOptions: TextSearchOptions;
    webtoonDetails: Record<number, WebtoonInfo>;

    // 액션 메서드
    fetchTextBasedRecommendations: (textQuery: string, options?: TextSearchOptions) => Promise<void>;
    fetchWebtoonDetails: (id: number) => Promise<WebtoonInfo | null>;
    fetchAllRecommendationDetails: () => Promise<void>;
    setSearchOptions: (options: Partial<TextSearchOptions>) => void;
    clearRecommendations: () => void;
    filterByThreshold: (threshold: number) => void;
    sortBySimilarity: () => void;
    limitResults: (limit: number) => void;
}