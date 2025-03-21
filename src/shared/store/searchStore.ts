import { create } from "zustand";

export interface Webtoon {
  id: number;
  titleName: string;
  author: string;
  thumbnailUrl: string;
}

interface SearchState {
  results: Webtoon[];
  setResults: (results: Webtoon[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (results) => set({ results }),
}));
