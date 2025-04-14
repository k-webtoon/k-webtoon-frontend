import { Menu } from '../model/menu';

export interface MenuQueryResponse {
  data: Menu[];
  total: number;
}

export interface MenuQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 