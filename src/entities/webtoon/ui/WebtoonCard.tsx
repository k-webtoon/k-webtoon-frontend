import {Link} from "react-router-dom";
import {Card, CardFooter, CardTitle} from "@/shared/ui/shadcn/card.tsx"
import {Badge} from "@/shared/ui/shadcn/badge.tsx"
import {Star, ThumbsUp, Bookmark, Eye} from "lucide-react"
import {WebtoonInfo, GENRE_MAPPING} from "@/entities/webtoon/model/types.ts";
import {cn} from "@/shared/lib/cn";
import WebtoonLikeButton from "@/features/webtoon-like/ui/WebtoonLikeButton.tsx";
import WebtoonFavoriteButton from "@/features/webtoon-favorite/ui/WebtoonFavoriteButton.tsx";
import WebtoonWatchedButton from "@/features/webtoon-watched/ui/WebtoonWatchedButton.tsx";
import {useWebtoonLikeStore} from "@/entities/webtoon-like/api/store.ts";
import {useWebtoonFavoriteStore} from "@/entities/webtoon-favorite/api/store.ts";
import {useWebtoonWatchedStore} from "@/entities/webtoon-watched/api/store.ts";
import {styled} from '@mui/material/styles';
import {Fade, Grow} from '@mui/material';
import {CSSProperties, MouseEvent} from "react";

export interface WebtoonCardProps {
    webtoon: WebtoonInfo;
    size?: 'sm' | 'md' | 'lg';
    showBadges?: boolean;
    showTitle?: boolean;
    showGenre?: boolean;
    showActionButtons?: boolean;
    showAI?: boolean;
    aiPercent?: number;
    countType?: 'likes' | 'favorites' | 'watched' | null;
}

// 카드 뒤집기 애니메이션 컴포넌트
const CardContainer = styled('div')({
    position: 'relative',
    perspective: '1000px',
    width: '100%',
    height: '100%',
    '&:hover .card-inner': {
        transform: 'rotateY(180deg)',
    }
});

const CardInner = styled('div')({
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
});

const CardFace = styled('div')({
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
});

const CardFront = styled(CardFace)({
    zIndex: 2,
});

const CardBack = styled(CardFace)({
    transform: 'rotateY(180deg)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
});

export default function WebtoonCard({
                                        webtoon,
                                        size = 'md',
                                        showBadges = true,
                                        showTitle = true,
                                        showGenre = true,
                                        showActionButtons = true,
                                        showAI = false,
                                        aiPercent,
                                        countType = null
                                    }: WebtoonCardProps) {

    const sizeStyles = {
        sm: 'w-64 md:w-72 h-80 md:h-96',
        md: 'w-72 md:w-80 h-96 md:h-110',
        lg: 'w-80 md:w-96 h-110 md:h-120',
    };

    const similarityPercent = aiPercent !== undefined ? aiPercent : (webtoon.sim !== undefined ? Math.round(webtoon.sim) : 0);

    const likedWebtoons = useWebtoonLikeStore(state => state.likedWebtoons);
    const favoriteWebtoons = useWebtoonFavoriteStore(state => state.favoriteWebtoons);
    const watchedWebtoons = useWebtoonWatchedStore(state => state.watchedWebtoons);

    const baseLikeCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;
    const baseFavoriteCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;
    const baseWatchedCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;

    const isLikedByUser = webtoon.id && likedWebtoons.has(webtoon.id) && likedWebtoons.get(webtoon.id) === true;
    const isFavoritedByUser = webtoon.id && favoriteWebtoons.has(webtoon.id) && favoriteWebtoons.get(webtoon.id) === true;
    const isWatchedByUser = webtoon.id && watchedWebtoons.has(webtoon.id) && watchedWebtoons.get(webtoon.id) === true;

    const displayLikeCount = baseLikeCount + (isLikedByUser ? 1 : 0);
    const displayFavoriteCount = baseFavoriteCount + (isFavoritedByUser ? 1 : 0);
    const displayWatchedCount = baseWatchedCount + (isWatchedByUser ? 1 : 0);

    const thumbnailStyle: CSSProperties = {
        backgroundImage: `url(${webtoon.thumbnailUrl || "/placeholder.svg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.3) blur(1px)',
    };
    
    // 액션 버튼 클릭 시 이벤트 전파 중단
    const handleButtonClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Card className={cn(
            "flex-shrink-0 overflow-hidden relative group",
            sizeStyles[size]
        )}>
            <CardContainer>
                <CardInner className="card-inner">
                    <CardFront>
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={webtoon.thumbnailUrl || "/placeholder.svg"}
                                alt={webtoon.titleName}
                                className="object-cover w-full h-full transition-transform group-hover:scale-105"
                            />
                        </div>

                        <div>
                            <div>
                                {showAI && (
                                    <div className="mt-1 mb-1">
                                        <div className="flex items-center text-xs">
                                            <span className="mr-1 text-xs">AI</span>
                                            <div className="flex-1 h-1 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-1 bg-green-500 rounded-full"
                                                    style={{width: `${similarityPercent}%`}}
                                                ></div>
                                            </div>
                                            <span className="ml-1 text-xs">{similarityPercent}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {showBadges && (
                            <div className="absolute top-2 left-2 flex gap-2 z-10">
                                {webtoon.finish && (
                                    <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
                                        완결
                                    </Badge>
                                )}
                                {webtoon.adult && (
                                    <Badge variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">
                                        성인
                                    </Badge>
                                )}
                            </div>
                        )}

                        {countType && (
                            <div className="absolute top-2 right-2 z-10">
                                {countType === 'likes' && (
                                    <Badge variant="secondary"
                                           className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                                        <ThumbsUp className="h-3.5 w-3.5"/>
                                        <span className="font-semibold">{displayLikeCount}</span>
                                    </Badge>
                                )}
                                {countType === 'favorites' && (
                                    <Badge variant="secondary"
                                           className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                                        <Bookmark className="h-3.5 w-3.5"/>
                                        <span className="font-semibold">{displayFavoriteCount}</span>
                                    </Badge>
                                )}
                                {countType === 'watched' && (
                                    <Badge variant="secondary"
                                           className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                                        <Eye className="h-3.5 w-3.5"/>
                                        <span className="font-semibold">{displayWatchedCount}</span>
                                    </Badge>
                                )}
                            </div>
                        )}

                        <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-16 pb-4 px-4">
                            {showAI && (
                                <div className="flex items-center text-xs text-white/80 mb-2 drop-shadow-lg">
                                  <span>
                                    당신의 취향과 <span className="text-green-500 font-bold">{similarityPercent}%</span> 일치
                                  </span>
                                </div>
                            )}

                            {showTitle && (
                                <div className="flex justify-between items-start text-white mb-2">
                                    <CardTitle className="text-base truncate text-white">{webtoon.titleName}</CardTitle>
                                    <div className="flex items-center">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400"/>
                                        <span className="text-xs ml-1 text-white">
                                          {webtoon.starScore.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {showGenre && (
                                <div className="flex items-center text-xs text-white/80 mb-2">
                                  <span>
                                    {Array.isArray(webtoon.rankGenreTypes) && webtoon.rankGenreTypes.length > 0
                                        ? webtoon.rankGenreTypes.map(genre => {
                                            if (Object.keys(GENRE_MAPPING).includes(genre)) {
                                                return GENRE_MAPPING[genre];
                                            }
                                            return genre;
                                        }).join(', ')
                                        : '장르 없음'
                                    }
                                  </span>
                                    <span className="mx-1">•</span>
                                    <span>{webtoon.author}</span>
                                </div>
                            )}

                            {showActionButtons && (
                                <CardFooter className="p-0 flex justify-end gap-2" onClick={handleButtonClick}>
                                    <WebtoonLikeButton webtoonId={webtoon.id}/>
                                    <WebtoonFavoriteButton webtoonId={webtoon.id}/>
                                    <WebtoonWatchedButton webtoonId={webtoon.id}/>
                                </CardFooter>
                            )}
                        </div>
                    </CardFront>

                    <CardBack>
                        <div
                            className="absolute inset-0 z-0"
                            style={thumbnailStyle}
                        />
                        
                        {/* 카드 클릭 시 상세 페이지로 이동 */}
                        <div className="absolute inset-0 z-10">
                            <Link to={`/webtoon/${webtoon.id}`} className="absolute inset-0">
                                <span className="sr-only">웹툰 상세 페이지로 이동</span>
                            </Link>
                        </div>

                        <Fade in={true} timeout={600}>
                            <div className="p-5 text-center relative z-20">
                                <h3 className="font-bold text-white text-xl mb-4">{webtoon.titleName}</h3>
                                <Grow in={true} timeout={800}>
                                    <p className="text-sm text-gray-200 overflow-auto max-h-40 pointer-events-none">
                                        {webtoon.synopsis ||
                                            "이 웹툰의 시놉시스 정보가 준비되지 않았습니다. 웹툰 상세 페이지에서 더 많은 정보를 확인하세요."}
                                    </p>
                                </Grow>
                                
                                {/* 액션 버튼 영역 - 클릭 이벤트 전파 중단 처리 */}
                                {showActionButtons && (
                                    <div className="mt-4 flex justify-center gap-2 relative z-30" onClick={handleButtonClick}>
                                        <WebtoonLikeButton webtoonId={webtoon.id}/>
                                        <WebtoonFavoriteButton webtoonId={webtoon.id}/>
                                        <WebtoonWatchedButton webtoonId={webtoon.id}/>
                                    </div>
                                )}
                            </div>
                        </Fade>
                    </CardBack>
                </CardInner>
            </CardContainer>

            {showBadges && (
                <div className="absolute top-2 left-2 flex gap-2 z-30">
                    {webtoon.finish && (
                        <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">
                            완결
                        </Badge>
                    )}
                    {webtoon.adult && (
                        <Badge variant="secondary" className="bg-red-500 hover:bg-red-600 text-white">
                            성인
                        </Badge>
                    )}
                </div>
            )}

            {countType && (
                <div className="absolute top-2 right-2 z-30">
                    {countType === 'likes' && (
                        <Badge variant="secondary"
                               className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <ThumbsUp className="h-3.5 w-3.5"/>
                            <span className="font-semibold">{displayLikeCount}</span>
                        </Badge>
                    )}
                    {countType === 'favorites' && (
                        <Badge variant="secondary"
                               className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <Bookmark className="h-3.5 w-3.5"/>
                            <span className="font-semibold">{displayFavoriteCount}</span>
                        </Badge>
                    )}
                    {countType === 'watched' && (
                        <Badge variant="secondary"
                               className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <Eye className="h-3.5 w-3.5"/>
                            <span className="font-semibold">{displayWatchedCount}</span>
                        </Badge>
                    )}
                </div>
            )}
        </Card>
    );
}