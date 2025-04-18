import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useWebtoonLikeStore } from "@/entities/webtoon-like/api/store.ts";
import { WebtoonLikeRequest } from "@/entities/webtoon-like/model/types.ts";
import { useWebtoonCountsStore } from "@/entities/webtoon/api/WebtoonCountsStore.ts";

const WebtoonLikeButton = ({ webtoonId }:WebtoonLikeRequest) => {
    // 0: 중립 상태, 1: 좋아요, 2: 싫어요
    const [state, setState] = useState(0);
    const [showText, setShowText] = useState(false);

    const toggleLike = useWebtoonLikeStore(state => state.toggleLike);
    const likedWebtoons = useWebtoonLikeStore(state => state.likedWebtoons);
    
    const increaseLikeCount = useWebtoonCountsStore(state => state.increaseLikeCount);
    const decreaseLikeCount = useWebtoonCountsStore(state => state.decreaseLikeCount);

    useEffect(() => {
        if (webtoonId && likedWebtoons.has(webtoonId)) {
            const isLiked = likedWebtoons.get(webtoonId);

            if (isLiked === true) {
                setState(1);
            } else if (isLiked === false) {
                setState(2);
            } else {
                setState(0);
            }

        } else {
            setState(0); // 좋아요 정보가 없는 경우 중립 상태로 설정
        }
    }, [likedWebtoons, webtoonId]);

    const handleClick = async () => {
        if (webtoonId) {
            try {
                const prevState = state;
                
                const newState = (state + 1) % 3;
                
                // 카운트 업데이트
                if (prevState === 0 && newState === 1) {
                    increaseLikeCount(webtoonId);
                } 
                else if (prevState === 1 && newState === 2) {
                    decreaseLikeCount(webtoonId);
                }
                
                setState(newState);
                
                await toggleLike({ webtoonId });
                
            } catch (error) {
                console.error('좋아요 처리 중 오류 발생:', error);
                setState(state);
            }
        } else {
            setState((prevState) => (prevState + 1) % 3);
        }
    };

    const getButtonContent = () => {
        switch (state) {
            case 0: // 중립 상태
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white" />,
                    text: "평가할래?",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
            case 1: // 좋아요
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white" />,
                    text: "좋아요",
                    bgColor: "bg-blue-500/70 hover:bg-blue-600/70"
                };
            case 2: // 싫어요
                return {
                    icon: <ThumbsDown className="h-3 w-3 text-white" />,
                    text: "싫어요",
                    bgColor: "bg-red-500/70 hover:bg-red-600/70"
                };
            default:
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white opacity-50" />,
                    text: "평가할래?",
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

export default WebtoonLikeButton;