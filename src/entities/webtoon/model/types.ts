// ===============
// 도메인 엔티티 타입
// ===============

// 웹툰 장르 타입 (영문)
export type GenreType =
    | 'DRAMA'
    | 'FANTASY'
    | 'ACTION'
    | 'ROMANCE'
    | 'THRILLER'
    | 'HUMOR';

// 한글 장르 타입
export type KoreanGenreType =
    | '드라마'
    | '판타지'
    | '액션'
    | '로맨스'
    | '스릴러'
    | '개그';

// 연령 제한 타입
export type AgeRating = '전체연령가' | '12세 이용가' | '15세 이용가' | '성인';

// 웹툰 정보 타입
export interface WebtoonInfo {
    id: number;
    titleId: number;
    titleName: string;
    author: string;
    adult: boolean;
    age: AgeRating;
    finish: boolean;
    thumbnailUrl: string;
    synopsis: string;
    rankGenreTypes: GenreType[];
    starScore: number;
    totalCount?: number;
    sim?: number;
    
    // AI 추천 API 필드
    title_name?: string;
    thumbnail?: string;
    genre?: string;
    genre_list?: string[];
}

// ===============
// 상수 및 유틸리티
// ===============

// 장르 맵핑 (영문 -> 한글)
export const GENRE_MAPPING: Record<GenreType, KoreanGenreType> = {
    'DRAMA': '드라마',
    'FANTASY': '판타지',
    'ACTION': '액션',
    'ROMANCE': '로맨스',
    'THRILLER': '스릴러',
    'HUMOR': '개그',
};

// 장르 한글 매핑 함수
export const mapGenre = (genre: GenreType): KoreanGenreType => {
    return GENRE_MAPPING[genre] || genre as unknown as KoreanGenreType;
};

// ===============
// API 관련 타입
// ===============

// 아이디로 웹툰 검색 API 응답 타입
export type WebtoonResponse = WebtoonInfo;

// 단어로 웹툰 검색 API,  작가로 웹툰 검색 API, 조회수 높은 웹툰 조회 API 응답 타입 (페이지네이션)
export interface PaginatedResponse<T> {
    content: T[];
    pageSize?: number;
    totalPages?: number;
    totalElements?: number;
    currentPage?: number;
}
export type WebtoonPaginatedResponse = PaginatedResponse<WebtoonInfo>;


// 웹툰 추천 API 요청 타입
export interface RecommendationRequest {
    use_popularity: boolean;
    use_art_style: boolean;
    use_tags: boolean;
}

// ===============
// 상태 관리 타입
// ===============

// 상태 인터페이스 정의
export interface WebtoonState {
    // 상태 데이터
    currentWebtoon: WebtoonInfo | null;
    searchResults: WebtoonPaginatedResponse | null;
    topWebtoonList: WebtoonPaginatedResponse | null;
    popularByFavorites: WebtoonInfo[] | null;
    popularByLikes: WebtoonInfo[] | null;
    popularByWatched: WebtoonInfo[] | null;
    recommendations: WebtoonInfo[];
    isLoading: boolean;
    error: string | null;

    // 액션
    fetchWebtoonById: (id: number) => Promise<void>;
    searchWebtoonsByName: (titleName: string) => Promise<void>;
    fetchTopWebtoons: (page?: number, size?: number) => Promise<void>;
    fetchPopularByFavorites: (page?: number, size?: number) => Promise<void>;
    fetchPopularByLikes: (page?: number, size?: number) => Promise<void>;
    fetchPopularByWatched: (page?: number, size?: number) => Promise<void>;
    fetchRecommendWebtoons: (requestData: RecommendationRequest) => Promise<void>;
    resetCurrentWebtoon: () => void;
    resetSearchResults: () => void;
    resetRecommendations: () => void;
}