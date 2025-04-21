import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useTextBasedRecommendationStore } from '@/entities/webtoon-search-ai/api/store.ts';
import WebtoonTextSearchForm from "@/features/webtoon-search-ai/ui/WebtoonTextSearchForm.tsx";
import { HorizontalWebtoonCard } from "@/entities/webtoon/ui/HorizontalWebtoonCard.tsx";

const TextBasedRecommendations: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const lastQueryRef = useRef<string | null>(null);

    const {
        recommendations,
        isLoading,
        webtoonDetails,
        error,
        fetchTextBasedRecommendations
    } = useTextBasedRecommendationStore();

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    useEffect(() => {
        if (!query) return;

        if (query !== lastQueryRef.current) {
            console.log(`새 텍스트 검색 실행: "${decodeURIComponent(query)}"`);

            const decodedQuery = decodeURIComponent(query);
            const options = {
                limit: 20,
                includeDetails: true
            };

            fetchTextBasedRecommendations(decodedQuery, options);
            lastQueryRef.current = query;
        }
    }, [query, fetchTextBasedRecommendations]);

    const getWebtoonDetail = (id: number) => {
        return webtoonDetails[id] || null;
    };

    return (
        <div className="min-h-screen pt-20 pb-10">
            <div key={`search-${query}`} className="mb-8">
                <WebtoonTextSearchForm />
            </div>

            {query && (
                <div className="flex flex-col items-start mb-6">
                    <h1 className="text-xl font-bold">
                        <span className="text-green-500">'{decodeURIComponent(query)}'</span> 에 대한 텍스트 기반 추천 결과입니다.
                    </h1>
                    <h2 className="text-lg font-medium mt-2 flex items-center">
                        웹툰
                        <span className="text-sm text-gray-500 ml-2">총 {recommendations?.length || 0}개</span>
                    </h2>
                </div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-lg p-8 text-center my-8 mt-20 mb-50">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
                    <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200 text-red-600 p-6">
                    <p>{error}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="mt-4"
                    >
                        돌아가기
                    </Button>
                </div>
            ) : (
                <div className="mt-6">
                    {recommendations && recommendations.length > 0 ? (
                        <div className="space-y-6">
                            {recommendations.map((item) => {
                                const detail = getWebtoonDetail(item.id);
                                return (
                                    <>
                                        <HorizontalWebtoonCard key={item.id} webtoon={detail} similarity={item.similarity} />
                                    </>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            '{decodeURIComponent(query)}'에 대한 텍스트 기반 추천 결과가 없습니다.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TextBasedRecommendations;