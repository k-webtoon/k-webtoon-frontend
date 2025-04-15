import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {PopularWebtoonResponse, WebtoonPaginatedResponse} from '@/entities/webtoon/model/types.ts';
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard.tsx";
import {Button} from "@/shared/ui/shadcn/button.tsx";

interface WebtoonSliderProps {
    title: string;
    coment?: string;
    webtoons: () => Promise<WebtoonPaginatedResponse | PopularWebtoonResponse>;
    cardSize?: 'sm' | 'md' | 'lg';
    showBadges?: boolean;
    showActionButtons?: boolean;
    showAI?: boolean;
    initialLoad?: boolean;
}

const WebtoonSlider: React.FC<WebtoonSliderProps> = ({
                                                         title,
                                                         coment,
                                                         webtoons,
                                                         cardSize,
                                                         showBadges = false,
                                                         showActionButtons,
                                                         showAI,
                                                         initialLoad = true
                                                     }) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    // 로컬 상태 관리
    const [webtoonData, setWebtoonData] = useState<WebtoonPaginatedResponse | PopularWebtoonResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(initialLoad);
    const [error, setError] = useState<string | null>(null);

    // 데이터 로드 함수
    const loadData = async () => {
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
                console.warn(`데이터가 비어있습니다 (${title})`);
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
    };

    // 초기 로드 또는 webtoons 변경 시 데이터 로드
    useEffect(() => {
        const loadInitialData = async () => {
            if (initialLoad) {
                // 초기 로드 설정인 경우 API 호출
                await loadData();
            } else if (webtoons && !webtoonData) {
                // initialLoad가 false지만 외부에서 데이터를 받는 경우
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
        
        loadInitialData();
    }, [initialLoad, webtoons, title, webtoonData]);

    // 슬라이더 스크롤 함수
    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current: slider } = sliderRef;
            const scrollAmount = direction === 'left'
                ? -slider.clientWidth
                : slider.clientWidth;

            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // 로딩 상태 표시
    if (isLoading) {
        return <div className="text-center">로딩 중...</div>;
    }

    // 에러 상태 표시
    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button onClick={loadData}>
                    다시 시도
                </Button>
            </div>
        );
    }

    if (!webtoonData) {
        return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
    }
    
    // 데이터 타입에 따른 웹툰 목록 추출
    let webtoonsToDisplay: any[] = [];
    
    // 배열인 경우 (PopularWebtoonResponse)
    if (Array.isArray(webtoonData)) {
        webtoonsToDisplay = webtoonData;
        if (webtoonsToDisplay.length === 0) {
            return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
        }
    } 
    // 페이지네이션 응답인 경우 (WebtoonPaginatedResponse)
    else if ('content' in webtoonData && Array.isArray(webtoonData.content)) {
        webtoonsToDisplay = webtoonData.content;
        if (webtoonsToDisplay.length === 0) {
            return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
        }
    } else {
        return <div className="p-6 text-center">웹툰 데이터 형식이 올바르지 않습니다.</div>;
    }

    return (
        <div className="bg-white text-black">
            <h2 className="text-xl font-bold text-left">{title}</h2>
            <p className="text-xs text-gray-500 text-left mb-5">{coment}</p>

            <div className="relative">
                 {/*왼쪽 화살표 버튼*/}
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-80 rounded-full p-2 hover:bg-gray-300 transition-all duration-200 z-10"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft className="text-gray-800" size={32} />
                </button>

                {/* 슬라이더 컨테이너 */}
                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {webtoonsToDisplay.map((webtoon, index) => (
                        <div key={'webtoonId' in webtoon ? webtoon.webtoonId : webtoon.id} className="relative group flex-shrink-0">
                            <div className="absolute top-0 left-0 z-20 p-2 text-white text-5xl font-bold">
                                {index + 1}
                            </div>
                            <WebtoonCard 
                                webtoon={webtoon} 
                                size={cardSize} 
                                showAI={showAI} 
                                showBadges={showBadges} 
                                showActionButtons={showActionButtons} 
                            />
                        </div>
                    ))}
                </div>

                {/* 오른쪽 화살표 버튼 */}
                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-80 rounded-full p-2 hover:bg-gray-300 transition-all duration-200 z-10"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="text-gray-800" size={32} />
                </button>
            </div>
        </div>
    );
};

// 불필요한 리렌더링 방지를 위한 메모이제이션
export default React.memo(WebtoonSlider, (prevProps, nextProps) => {
    // title이 같고 webtoons 함수가 같으면 리렌더링하지 않음
    return prevProps.title === nextProps.title && 
           prevProps.webtoons === nextProps.webtoons;
});