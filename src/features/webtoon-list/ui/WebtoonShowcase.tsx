import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import WebtoonCard from '@/entities/webtoon/ui/WebtoonCard.tsx';
import {WebtoonPaginatedResponse} from '@/entities/webtoon/ui/types.ts';

// 상수 정의 - 컴포넌트 외부에 위치
const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 450;
const SCROLL_THRESHOLD = 50;

/**
 * WebtoonShowcase Props 인터페이스
 */
interface WebtoonShowcaseProps {
    title: string;
    coment: string;
    webtoons: () => Promise<WebtoonPaginatedResponse>;
    initialLoad?: boolean;
}
export const WebtoonShowcase: React.FC<WebtoonShowcaseProps> = ({
                                                                    title,
                                                                    coment,
                                                                    webtoons,
                                                                    initialLoad = true
                                                                }) => {

    const [webtoonData, setWebtoonData] = useState<WebtoonPaginatedResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(initialLoad);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 데이터 로드 함수 - WebtoonSlider 패턴 적용
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
            console.log("쇼케이스에서 로드된 데이터:", data);

            if (!data) {
                throw new Error('데이터가 없습니다.');
            }

            setWebtoonData(data);
        } catch (err) {
            console.error('웹툰 데이터 로드 오류:', err);
            setError('웹툰 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 초기 로드 또는 webtoons 변경 시 데이터 로드
    useEffect(() => {
        if (initialLoad || !webtoonData) {
            loadData();
        }
    }, [initialLoad, webtoons]);

    // 메모이제이션된 총 행 수 계산
    const totalRows = useMemo(() => {
        if (!webtoonData || !webtoonData.content) return 0;
        return Math.ceil(webtoonData.content.length / ITEMS_PER_ROW);
    }, [webtoonData]);

    /**
     * 좋아요 처리
     */
    const handleLike = useCallback((id: string) => {
        if (!webtoonData || !webtoonData.content) return;

        setWebtoonData(prev => {
            if (!prev || !prev.content) return prev;

            return {
                ...prev,
                content: prev.content.map(webtoon =>
                    (webtoon.titleId === id || webtoon.id === id)
                        ? { ...webtoon, isLiked: !webtoon.isLiked }
                        : webtoon
                )
            };
        });
    }, []);

    /**
     * 웹툰 보기 처리
     */
    const handleView = useCallback((id: string) => {
        console.log(`웹툰 보러가기: ${id}`);
        // 상세 페이지로 이동하는 로직 구현
    }, []);

    /**
     * 스크롤 이벤트 핸들러
     */
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

        // 현재 보이는 행 인덱스 계산
        const newIndex = Math.round(scrollTop / ROW_HEIGHT);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    }, [currentIndex]);

    /**
     * 스크롤 이벤트 리스너 등록
     */
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    /**
     * 스냅 스크롤 효과 구현
     */
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || isLoading) return;

        // 부드럽게 스크롤
        scrollContainer.scrollTo({
            top: currentIndex * ROW_HEIGHT,
            behavior: 'smooth'
        });
    }, [currentIndex, isLoading]);

    /**
     * 마우스 휠 이벤트 처리 함수
     */
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();

        const direction = e.deltaY > 0 ? 1 : -1;

        // 다음 인덱스 계산 (범위 내에서만)
        const nextIndex = Math.min(
            Math.max(0, currentIndex + direction),
            totalRows - 1
        );

        if (nextIndex !== currentIndex) {
            setCurrentIndex(nextIndex);
        }
    }, [currentIndex, totalRows]);

    /**
     * 특정 행으로 이동
     */
    const goToRow = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    /**
     * 행 렌더링 함수
     */
    const renderRow = useCallback((rowIndex: number) => {
        if (!webtoonData || !webtoonData.content) return null;

        const startIdx = rowIndex * ITEMS_PER_ROW;
        const endIdx = startIdx + ITEMS_PER_ROW;
        const rowItems = webtoonData.content.slice(startIdx, endIdx);

        return (
            <div
                key={rowIndex}
                className="grid grid-cols-3 gap-6 py-4"
                style={{
                    height: `${ROW_HEIGHT}px`,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always'
                }}
            >
                {rowItems.map((webtoon) => (
                    <div key={webtoon.titleId || webtoon.id} className="flex justify-center">
                        <WebtoonCard
                            webtoon={webtoon}
                            onLike={() => handleLike(webtoon.titleId || webtoon.id || '')}
                            onView={() => handleView(webtoon.titleId || webtoon.id || '')}
                        />
                    </div>
                ))}
            </div>
        );
    }, [webtoonData, handleLike, handleView]);

    // 로딩 상태 표시
    if (isLoading) {
        return <div className="p-6 text-center">로딩 중...</div>;
    }

    // 에러 상태 표시
    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={loadData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 데이터가 없을 때
    if (!webtoonData || !webtoonData.content || webtoonData.content.length === 0) {
        return <div className="p-6 text-center">웹툰 데이터가 없습니다.</div>;
    }

    return (
        <div className="w-full bg-white text-black p-6">
            <h2 className="text-xl font-bold text-left">{title}</h2>
            <p className="text-xs text-gray-500 text-left">{coment}</p>
            {/* 스크롤 가능한 컨테이너 */}
            <div
                ref={scrollContainerRef}
                className="custom-scrollbar mt-4 h-[470px] overflow-y-auto scroll-smooth"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e0 #f7fafc',
                    scrollSnapType: 'y mandatory'
                }}
                onWheel={handleWheel}
            >
                {/* 행 렌더링 */}
                {Array.from({ length: totalRows }).map((_, index) => renderRow(index))}
            </div>

            {/* 페이지 인디케이터 */}
            {totalRows > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalRows }).map((_, index) => (
                        <button
                            key={index}
                            className={`h-2 w-2 rounded-full ${
                                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                            onClick={() => goToRow(index)}
                            aria-label={`${index + 1}번째 행으로 이동`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WebtoonShowcase;