import { WebtoonInfo } from "@/entities/webtoon/model/types";

export interface SearchState {
    results: WebtoonInfo[];
    setResults: (results: WebtoonInfo[]) => void;
}