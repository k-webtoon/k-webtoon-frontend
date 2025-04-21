import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WebtoonPaginatedResponse, WebtoonInfo } from '@/entities/webtoon/model/types.ts';
import HorizontalRecommendWebtoonCard from "@/entities/webtoon/ui/HorizontalRecommendWebtoonCard.tsx";
import { Button } from '@/shared/ui/shadcn/button';

interface WebtoonGridHorizontalProps {
    title: string;
    comment?: string;
    webtoons: () => Promise<WebtoonPaginatedResponse | WebtoonInfo[]>;
    cardSize?: 'sm' | 'md' | 'lg';
    showActionButtons?: boolean;
    showAI?: boolean;
    initialLoad?: boolean;
    countType?: 'likes' | 'favorites' | 'watched' | null;
    rows?: number;
    columns?: number;
}

const WebtoonGridHorizontal: React.FC<WebtoonGridHorizontalProps> = ({
                                                                         title,
                                                                         comment,
                                                                         webtoons,
                                                                         showActionButtons = true,
                                                                         showAI = true,
                                                                         initialLoad = true,
                                                                         countType = null,
                                                                         rows = 2,
                                                                         columns = 3
                                                                     }) => {
    const [webtoonData, setWebtoonData] = useState<WebtoonPaginatedResponse | WebtoonInfo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(initialLoad);
    const [error, setError] = useState<string | null>(null);
    const [visibleRows, setVisibleRows] = useState<number>(rows);
    const [hasMoreRows, setHasMoreRows] = useState<boolean>(true);

    const loadData = useCallback(async () => {
        if (!webtoons) {
            setError('웹툰 데이터 로드 함수가 제공되지 않았습니다.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await webtoons();
            if (!data) {
                throw new Error(`데이터가 없습니다 (${title})`);
            }
            setWebtoonData(data);
        } catch (error: unknown) {
            const err = error as Error;
            console.error(`웹툰 데이터 로드 오류 (${title}):`, err);
            setError(`웹툰 데이터를 불러오는 중 오류가 발생했습니다: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [webtoons, title]);

    useEffect(() => {
        const loadInitialData = async () => {
            if (initialLoad) {
                await loadData();
            } else if (webtoons && !webtoonData) {
                try {
                    const data = await webtoons();
                    if (data) {
                        setWebtoonData(data);
                    }
                } catch (err) {
                    console.error(`외부 데이터 로드 오류 (${title}):`, err);
                }
            }
        };

        void loadInitialData();
    }, [initialLoad, webtoons, title, webtoonData, loadData]);

    useEffect(() => {
        if (webtoonData) {
            let webtoonsToDisplay: WebtoonInfo[] = [];

            if ('content' in webtoonData && Array.isArray(webtoonData.content)) {
                webtoonsToDisplay = webtoonData.content;
            }
            else if (Array.isArray(webtoonData)) {
                webtoonsToDisplay = webtoonData;
            }

            const totalPossibleRows = Math.ceil(webtoonsToDisplay.length / columns);
            setHasMoreRows(visibleRows < totalPossibleRows);
        }
    }, [webtoonData, visibleRows, columns]);

    const handleLoadMore = () => {
        setVisibleRows(prev => prev + 1);
    };

    if (isLoading) {
        return <div className="text-center p-4">로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={loadData}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    if (!webtoonData) {
        return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
    }

    let webtoonsToDisplay: WebtoonInfo[] = [];

    if (webtoonData && 'content' in webtoonData && Array.isArray(webtoonData.content)) {
        webtoonsToDisplay = webtoonData.content;
    }
    else if (Array.isArray(webtoonData)) {
        webtoonsToDisplay = webtoonData;
    }

    if (webtoonsToDisplay.length === 0) {
        return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
    }

    const grid: WebtoonInfo[][] = [];
    const totalItems = webtoonsToDisplay.length;
    const maxVisibleItems = visibleRows * columns;

    for (let i = 0; i < visibleRows; i++) {
        const row: WebtoonInfo[] = [];
        for (let j = 0; j < columns; j++) {
            const index = i * columns + j;
            if (index < totalItems) {
                row.push(webtoonsToDisplay[index]);
            }
        }
        if (row.length > 0) {
            grid.push(row);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <Link
                    to="/user-based-recommendations"
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                    전체 보기
                    <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
            </div>
            <p className="text-left text-xs text-gray-500 mb-5">{comment}</p>

            <div className="grid gap-4">
                {grid.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {row.map((webtoon, colIndex) => (
                            <div key={`webtoon-${rowIndex}-${colIndex}`} className="flex justify-center">
                                <HorizontalRecommendWebtoonCard
                                    webtoon={webtoon}
                                    showAI={showAI}
                                    showActionButtons={showActionButtons}
                                    countType={countType}
                                    aiPercent={webtoon.sim !== undefined ? Math.round(webtoon.sim) : undefined}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {hasMoreRows && webtoonsToDisplay.length > maxVisibleItems && (
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleLoadMore}
                        variant="outline"
                        className="px-6 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <span>더보기</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default React.memo(WebtoonGridHorizontal, (prevProps, nextProps) => {
    return prevProps.title === nextProps.title &&
        prevProps.webtoons === nextProps.webtoons;
});