import { create } from "zustand";
import { webtoonApi } from "../api/webtoon";
import { WebtoonDTO, WebtoonListResponse, WebtoonCountSummaryDto } from "../model/webtoon";

type StatusType = 'all' | 'public' | 'private' | undefined;

interface WebtoonStoreState {
  // 웹툰 목록 관련 상태
  webtoons: WebtoonDTO[];
  currentPage: number;
  pageSize: number;
  totalWebtoons: number;
  loading: boolean;
  error: string | null;

  // 통계 관련 상태
  stats: WebtoonCountSummaryDto;
  statsLoading: boolean;

  // 모달 관련 상태
  selectedWebtoon: WebtoonDTO | null;
  isModalOpen: boolean;
  modalLoading: boolean;

  // 액션
  fetchWebtoons: (page: number, size: number, status?: StatusType, search?: string) => Promise<void>;
  fetchWebtoonStats: () => Promise<void>;
  fetchWebtoonDetail: (webtoonId: number) => Promise<void>;
  updateWebtoonStatus: (webtoonId: number) => Promise<void>;
  openWebtoonModal: (webtoonId: number) => void;
  closeWebtoonModal: () => void;
}

export const useWebtoonStore = create<WebtoonStoreState>((set, get) => ({
  // 초기 상태
  webtoons: [],
  currentPage: 0,
  pageSize: 10,
  totalWebtoons: 0,
  loading: false,
  error: null,
  selectedWebtoon: null,
  isModalOpen: false,
  modalLoading: false,
  statsLoading: false,
  stats: {
    totalWebtoons: 0,
    publicWebtoons: 0,
    privateWebtoons: 0
  },

  // 웹툰 통계 조회
  fetchWebtoonStats: async () => {
    set({ statsLoading: true, error: null });
    try {
      const data = await webtoonApi.getWebtoonCountSummary();
      set({ stats: data, statsLoading: false });
    } catch (error: any) {
      set({
        statsLoading: false,
        error: error.response?.data?.message || "통계 정보를 불러오는 데 실패했습니다."
      });
    }
  },

  // 웹툰 목록 조회
  fetchWebtoons: async (page: number, size: number, status?: StatusType, search?: string) => {
    set({ loading: true, error: null });
    try {
      const data = await webtoonApi.getWebtoonList({ page, size, status, search });
      set({
        webtoons: data.content,
        totalWebtoons: data.totalElements,
        currentPage: data.number,
        pageSize: data.size,
        loading: false,
      });
      // 목록을 가져온 후 통계도 함께 업데이트
      get().fetchWebtoonStats();
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || "웹툰 목록을 불러오는 데 실패했습니다." 
      });
    }
  },

  // 웹툰 상세 조회
  fetchWebtoonDetail: async (webtoonId) => {
    set({ modalLoading: true, error: null });
    try {
      const data = await webtoonApi.getWebtoonDetail(webtoonId);
      set({ selectedWebtoon: data, modalLoading: false });
    } catch (error: any) {
      set({ 
        modalLoading: false, 
        error: error.response?.data?.message || "웹툰 상세 정보를 불러오는 데 실패했습니다." 
      });
    }
  },

  // 웹툰 상태 변경
  updateWebtoonStatus: async (webtoonId: number) => {
    set({ loading: true, error: null });
    try {
      await webtoonApi.toggleWebtoonStatus(webtoonId);
      
      // 상태 변경 후 현재 페이지 데이터와 통계 새로고침
      const { currentPage, pageSize } = get();
      await get().fetchWebtoons(currentPage, pageSize);
      await get().fetchWebtoonStats();
      
      set({ loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || "웹툰 상태 변경에 실패했습니다." 
      });
      throw error;
    }
  },

  // 모달 열기
  openWebtoonModal: (webtoonId) => {
    set({ isModalOpen: true });
    get().fetchWebtoonDetail(webtoonId);
  },

  // 모달 닫기
  closeWebtoonModal: () => {
    set({ isModalOpen: false, selectedWebtoon: null });
  },
})); 