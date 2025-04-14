// ===============
// 도메인 엔티티 타입
// ===============

// 웹툰 즐겨찾기 타입
export interface WebtoonFavorite {
    webtoonId: number;
    isFavorite: boolean;
}

// ===============
// API 요청/응답 타입
// ===============

// 사용자 웹툰 즐겨찾기 목록 조회 API 요청 타입
export interface UserFavoritesRequest {
    userId: number;
}

// 사용자 웹툰 즐겨찾기 목록 조회 API 응답 타입
export type UserFavoritesResponseItem = WebtoonFavorite;
export type UserFavoritesResponse = UserFavoritesResponseItem[];

// 특정 웹툰 즐겨찾기 API 요청 타입
export interface WebtoonFavoriteRequest {
    webtoonId: number;
}

// 특정 웹툰 즐겨찾기 API 응답 타입
export type WebtoonFavoriteResponse = WebtoonFavorite;

// ===============
// 상태 관리 타입
// ===============
export interface WebtoonFavoriteState {
    // 상태 데이터
    isLoading: boolean;
    error: string | null;
    favoriteWebtoons: Map<number, boolean>;
    temporaryFavorites: Map<number, boolean>;

    // 액션 메서드
    getFavoriteWebtoons: (userId?: number) => Promise<UserFavoritesResponse>;
    toggleFavorite: (request: WebtoonFavoriteRequest) => Promise<WebtoonFavoriteResponse | null>;
    setFavoriteStatus: (webtoonId: number, isFavorite: boolean) => void;
    reset: () => void;
}