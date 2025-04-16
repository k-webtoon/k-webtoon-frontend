export interface WebtoonDetail {
  id: number;
  titleName: string;
  author: string;
  thumbnailUrl: string;
  synopsis: string;
  age: string;
  starScore: string;
  osmuAnime: boolean;
  osmuDrama: boolean;
  osmuGame: boolean;
  osmuMovie: boolean;
  osmuOX: boolean;
  osmuPlay: boolean;
  finish: boolean;
  isAdult: boolean;
  genre: string[];
  tag: string[];
  artistId: string;
}

export interface WebtoonComment {
  id: number;
  content: string;
  nickname: string;
  createdDate: string;
  likeCount: number;
  isLiked: boolean;
}

export interface CommentWithAnalysis {
  comment: WebtoonComment;
  feelTop3: string[] | null;
  message1: string | null;
  message2: string | null;
  message3: string | null;
  randomMessageIndex: number | null; // 랜덤 메시지 고정
  isAnalyzing: boolean; // 분석 중 상태
}

export interface CommentRequest {
  content: string;
}

export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface CommentPageResponse {
  content: CommentWithAnalysis[];
  pageable: PageInfo;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface WebtoonDetailState {
  webtoon: WebtoonDetail | null;
  comments: Comment[];
  currentPage: number;
  totalPages: number;
  setWebtoon: (webtoon: WebtoonDetail) => void;
  setComments: (comments: Comment[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  addComment: (comment: Comment) => void;
  removeComment: (commentId: number) => void;
  updateComment: (commentId: number, content: string) => void;
  updateCommentLike: (commentId: number, isLiked: boolean) => void;
}
