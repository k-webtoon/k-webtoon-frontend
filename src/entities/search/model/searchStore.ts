import { create } from "zustand";
import { SearchState } from "./types.ts";
import {WebtoonPaginatedResponse} from "@/entities/webtoon/model/types";

const emptyResults: WebtoonPaginatedResponse = {
  content: []
};
export const useSearchStore = create<SearchState>((set) => ({
  results: emptyResults,
  setResults: (results: WebtoonPaginatedResponse) => set({ results }),
}));