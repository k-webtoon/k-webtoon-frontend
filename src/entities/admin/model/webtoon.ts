export interface WebtoonCountSummaryDto {
  totalWebtoons: number;
  publicWebtoons: number;
  privateWebtoons: number;
}

export interface WebtoonDTO {
  id: number;
  titleName: string;
  author: string;
  genre: string;
  isPublic: boolean;
  thumbnailUrl: string;
  synopsis: string;
  tags: string[];
  totalCount: number;
  favoriteCount: number;
  collectedNumOfEpi: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebtoonListResponse {
  content: WebtoonDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface WebtoonSearchParams {
  page: number;
  size: number;
  status?: 'all' | 'public' | 'private' | undefined;
  search?: string;
} 