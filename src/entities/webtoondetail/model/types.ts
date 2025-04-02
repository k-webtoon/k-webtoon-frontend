export interface WebtoonDetail {
  id: number;
  titleName: string;
  author: string;
  url: string;
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

export interface Comment {
  id: number;
  content: string;
  userNickname: string;
  createdDate: string;
  likeCount: number;
  isLiked: boolean;
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
  content: Comment[];
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
