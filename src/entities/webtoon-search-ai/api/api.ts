import axios from "axios";
import { TextBasedRecommendationResponse } from "@/entities/webtoon-search-ai/model/types.ts";

const BASE_URL = 'http://localhost:8080/api';

// 텍스트 기반 웹툰 추천 API
export const recommendWebtoonsByText = async (textQuery: string): Promise<TextBasedRecommendationResponse> => {
    const response = await axios.post(`${BASE_URL}/connector/sendM`, {
        message: textQuery
    });
    return response.data;
};

// 웹툰 추천 결과 파싱 유틸리티 함수
export const parseTextBasedRecommendations = (data: any) => {
    if (!data || !data.response) {
        return [];
    }

    return data.response.map((item: any) => ({
        id: item.id,
        titleName: item.titleName,
        similarity: item.similarity
    }));
};

// 유사도에 따라 웹툰 추천 결과 정렬
export const sortRecommendationsBySimilarity = (recommendations: any[]) => {
    return [...recommendations].sort((a, b) => b.similarity - a.similarity);
};

// 특정 유사도 이상의 웹툰만 필터링
export const filterRecommendationsBySimilarity = (recommendations: any[], threshold: number = 0.5) => {
    return recommendations.filter(item => item.similarity >= threshold);
};

// 텍스트 기반 추천 요청 및 처리를 한번에 수행하는 통합 함수
export const getTextBasedWebtoonRecommendations = async (
    textQuery: string,
    options = {
        filterThreshold: 0,
        limit: 0
    }
): Promise<any[]> => {
    try {
        const response = await recommendWebtoonsByText(textQuery);
        let recommendations = parseTextBasedRecommendations(response);

        if (options.filterThreshold > 0) {
            recommendations = filterRecommendationsBySimilarity(recommendations, options.filterThreshold);
        }

        if (options.limit > 0 && recommendations.length > options.limit) {
            recommendations = recommendations.slice(0, options.limit);
        }

        return recommendations;
    } catch (error) {
        console.error('텍스트 기반 웹툰 추천 요청 중 오류 발생:', error);
        return [];
    }
};