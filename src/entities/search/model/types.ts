import { Webtoon } from "@/entities/webtoon/model/types";

export interface SearchState {
    results: Webtoon[];
    setResults: (results: Webtoon[]) => void;
}