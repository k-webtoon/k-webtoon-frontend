// ===============
// 도메인 엔티티 타입
// ===============

// 웹툰 봤어요 타입
export interface WebtoonWatched {
    webtoonId: number;
    isWatched: boolean | null;
}

// ===============
// API 요청/응답 타입
// ===============

// 사용자 웹툰 봤어요 목록 조회 API 요청 타입
export interface UserWatchedRequest {
    userId?: number;
}

// 사용자 웹툰 봤어요 목록 조회 API 응답 타입
export type UserWatchedResponseItem = WebtoonWatched;
export type UserWatchedResponse = UserWatchedResponseItem[];

// 특정 웹툰 봤어요 API 요청 타입
export interface WebtoonWatchedRequest {
    webtoonId: number;
}

// 특정 웹툰 봤어요 API 응답 타입
export type WebtoonWatchedResponse = WebtoonWatched;

// ===============
// 상태 관리 타입
// ===============
export interface WebtoonWatchedState {
    // 상태 데이터
    isLoading: boolean;
    error: string | null;
    watchedWebtoons: Map<number, boolean>;
    temporaryWatched: Map<number, boolean>;

    // 액션 메서드
    getWatchedWebtoons: (userId: number) => Promise<UserWatchedResponse>;
    toggleWatched: (request: WebtoonWatchedRequest) => Promise<WebtoonWatchedResponse | null>;
    setWatchedStatus: (webtoonId: number, isWatched: boolean) => void;
    reset: () => void;
}