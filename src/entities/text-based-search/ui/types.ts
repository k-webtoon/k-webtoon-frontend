/**
 * 텍스트 검색 결과 아이템 공통 인터페이스
 */
export interface TextSearchResultItem {
    id: number;
    similarity: number;
}

/**
 * 웹툰 추천 결과 아이템
 */
export interface WebtoonRecommendationItem extends TextSearchResultItem {
    titleName: string;
}

/**
 * 텍스트 기반 웹툰 추천 응답 타입
 */
export interface TextBasedRecommendationResponse {
    response: WebtoonRecommendationItem[];
}

/**
 * 텍스트 기반 검색/추천 결과에 대한 옵션 타입
 */
export interface TextSearchOptions {
    /**
     * 유사도 임계값 (0~1 사이의 값)
     * 이 값 이상의 유사도를 가진 결과만 반환
     */
    filterThreshold?: number;

    /**
     * 반환할 최대 결과 개수
     */
    limit?: number;

    /**
     * 상세 정보 포함 여부
     * true일 경우 결과의 상세 정보를 함께 조회
     */
    includeDetails?: boolean;
}

/**
 * 텍스트 기반 검색/추천 요청 타입
 */
export interface TextSearchRequest {
    /**
     * 사용자가 입력한 텍스트 기반 검색/추천 요청 쿼리
     */
    textQuery: string;

    /**
     * 검색/추천 옵션
     */
    options?: TextSearchOptions;
}