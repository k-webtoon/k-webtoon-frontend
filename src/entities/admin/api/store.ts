// src/entities/admin/store/userStore.ts

import { create } from "zustand";
import { adminApi } from "../api/api";
import {
  Page,
  UserListDTO,
  UserDetailDTO,
  UserCountSummary,
  UserListByStatus,
  ModalUserDetailDTO,
  AccountStatusRequest,
} from "../model/types";

interface SidebarState {
  openGroups: string[];
  toggleGroup: (groupTitle: string) => void;
}

interface UserStoreState {
  // 기존 상태
  users: UserListDTO[];
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  loading: boolean;
  selectedUser: UserDetailDTO | null;

  // 추가된 상태
  userSummary: UserCountSummary | null;
  usersByStatus: UserListByStatus[];
  usersByStatusTotal: number;
  usersByStatusPage: number;

  // 모달 관련 상태
  modalOpen: boolean;
  modalUserId: number | null;
  modalUserDetail: ModalUserDetailDTO | null;
  modalLoading: boolean;
  statusActionLoading: boolean;
  error: string | null;

  // 기존 액션
  fetchUsers: (page: number, size: number) => Promise<void>;
  fetchUserDetail: (userId: number) => Promise<void>;
  setPage: (page: number) => void;

  // 추가된 액션
  fetchUserSummary: () => Promise<void>;
  fetchUsersByStatus: (
    status: string,
    page: number,
    size: number
  ) => Promise<void>;
  setUsersByStatusPage: (page: number) => void;

  // 모달 관련 액션
  openUserModal: (userId: number) => void;
  closeUserModal: () => void;
  fetchModalUserDetail: (userId: number) => Promise<void>;

  // 계정 상태 관리 액션
  activateUser: (email: string) => Promise<void>;
  suspendUser: (email: string) => Promise<void>;
  deactivateUser: (email: string) => Promise<void>;
  refreshData: () => Promise<void>;
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

export const useUserStore = create<UserStoreState>((set, get) => ({
  // 기존 초기 상태
  users: [],
  currentPage: 0,
  pageSize: 10,
  totalUsers: 0,
  loading: false,
  selectedUser: null,

  // 추가된 초기 상태
  userSummary: null,
  usersByStatus: [],
  usersByStatusTotal: 0,
  usersByStatusPage: 0,

  // 모달 관련 초기 상태
  modalOpen: false,
  modalUserId: null,
  modalUserDetail: null,
  modalLoading: false,
  statusActionLoading: false,
  error: null,

  // 기존 액션 구현
  fetchUsers: async (page, size) => {
    set({ loading: true });
    try {
      const data: Page<UserListDTO> = await adminApi.getUsers(page, size);
      set({
        users: data.content,
        totalUsers: data.totalElements,
        currentPage: data.number,
        pageSize: data.size,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error("사용자 목록 조회 실패:", error);
    }
  },

  fetchUserDetail: async (userId) => {
    set({ loading: true });
    try {
      const data = await adminApi.getUserDetail(userId);
      set({ selectedUser: data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("사용자 상세 조회 실패:", error);
    }
  },

  setPage: (page) => set({ currentPage: page }),

  // 추가된 액션 구현
  fetchUserSummary: async () => {
    set({ loading: true });
    try {
      const data = await adminApi.getUsersSummary();
      set({ userSummary: data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("사용자 통계 조회 실패:", error);
    }
  },

  fetchUsersByStatus: async (status, page, size) => {
    set({ loading: true });
    try {
      const data = await adminApi.getUsersByStatus(status, page, size);
      set({
        usersByStatus: data.content,
        usersByStatusTotal: data.totalElements,
        usersByStatusPage: data.number,
        pageSize: data.size,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.error("상태별 사용자 조회 실패:", error);
    }
  },

  setUsersByStatusPage: (page) => set({ usersByStatusPage: page }),

  // 모달 관련 액션 구현
  openUserModal: (userId) => {
    set({
      modalOpen: true,
      modalUserId: userId,
      modalUserDetail: null, // 초기화
      error: null, // 오류 초기화
    });
    get().fetchModalUserDetail(userId);
  },

  closeUserModal: () => {
    set({
      modalOpen: false,
      modalUserId: null,
      modalUserDetail: null,
      error: null,
    });
  },

  fetchModalUserDetail: async (userId) => {
    set({ modalLoading: true, error: null });
    try {
      const data = await adminApi.getModalUserDetail(userId);
      set({ modalUserDetail: data, modalLoading: false });
    } catch (error: any) {
      set({
        modalLoading: false,
        error:
          error.response?.data?.message || "사용자 정보를 불러올 수 없습니다.",
      });
      console.error("모달 사용자 정보 조회 실패:", error);
    }
  },

  // 계정 상태 관리 액션
  activateUser: async (email) => {
    set({ statusActionLoading: true, error: null });
    try {
      await adminApi.activateAccount(email);
      await get().refreshData();
      set({ statusActionLoading: false });
    } catch (error: any) {
      set({
        statusActionLoading: false,
        error: error.response?.data?.message || "계정 활성화에 실패했습니다.",
      });
      console.error("계정 활성화 실패:", error);
    }
  },

  suspendUser: async (email) => {
    set({ statusActionLoading: true, error: null });
    try {
      await adminApi.suspendAccount(email);
      await get().fetchUsers(get().currentPage, get().pageSize);
      await get().fetchUserSummary();
      set({ statusActionLoading: false });
    } catch (error: any) {
      set({
        statusActionLoading: false,
        error: error.response?.data?.message || "계정 정지에 실패했습니다.",
      });
      console.error("계정 정지 실패:", error);
    }
  },

  deactivateUser: async (email) => {
    set({ statusActionLoading: true, error: null });
    try {
      await adminApi.deactivateAccount(email);
      await get().refreshData();
      set({ statusActionLoading: false });
    } catch (error: any) {
      set({
        statusActionLoading: false,
        error: error.response?.data?.message || "계정 비활성화에 실패했습니다.",
      });
      console.error("계정 비활성화 실패:", error);
    }
  },

  // 상태 변경 후 데이터 새로고침
  refreshData: async () => {
    const state = get();
    await state.fetchUserSummary();

    if (state.usersByStatus.length > 0) {
      await state.fetchUsersByStatus(
        state.usersByStatus[0].accountStatus,
        state.usersByStatusPage,
        state.pageSize
      );
    } else {
      await state.fetchUsers(state.currentPage, state.pageSize);
    }

    // 모달이 열려있다면 모달 정보도 갱신
    if (state.modalOpen && state.modalUserId) {
      await state.fetchModalUserDetail(state.modalUserId);
    }
  },
}));
