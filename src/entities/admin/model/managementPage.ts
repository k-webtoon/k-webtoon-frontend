// src/entities/admin/model/managementPage.ts

import { ReactNode } from 'react';
import { ColumnDef } from '@tanstack/react-table';

// Management Component Props Types
export interface ManagementPageProps {
  title?: string;
  description?: string;
}

export interface ManagementLayoutProps {
  title: string;
  description?: string;
  dashboardCards: DashboardCardProps[];
  statusOptions: StatusOption[];
  columns: ColumnDef<any>[];
  data: any[];
  filter: {
    status: string;
    search: string;
  };
  onFilterChange: (filter: { status: string; search: string }) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export interface DashboardCardProps {
  title: string;
  value: number;
  description?: string;
  onClick?: () => void;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  renderCell?: (row: T) => ReactNode;
}

export interface FilterState {
  search: string;
  status: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TableState {
  filter: FilterState;
  pagination: PaginationState;
  sort: SortState;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  tableState: TableState;
  onTableStateChange: (newState: TableState) => void;
  totalRows: number;
}

export interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

export interface FilterProps {
  value: FilterState;
  onChange: (value: FilterState) => void;
  statusOptions: StatusOption[];
}

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface SortProps {
  value: SortState;
  onChange: (value: SortState) => void;
  columns: { field: string; headerName: string }[];
}

export interface TableToolbarProps {
  filter: FilterProps;
  sort: SortProps;
  actions?: ReactNode;
}

export interface TableFooterProps {
  pagination: PaginationProps;
  actions?: ReactNode;
}

export interface DataGridProps<T> extends Omit<TableProps<T>, 'tableState' | 'onTableStateChange'> {
  defaultTableState?: Partial<TableState>;
  toolbar?: Partial<TableToolbarProps>;
  footer?: Partial<TableFooterProps>;
}

export interface ManagementConfig {
  title: string;
  description?: string;
  columns: ColumnDef<any>[];
  statusOptions: StatusOption[];
  defaultFilter?: FilterState;
  defaultSort?: SortState;
  defaultPageSize?: number;
  actions?: ReactNode;
}

export interface ManagementHookResult {
  data: any[];
  loading: boolean;
  error: Error | null;
  tableState: TableState;
  setTableState: (state: TableState) => void;
  totalRows: number;
  refresh: () => void;
}

export interface ManagementContextValue {
  config: ManagementConfig;
  hook: ManagementHookResult;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Stats Types
export interface UserStats {
  total: number;
  active: number;
  dormant: number;
  suspended: number;
}

export interface WebtoonStats {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
  pending: number;
  blocked: number;
}

// 임시 타입 정의 (실제로는 user/model/appUser.ts와 webtoon/model/webtoon.ts에서 import해야 함)
export interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  profileImage?: string;
  lastLogin?: string;
  role?: string;
  isEmailVerified?: boolean;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
}

export interface Webtoon {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: string;
  thumbnail: string;
  views: number;
  rating: number;
  lastUpdated: string;
  createdAt: string;
  description?: string;
  tags?: string[];
  episodes?: number;
  likes?: number;
  comments?: number;
  uploadDate: string;
  viewCount: number;
}

export interface WebtoonApi {
  id: number;
  titleId: number;
  titleName: string;
  original: boolean;
  author: string;
  artistId: string;
  adult: boolean;
  age: string;
  finish: boolean;
  thumbnailUrl: string;
  synopsis: string;
  genre: string[];
  rankGenreTypes: string[];
  tags: string[];
  totalCount: number;
  starScore: number;
  favoriteCount: number;
  starStdDeviation: number;
  likeMeanValue: number;
  likeStdDeviation: number;
  commentsMeanValue: number;
  commentsStdDeviation: number;
  collectedNumOfEpi: number;
  numOfWorks: number;
  numsOfWork2: number;
  writersFavorAverage: number;
  osmuMovie: number;
  osmuDrama: number;
  osmuAnime: number;
  osmuPlay: number;
  osmuGame: number;
  osmuOX: number;
  synopVec: number[];
  link: string;
  character: string[];
}

// API Response Types
export interface UserResponse {
  data: User[];
  totalPages: number;
  total: number;
  stats: UserStats;
}

export interface WebtoonResponse {
  data: Webtoon[];
  totalPages: number;
  total: number;
  stats: WebtoonStats;
}

// 백엔드 API 응답 타입
export interface WebtoonApiResponse {
  data: WebtoonApi[];
  totalPages: number;
  total: number;
} 