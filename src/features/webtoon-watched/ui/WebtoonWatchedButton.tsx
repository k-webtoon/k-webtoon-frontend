import { useState, useEffect } from 'react';
import { Eye, EyeOff, Slash } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useWebtoonWatchedStore } from "@/entities/webtoon-watched/api/store.ts";
import { WebtoonWatchedRequest } from "@/entities/webtoon-watched/model/types.ts";
import { useWebtoonCountsStore } from "@/entities/webtoon/api/WebtoonCountsStore.ts";

const WebtoonWatchedButton = ({ webtoonId }: WebtoonWatchedRequest) => {
    // 0: 중립, 1: 봤어요, 2: 보지 않을래요
    const [watchState, setWatchState] = useState(0);
    const [showText, setShowText] = useState(false);

    const toggleWatched = useWebtoonWatchedStore(state => state.toggleWatched);
    const watchedWebtoons = useWebtoonWatchedStore(state => state.watchedWebtoons);
    
    const increaseWatchedCount = useWebtoonCountsStore(state => state.increaseWatchedCount);
    const decreaseWatchedCount = useWebtoonCountsStore(state => state.decreaseWatchedCount);

    useEffect(() => {
        if (webtoonId && watchedWebtoons.has(webtoonId)) {
            const watched = watchedWebtoons.get(webtoonId);

            if (watched === true) {
                setWatchState(1);
            } else if (watched === false) {
                setWatchState(2);
            } else {
                setWatchState(0);
            }

        } else {
            setWatchState(0); // 봤어요 정보가 없는 경우 중립 상태로 설정
        }
    }, [watchedWebtoons, webtoonId]);

    const handleClick = async () => {
        if (webtoonId) {
            try {
                // 현재 상태 저장
                const prevState = watchState;
                
                // 다음 상태 계산
                const newState = (watchState + 1) % 3;
                setWatchState(newState);
                
                // 카운트 업데이트
                if (prevState === 0 && newState === 1) {
                    increaseWatchedCount(webtoonId);
                } 
                else if (prevState === 1 && newState === 2) {
                    decreaseWatchedCount(webtoonId);
                }

                await toggleWatched({ webtoonId });

            } catch (error) {
                console.error('봤어요 처리 중 오류 발생:', error);
                setWatchState(watchState);
            }
        } else {
            setWatchState((prevState) => (prevState + 1) % 3);
        }
    };

    const getButtonContent = () => {
        switch (watchState) {
            case 0: // 중립 상태
                return {
                    icon: <Eye className="h-3 w-3 text-white" />,
                    text: "봤니?",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
            case 1: // 봤어요
                return {
                    icon: <Eye className="h-3 w-3 text-white" />,
                    text: "봤어요",
                    bgColor: "bg-purple-500/70 hover:bg-purple-600/70"
                };
            case 2: // 보지 않을래요
                return {
                    icon: <EyeOff className="h-3 w-3 text-white" />,
                    text: "보지 않을래요",
                    bgColor: "bg-red-500/70 hover:bg-red-600/70"
                };
            default:
                return {
                    icon: <Slash className="h-3 w-3 text-white" />,
                    text: "선택해주세요",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
        }
    };

    const { icon, text, bgColor } = getButtonContent();

    return (
        <div className="relative">
            <Button
                onClick={handleClick}
                size="icon"
                className={`h-8 px-3 rounded-md ${bgColor} backdrop-blur-sm flex items-center transition-all duration-200`}
                onMouseEnter={() => setShowText(true)}
                onMouseLeave={() => setShowText(false)}
            >
                {icon}
            </Button>
            {showText && (
                <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full mb-1 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {text}
                </div>
            )}
        </div>
    );
};

export default WebtoonWatchedButton;