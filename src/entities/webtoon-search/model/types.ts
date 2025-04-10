import {WebtoonPaginatedResponse} from "@/entities/webtoon/model/types.ts";

export interface SearchState {
    results: WebtoonPaginatedResponse;
    setResults: (results: WebtoonPaginatedResponse) => void;
}