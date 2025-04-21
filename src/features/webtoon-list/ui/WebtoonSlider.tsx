import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {WebtoonPaginatedResponse, WebtoonInfo} from '@/entities/webtoon/model/types.ts';
import WebtoonCard from "@/entities/webtoon/ui/WebtoonCard.tsx";
import {Button} from "@/shared/ui/shadcn/button.tsx";

interface WebtoonSliderProps {
    title: string;
    coment?: string;
    webtoons: () => Promise<WebtoonPaginatedResponse | WebtoonInfo[]>;
    cardSize?: 'sm' | 'md' | 'lg';
    showBadges?: boolean;
    showActionButtons?: boolean;
    showAI?: boolean;
    initialLoad?: boolean;
    countType?: 'likes' | 'favorites' | 'watched' | null;
    autoSlideInterval?: number; // 자동 슬라이드 간격 (ms)
}

const WebtoonSlider: React.FC<WebtoonSliderProps> = ({
                                                         title,
                                                         coment,
                                                         webtoons,
                                                         cardSize,
                                                         showBadges = false,
                                                         showActionButtons,
                                                         showAI,
                                                         initialLoad = true,
                                                         countType = null,
                                                         autoSlideInterval = 1000 // 기본값 1초로 설정
                                                     }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 로컬 상태 관리
    const [webtoonData, setWebtoonData] = useState<WebtoonPaginatedResponse | WebtoonInfo[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(initialLoad);
    const [error, setError] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false); // 마우스 오버 시 일시정지 상태

    // 데이터 로드 함수
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
    }, [webtoons, title, setWebtoonData, setIsLoading, setError]);

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

        void loadInitialData(); // Promise 무시 경고 해결
    }, [initialLoad, webtoons, title, webtoonData, loadData]);

    // 슬라이더 스크롤 함수 - 카드 단위로 스크롤
    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current: slider } = sliderRef;

            // 화면에 보이는 카드의 평균 너비 계산 (margin 포함)
            const cardElements = slider.querySelectorAll('.group.flex-shrink-0');
            if (cardElements.length === 0) return;

            // 카드 하나의 너비와 마진 계산
            const firstCard = cardElements[0] as HTMLElement;
            const cardWidth = firstCard.offsetWidth;
            const cardStyle = window.getComputedStyle(firstCard);
            const cardMargin = parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);

            // 카드 4개 단위로 스크롤 (기존 동작 유지)
            const visibleCardsCount = 4;
            const scrollAmount = direction === 'left'
                ? -(cardWidth + cardMargin) * visibleCardsCount
                : (cardWidth + cardMargin) * visibleCardsCount;

            slider.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // 자동 슬라이드를 위한 한 장씩 스크롤 함수
    const scrollOneCard = useCallback((direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const { current: slider } = sliderRef;

            // 화면에 보이는 카드의 평균 너비 계산 (margin 포함)
            const cardElements = slider.querySelectorAll('.group.flex-shrink-0');
            if (cardElements.length === 0) return;

            // 카드 하나의 너비와 마진 계산
            const firstCard = cardElements[0] as HTMLElement;
            const cardWidth = firstCard.offsetWidth;
            const cardStyle = window.getComputedStyle(firstCard);
            const cardMargin = parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);

            // 카드 1개 단위로 스크롤
            const scrollAmount = direction === 'left'
                ? -(cardWidth + cardMargin)
                : (cardWidth + cardMargin);

            // 현재 스크롤 위치 확인
            const currentScroll = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;

            // 끝에 도달한 경우 처음으로 돌아감
            if (direction === 'right' && currentScroll >= maxScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    }, [sliderRef]);

    // 자동 슬라이드 제어
    useEffect(() => {
        let timer: number | undefined;
        
        if (webtoonData && !isPaused) {
            timer = window.setInterval(() => {
                scrollOneCard('right');
            }, autoSlideInterval);
        }
        
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [webtoonData, isPaused, autoSlideInterval, scrollOneCard]);

    // 마우스 오버/아웃 핸들러
    const handleMouseEnter = () => {
        setIsPaused(true);
    };
    
    const handleMouseLeave = () => {
        setIsPaused(false);
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
    let webtoonsToDisplay: WebtoonInfo[] = [];

    // 페이지네이션 응답인 경우 (WebtoonPaginatedResponse)
    if (webtoonData && 'content' in webtoonData && Array.isArray(webtoonData.content)) {
        webtoonsToDisplay = webtoonData.content;
    }
    else if (Array.isArray(webtoonData)) {
        webtoonsToDisplay = webtoonData;
    }

    if (webtoonsToDisplay.length === 0) {
        return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
    }

    return (
        <div className="bg-white text-black" ref={containerRef}>
            <h2 className="text-xl font-bold text-left">{title}</h2>
            <p className="text-xs text-gray-500 text-left mb-5">{coment}</p>

            <div className="relative">
                {/* 슬라이더 컨테이너 */}
                <div 
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* 슬라이더 내비게이션 - 왼쪽 화살표 버튼 */}
                    <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition-all duration-200"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="text-gray-800" size={24} />
                    </button>

                    {/* 오른쪽 화살표 버튼 */}
                    <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 rounded-full p-2 shadow-md hover:bg-gray-200 transition-all duration-200"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="text-gray-800" size={24} />
                    </button>

                    {/* 카드 컨테이너 */}
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto pb-4 scrollbar-hide px-0"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
                    >
                        {webtoonsToDisplay.map((webtoon, index) => (
                            <div
                                key={`webtoon-${webtoon.id}-${index}`}
                                className="relative group flex-shrink-0 mx-2"
                            >
                                <div className="absolute top-0 left-0 z-20 p-2 text-white text-5xl font-bold">
                                    {index + 1}
                                </div>
                                <WebtoonCard
                                    webtoon={webtoon}
                                    size={cardSize}
                                    showAI={showAI}
                                    showBadges={showBadges}
                                    showActionButtons={showActionButtons}
                                    countType={countType}
                                    aiPercent={webtoon.sim !== undefined ? Math.round(webtoon.sim) : undefined}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WebtoonSlider, (prevProps, nextProps) => {
    return prevProps.title === nextProps.title &&
        prevProps.webtoons === nextProps.webtoons &&
        prevProps.autoSlideInterval === nextProps.autoSlideInterval;
});