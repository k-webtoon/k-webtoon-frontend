// src/entities/webtoon/model/webtoon.ts

// Webtoon Types
export enum WebtoonStatus {
  ACTIVE = 'active',     // 연재 중 (정상 노출)
  INACTIVE = 'inactive', // 완결 / 작가가 숨김 처리
  DELETED = 'deleted',   // 삭제 (소프트 삭제)
  PENDING = 'pending',   // 작가가 등록 후 승인 대기
  BLOCKED = 'blocked'    // 운영자 블라인드 처리
}

export type WebtoonStatusType = 'active' | 'inactive' | 'deleted' | 'pending' | 'blocked';

export const WEBTOON_STATUS = {
  ACTIVE: 'active' as const,
  INACTIVE: 'inactive' as const,
  DELETED: 'deleted' as const,
  PENDING: 'pending' as const,
  BLOCKED: 'blocked' as const,
} as const;

export const WEBTOON_GENRE = {
  ALL: 'all' as const,
  ROMANCE: 'romance' as const,
  ACTION: 'action' as const,
  COMEDY: 'comedy' as const,
  DRAMA: 'drama' as const,
  FANTASY: 'fantasy' as const,
} as const;


// 백엔드 API에서 받은 웹툰 정보를 위한 인터페이스
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