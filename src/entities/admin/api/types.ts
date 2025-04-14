import { AccountStatus, UserRole } from '@/entities/user/model/appUser';
import { WebtoonStatus } from '@/entities/webtoon/model/webtoon';

// ======================================
// 공통 타입
// ======================================

/** 페이지네이션 파라미터 */
export interface PaginationParams {
  page: number;    // 페이지 번호 (1부터 시작)
  limit: number;   // 한 페이지당 항목 수
}

/** 페이지네이션된 목록 응답 */
export interface PaginatedResponse<T> {
  data: T[];           // 현재 페이지 데이터 목록
  total: number;       // 전체 데이터 수
  totalPages: number;  // 전체 페이지 수
  currentPage: number; // 현재 페이지 번호
}

// ======================================
// 사용자 관리
// ======================================

/** 사용자 목록 조회 필터
 * 
 * @example
 * // 활성 사용자만 검색
 * { status: AccountStatus.ACTIVE }
 * 
 * // 이메일로 정렬
 * { sortBy: 'userEmail', sortOrder: 'asc' }
 */
export interface UserFilterParams extends PaginationParams {
  search?: string;     // 이메일/닉네임 검색
  status?: AccountStatus;  // 계정 상태 필터
  role?: UserRole;     // 권한 필터
  sortBy?: 'createDateTime' | 'userEmail' | 'nickname';  // 정렬 기준
  sortOrder?: 'asc' | 'desc';  // 정렬 방향
}

/** 사용자 통계 정보 */
export interface UserStats {
  total: number;      // 전체 사용자 수
  active: number;     // 활성 사용자 수
  suspended: number;  // 정지된 사용자 수
  deactivated: number;// 비활성화된 사용자 수
}

/** 사용자 정보
 * 
 * @example
 * {
 *   indexId: 1,
 *   userEmail: "user@example.com",
 *   nickname: "홍길동",
 *   accountStatus: AccountStatus.ACTIVE,
 *   role: UserRole.USER
 * }
 */
export interface UserResponse {
  indexId: number;        // 사용자 ID
  userEmail: string;      // 이메일
  nickname: string | null;// 닉네임
  accountStatus: AccountStatus;  // 계정 상태
  role: UserRole;        // 권한
  createDateTime: string;// 가입일시
  updateDateTime: string;// 수정일시
}

/** 사용자 목록 조회 응답 */
export interface UserListResponse extends PaginatedResponse<UserResponse> {
  stats: UserStats;  // 사용자 통계
}

/** 사용자 상태 변경 요청
 * @example { status: AccountStatus.SUSPENDED } // 계정 정지
 */
export interface UpdateUserStatusRequest {
  status: AccountStatus;  // 변경할 상태
}

/** 사용자 생성 요청
 * @example
 * {
 *   email: "new@example.com",
 *   password: "1234",
 *   nickname: "신규유저",
 *   role: UserRole.USER
 * }
 */
export interface CreateUserRequest {
  email: string;     // 이메일 (필수)
  password: string;  // 비밀번호 (필수)
  nickname?: string; // 닉네임 (선택)
  role: UserRole;    // 권한 (필수)
}

// ======================================
// 웹툰 관리
// ======================================

/** 웹툰 목록 조회 필터
 * 
 * @example
 * // 연재중인 로맨스 웹툰 검색
 * { 
 *   status: WebtoonStatus.ACTIVE,
 *   genre: "ROMANCE"
 * }
 */
export interface WebtoonFilterParams extends PaginationParams {
  search?: string;        // 제목/작가 검색
  status?: WebtoonStatus;// 상태 필터
  genre?: string;        // 장르 필터
  sortBy?: 'createDateTime' | 'titleName' | 'author';  // 정렬 기준
  sortOrder?: 'asc' | 'desc';  // 정렬 방향
}

/** 웹툰 통계 정보 */
export interface WebtoonStats {
  total: number;    // 전체 웹툰 수
  active: number;   // 연재중
  inactive: number; // 휴재/완결
  deleted: number;  // 삭제됨
  pending: number;  // 승인대기
  blocked: number;  // 블라인드
}

/** 웹툰 정보
 * 
 * @example
 * {
 *   id: 1,
 *   titleName: "로맨스 웹툰",
 *   author: "작가이름",
 *   genre: ["ROMANCE"],
 *   status: WebtoonStatus.ACTIVE
 * }
 */
export interface WebtoonResponse {
  id: number;           // 웹툰 ID
  titleId: string;      // URL용 ID
  titleName: string;    // 제목
  author: string;       // 작가
  genre: string[];      // 장르 목록
  description: string;  // 설명
  thumbnail: string;    // 썸네일 URL
  finish: boolean;      // 완결 여부
  status: WebtoonStatus;// 상태
  createDateTime: string;// 등록일시
  updateDateTime: string;// 수정일시
}

/** 웹툰 목록 조회 응답 */
export interface WebtoonListResponse extends PaginatedResponse<WebtoonResponse> {
  stats: WebtoonStats;  // 웹툰 통계
}

/** 웹툰 상태 변경 요청
 * @example { status: WebtoonStatus.INACTIVE } // 휴재 처리
 */
export interface UpdateWebtoonStatusRequest {
  status: WebtoonStatus;  // 변경할 상태
}

/** 웹툰 생성 요청
 * @example
 * {
 *   titleName: "새 웹툰",
 *   author: "작가명",
 *   genre: ["ROMANCE"],
 *   description: "설명"
 * }
 */
export interface CreateWebtoonRequest {
  titleName: string;   // 제목 (필수)
  author: string;      // 작가 (필수)
  genre: string[];     // 장르 (필수)
  description: string; // 설명 (필수)
  thumbnail?: string;  // 썸네일 URL (선택)
} 