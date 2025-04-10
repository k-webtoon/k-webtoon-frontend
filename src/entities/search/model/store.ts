import { create } from "zustand";
import { SearchState } from "../ui/types.ts";
import {WebtoonPaginatedResponse} from "@/entities/webtoon/model/types.ts";

const emptyResults: WebtoonPaginatedResponse = {
  content: []
};
export const useSearchStore = create<SearchState>((set) => ({
  results: emptyResults,
  setResults: (results: WebtoonPaginatedResponse) => set({ results }),
}));