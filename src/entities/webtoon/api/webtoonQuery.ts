import { Webtoon, WebtoonApi, WebtoonStatusType } from '../model/webtoon';

export interface WebtoonQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: WebtoonStatusType;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WebtoonQueryResponse {
  data: Webtoon[];
  total: number;
}

export interface WebtoonApiQueryResponse {
  data: WebtoonApi[];
  total: number;
} 