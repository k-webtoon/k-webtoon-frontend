import {WebtoonPaginatedResponse} from "@/entities/webtoon/ui/types.ts";

export interface SearchState {
    results: WebtoonPaginatedResponse;
    setResults: (results: WebtoonPaginatedResponse) => void;
}