// 사용자 좋아요 목록 조회 API 요청 타입
export interface UserLikesRequest {
    userId?: number;
}

// 사용자 좋아요 목록 조회 API 응답 타입
export interface UserLikesResponseItem {
    webtoonId: number;
    isLiked: boolean;
}

export type UserLikesResponse = UserLikesResponseItem[];

// 특정 웹툰 좋아요 API 요청 타입
export interface WebtoonLikeRequest {
    webtoonId: number;
}

// 특정 웹툰 좋아요 API 응답 타입
export interface WebtoonLikeResponse {
    webtoonId: number;
    isLiked: boolean;
}

// 스토어 상태 타입
export interface WebtoonLikeState {
    isLoading: boolean;
    error: string | null;
    likedWebtoons: Map<number, boolean>;
    fetchAllLikes: (userId?: number) => Promise<void>;
    toggleLike: (request: WebtoonLikeRequest) => Promise<WebtoonLikeResponse | null>;
    setLikedStatus: (webtoonId: number, isLiked: boolean) => void;
    reset: () => void;
}

// 선택기 타입
export type WebtoonLikeSelector<T> = (state: WebtoonLikeState) => T;