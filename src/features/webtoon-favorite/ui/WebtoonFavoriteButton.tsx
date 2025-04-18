import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { useWebtoonFavoriteStore } from "@/entities/webtoon-favorite/api/store.ts";
import { WebtoonFavoriteRequest } from "@/entities/webtoon-favorite/model/types.ts";
import { useWebtoonCountsStore } from "@/entities/webtoon/api/WebtoonCountsStore.ts";

const WebtoonFavoriteButton = ({ webtoonId }: WebtoonFavoriteRequest) => {
    // 즐겨찾기 상태 (true: 즐겨찾기됨, false: 즐겨찾기 안됨)
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [prevBookmarked, setPrevBookmarked] = useState<boolean>(false);
    // 툴팁 표시 상태
    const [showText, setShowText] = useState(false);

    const toggleFavorite = useWebtoonFavoriteStore(state => state.toggleFavorite);
    const favoriteWebtoons = useWebtoonFavoriteStore(state => state.favoriteWebtoons);
    
    const increaseFavoriteCount = useWebtoonCountsStore(state => state.increaseFavoriteCount);
    const decreaseFavoriteCount = useWebtoonCountsStore(state => state.decreaseFavoriteCount);

    useEffect(() => {
        if (webtoonId && favoriteWebtoons.has(webtoonId)) {
            const isFavorite = favoriteWebtoons.get(webtoonId);
            if (isFavorite && !isBookmarked) {
                increaseFavoriteCount(webtoonId);
            } else if (!isFavorite && isBookmarked) {
                decreaseFavoriteCount(webtoonId);
            }
            
            setPrevBookmarked(isBookmarked);
            setIsBookmarked(isFavorite || false);
        } else {
            setPrevBookmarked(isBookmarked);
            setIsBookmarked(false); // 즐겨찾기 정보가 없는 경우 기본값으로 설정
        }
    }, [favoriteWebtoons, webtoonId]);

    const handleClick = async () => {
        if (webtoonId) {
            try {
                // 현재 상태의 반대값으로 새로운 상태 설정
                const newBookmarkedState = !isBookmarked;
                
                // 이전 상태 저장
                setPrevBookmarked(isBookmarked);
                
                // 새로운 상태로 업데이트
                setIsBookmarked(newBookmarkedState);
                
                // 카운트 업데이트
                if (newBookmarkedState) {
                    increaseFavoriteCount(webtoonId);
                } else {
                    decreaseFavoriteCount(webtoonId);
                }
                
                await toggleFavorite({ webtoonId });
            } catch (error) {
                console.error('즐겨찾기 처리 중 오류 발생:', error);
                // 에러 발생 시 상태 롤백
                setIsBookmarked(prevBookmarked);
                
                // 카운트 롤백
                if (prevBookmarked) {
                    increaseFavoriteCount(webtoonId);
                } else {
                    decreaseFavoriteCount(webtoonId);
                }
            }
        } else {
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