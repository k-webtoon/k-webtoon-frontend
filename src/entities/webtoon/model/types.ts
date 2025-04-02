// 페이지네이션된 응답 타입 정의
export interface PaginatedResponse<T> {
    content: T[];
}

// 웹툰 장르 타입 정의 (영문)
export type GenreType =
    | 'DRAMA'
    | 'FANTASY'
    | 'ACTION'
    | 'ROMANCE'
    | 'COMEDY'
    | 'THRILLER'
    | 'SPORTS'
    | 'DAILY'
    | 'HUMOR';

// 한글 장르 타입 정의
export type KoreanGenreType =
    | '드라마'
    | '판타지'
    | '액션'
    | '로맨스'
    | '코미디'
    | '스릴러'
    | '스포츠'
    | '일상'
    | '개그';

// 장르 맵핑 (영문 -> 한글)
export const GENRE_MAPPING: Record<GenreType, KoreanGenreType> = {
    'DRAMA': '드라마',
    'FANTASY': '판타지',
    'ACTION': '액션',
    'ROMANCE': '로맨스',
    'COMEDY': '코미디',
    'THRILLER': '스릴러',
    'SPORTS': '스포츠',
    'DAILY': '일상',
    'HUMOR': '개그'
};

// 연령 제한 타입 정의
export type AgeRating = '전체연령가' | '12세 이용가' | '15세 이용가' | '성인';

// 웹툰 정보 인터페이스
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
}

// 웹툰 페이지네이션 응답 타입
export type WebtoonPaginatedResponse = PaginatedResponse<WebtoonInfo>;

// 장르 한글 매핑
export const mapGenre = (genre: GenreType): KoreanGenreType => {
    return GENRE_MAPPING[genre] || genre as unknown as KoreanGenreType;
};






