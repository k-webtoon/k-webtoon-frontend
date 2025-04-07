import {WebtoonPaginatedResponse} from "@/entities/webtoon/model/types";

export interface SearchState {
    results: WebtoonPaginatedResponse;
    setResults: (results: WebtoonPaginatedResponse) => void;
}