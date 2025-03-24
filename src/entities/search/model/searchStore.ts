import { create } from "zustand";
import { SearchState } from "./types.ts";
import { Webtoon } from "@/entities/webtoon/model/types";

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (results: Webtoon[]) => set({ results }),
}));