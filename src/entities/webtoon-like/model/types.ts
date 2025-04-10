// ===============
// 도메인 엔티티 타입
// ===============

// 웹툰 좋아요 타입
export interface WebtoonLike {
    webtoonId: number;
    isLiked: boolean;
}

// ===============
// API 요청/응답 타입
// ===============

// 사용자 웹툰 좋아요 목록 조회 API 요청 타입
export interface UserLikesRequest {
    userId: number;
}
// 사용자 웹툰 좋아요 목록 조회 API 응답 타입
export type UserLikesResponseItem = WebtoonLike;
export type UserLikesResponse = UserLikesResponseItem[];

// 특정 웹툰 좋아요 API 요청 타입
export interface WebtoonLikeRequest {
    webtoonId: number;
}
// 특정 웹툰 좋아요 API 응답 타입
export type WebtoonLikeResponse = WebtoonLike;

// ===============
// 상태 관리 타입
// ===============
export interface WebtoonLikeState {
    // 상태 데이터
    isLoading: boolean;
    error: string | null;
    likedWebtoons: Map<number, boolean>;

    // 액션 메서드
    fetchAllLikes: (userId?: number) => Promise<void>;
    toggleLike: (request: WebtoonLikeRequest) => Promise<WebtoonLikeResponse | null>;
    setLikedStatus: (webtoonId: number, isLiked: boolean) => void;
    reset: () => void;
}