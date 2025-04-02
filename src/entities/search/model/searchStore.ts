import { create } from "zustand";
import { SearchState } from "./types.ts";
import { WebtoonInfo } from "@/entities/webtoon/model/types";

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (results: WebtoonInfo[]) => set({ results }),
}));