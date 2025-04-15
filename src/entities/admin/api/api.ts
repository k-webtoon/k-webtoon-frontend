// src/entities/admin/api/admin.ts

import axios from "axios";
import {
  Page,
  UserListDTO,
  UserDetailDTO,
  UserCountSummary,
  UserListByStatus,
  AccountStatusRequest,
  ModalUserDetailDTO,
} from "../model/types";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const adminApi = {
  // 사용자 목록 조회
  getUsers: async (page: number, size: number): Promise<Page<UserListDTO>> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  },

  // 사용자 상세 조회
  getUserDetail: async (id: number): Promise<UserDetailDTO> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  },

  // 사용자 통계 요약
  getUsersSummary: async (): Promise<UserCountSummary> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/users/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },

  // 상태별 사용자 조회
  getUsersByStatus: async (
    status: string,
    page: number,
    size: number
  ): Promise<Page<UserListByStatus>> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/users/by-status`, {
      params: { status, page, size },
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },

  // 모달사용자 상세 정보 조회
  getModalUserDetail: async (id: number): Promise<ModalUserDetailDTO> => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  },

  // 계정 활성화
  activateAccount: async (email: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const request: AccountStatusRequest = { email };
    await axios.patch(`${API_BASE_URL}/user_ma/activate`, request, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  },

  // 계정 정지
  suspendAccount: async (email: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const request: AccountStatusRequest = { email };
    await axios.patch(`${API_BASE_URL}/user_ma/suspend`, request, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  },

  // 계정 비활성화
  deactivateAccount: async (email: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const request: AccountStatusRequest = { email };
    await axios.patch(`${API_BASE_URL}/user_ma/deactivate`, request, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
  },

  /// 보류 코드들

  // createWebtoon: async (webtoonData: any) => {
  //   const response = await axios.post(`${API_BASE_URL}/admin/webtoons`, webtoonData, {
  //     withCredentials: true,
  //   });
  //   return response.data;
  // },
  // updateWebtoon: async (webtoonId: any, webtoonData: any) => {
  //   const response = await axios.put(`${API_BASE_URL}/admin/webtoons/${webtoonId}`, webtoonData, {
  //     withCredentials: true,
  //   });
  //   return response.data;
  // },
  // deleteWebtoon: async (webtoonId: any) => {
  //   await axios.delete(`${API_BASE_URL}/admin/webtoons/${webtoonId}`, {
  //     withCredentials: true,
  //   });
  // },
  // 다른 Admin API 호출도 여기에 추가할 수 있습니다.
};
