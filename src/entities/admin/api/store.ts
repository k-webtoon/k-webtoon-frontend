import { create } from "zustand";
import { adminApi } from "../api/api";
import {
  AdminUser,
  AdminUserListResponse,
  AdminUserDetail,
  AccountStatusRequest,
} from "../model/types";

interface SidebarState {
  openGroups: string[];
  toggleGroup: (groupTitle: string) => void;
}

export const useSidebarStore = create<SidebarState>((set: any) => ({
  openGroups: ["사용자 관리"],
  toggleGroup: (groupTitle: string) =>
    set((state: SidebarState) => ({
      openGroups: state.openGroups.includes(groupTitle)
        ? state.openGroups.filter((title: string) => title !== groupTitle)
        : [...state.openGroups, groupTitle],
    })),
}));

interface AdminUserState {
  users: AdminUser[];
  page: number;
  size: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  // 액션 함수들
  fetchUsers: (page?: number, size?: number) => Promise<void>;
  setPagination: (page: number, size: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// 전체 사용자 조회
export const useAdminUserStore = create<AdminUserState>((set, get) => ({
  users: [],
  page: 0,
  size: 10,
  totalPages: 0,
  isLoading: false,
  error: null,

  // 사용자 목록 조회 액션
  fetchUsers: async (page = get().page, size = get().size) => {
    try {
      set({ isLoading: true, error: null });

      const response = await adminApi.getAlluser(page, size);
      set({
        users: response.content,
        totalPages: response.pageable.totalPages,
        page: response.pageable.pageNumber,
        size: response.pageable.pageSize,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 페이지네이션 설정
  setPagination: (page, size) => set({ page, size }),

  // 로딩 상태 설정
  setLoading: (isLoading) => set({ isLoading }),

  // 에러 상태 설정
  setError: (error) => set({ error }),
}));

// 사용자 상세 조회
interface AdminUserDetailState {
  userDetail: AdminUserDetail | null; // 사용자 상세 정보
  isLoading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지

  // 액션 함수들
  fetchUserDetail: (userId: number) => Promise<void>; // 사용자 상세 정보 가져오기
  resetUserDetail: () => void; // 사용자 상세 정보 초기화
}

export const useAdminUserDetailStore = create<AdminUserDetailState>((set) => ({
  userDetail: null,
  isLoading: false,
  error: null,

  // 사용자 상세 정보 가져오기
  fetchUserDetail: async (userId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await adminApi.getUser(userId); // API 호출
      set({ userDetail: response });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 사용자 상세 정보 초기화
  resetUserDetail: () => set({ userDetail: null, error: null }),
}));

// 사용자 정지(24시간) 요청 타입
interface UserManagementState {
  isLoading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지
  successMessage: string | null; // 성공 메시지

  // 액션 함수들
  stopUser: (request: AccountStatusRequest) => Promise<void>; // 사용자 계정 정지 액션
  resetMessages: () => void; // 메시지 초기화
}

export const useUserManagementStore = create<UserManagementState>((set) => ({
  isLoading: false,
  error: null,
  successMessage: null,

  // 사용자 계정 정지 액션
  stopUser: async (request) => {
    try {
      set({ isLoading: true, error: null, successMessage: null });

      const response = await adminApi.stopUser(request); // API 호출
      set({ successMessage: `User ${response.email} suspended successfully.` }); // 성공 메시지 설정
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred.",
        successMessage: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 메시지 초기화
  resetMessages: () => set({ error: null, successMessage: null }),
}));
