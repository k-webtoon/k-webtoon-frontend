import { User, UserRole, UserStatusType } from '../model/appUser';

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatusType;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserQueryResponse {
  data: User[];
  total: number;
} 