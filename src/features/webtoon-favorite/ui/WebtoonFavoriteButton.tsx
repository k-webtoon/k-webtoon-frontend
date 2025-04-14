import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useWebtoonFavoriteStore } from "@/entities/webtoon-favorite/api/store.ts";
import { WebtoonFavoriteRequest } from "@/entities/webtoon-favorite/model/types.ts";

const WebtoonFavoriteButton = ({ webtoonId }: WebtoonFavoriteRequest) => {
    // 즐겨찾기 상태 (true: 즐겨찾기됨, false: 즐겨찾기 안됨)
    const [isBookmarked, setIsBookmarked] = useState(false);
    // 툴팁 표시 상태
    const [showText, setShowText] = useState(false);

    const toggleFavorite = useWebtoonFavoriteStore(state => state.toggleFavorite);
    const favoriteWebtoons = useWebtoonFavoriteStore(state => state.favoriteWebtoons);

    useEffect(() => {
        if (webtoonId && favoriteWebtoons.has(webtoonId)) {
            const isFavorite = favoriteWebtoons.get(webtoonId);
            setIsBookmarked(isFavorite || false);
        } else {
            setIsBookmarked(false); // 즐겨찾기 정보가 없는 경우 기본값으로 설정
        }
    }, [favoriteWebtoons, webtoonId]);

    const handleClick = async () => {
        if (webtoonId) {
            try {
                // API 호출 - API가 자동으로 즐겨찾기 상태를 토글
                await toggleFavorite({ webtoonId });
                // API 호출 후 상태는 useEffect에 의해 자동으로 업데이트됨
            } catch (error) {
                console.error('즐겨찾기 처리 중 오류 발생:', error);
            }
        } else {
            // webtoonId가 없는 경우 로컬 상태만 변경
            setIsBookmarked(prevState => !prevState);
        }
    };

    const getButtonContent = () => {
        if (isBookmarked) {
            return {
                icon: <Bookmark className="h-3 w-3 text-white fill-white" />,
                text: "즐겨찾기됨",
                bgColor: "bg-green-500/70 hover:bg-green-600/70"
            };
        } else {
            return {
                icon: <Bookmark className="h-3 w-3 text-white" />,
                text: "즐겨찾기할래?",
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

export default WebtoonFavoriteButton;