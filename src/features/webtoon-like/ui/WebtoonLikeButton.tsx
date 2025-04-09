import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useWebtoonLikeStore } from "@/entities/webtoon-like/model/store";
import { WebtoonLikeRequest } from "@/entities/webtoon-like/ui/types.ts";

const WebtoonLikeButton = ({ webtoonId }:WebtoonLikeRequest) => {
    // 0: 중립 상태, 1: 좋아요, 2: 싫어요
    const [state, setState] = useState(0);
    const [showText, setShowText] = useState(false);

    const toggleLike = useWebtoonLikeStore(state => state.toggleLike);
    const likedWebtoons = useWebtoonLikeStore(state => state.likedWebtoons);

    useEffect(() => {
        if (webtoonId && likedWebtoons.has(webtoonId)) {
            const isLiked = likedWebtoons.get(webtoonId);
            setState(isLiked ? 1 : 2);
        } else {
            setState(0); // 좋아요 정보가 없는 경우 중립 상태로 설정
        }
    }, [likedWebtoons, webtoonId]);

    const handleClick = async () => {
        if (webtoonId) {
            try {
                // API 호출 - API가 자동으로 좋아요 상태를 토글
                await toggleLike({ webtoonId });
                // API 호출 후 상태는 useEffect에 의해 자동으로 업데이트됨
            } catch (error) {
                console.error('좋아요 처리 중 오류 발생:', error);
            }
        } else {
            // webtoonId가 없는 경우 로컬 상태만 변경
            setState((prevState) => {
                if (prevState === 0) return 1;  // 중립 -> 좋아요
                if (prevState === 1) return 2;  // 좋아요 -> 싫어요
                return 1;  // 싫어요 -> 좋아요
            });
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