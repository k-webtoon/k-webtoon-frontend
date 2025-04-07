import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useTextBasedRecommendationStore } from '@/entities/text-based-search/model/store.ts';
import WebtoonTextSearchForm from "@/features/text-based-search/ui/WebtoonTextSearchForm.tsx";
import { HorizontalWebtoonCard } from "@/entities/webtoon/ui/HorizontalWebtoonCard.tsx";

const TextBasedRecommendations: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const lastQueryRef = useRef<string | null>(null);

    const {
        recommendations,
        isLoading,
        fetchingDetails,
        webtoonDetails,
        error,
        fetchTextBasedRecommendations
    } = useTextBasedRecommendationStore();

    // URL에서 검색어 파라미터 추출
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

    // 웹툰 세부 정보 가져오기
    const getWebtoonDetail = (id: number) => {
        return webtoonDetails[id] || null;
    };

    return (
        <div className="min-h-screen pt-20 pb-10">
            {/* 상단 검색 컴포넌트 */}
            <div key={`search-${query}`} className="mb-8">
                <WebtoonTextSearchForm />
            </div>

            {/* 검색 결과 헤더 */}
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

            {/* 로딩 및 오류 상태 */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
                    {/* 세부 정보 로딩 중 표시 */}
                    {fetchingDetails && (
                        <div className="mb-4 p-2 bg-blue-50 text-blue-600 rounded-md text-sm text-center">
                            웹툰 상세 정보를 불러오는 중입니다...
                        </div>
                    )}

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