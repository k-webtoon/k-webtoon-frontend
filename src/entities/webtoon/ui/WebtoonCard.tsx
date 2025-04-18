import { Link } from "react-router-dom";
import { Card, CardFooter, CardTitle } from "@/shared/ui/shadcn/card.tsx"
import { Badge } from "@/shared/ui/shadcn/badge.tsx"
import { Star, ThumbsUp, Bookmark, Eye } from "lucide-react"
import { mapGenre, WebtoonInfo, GENRE_MAPPING, GenreType } from "@/entities/webtoon/model/types.ts";
import { cn } from "@/shared/lib/cn";
import WebtoonLikeButton from "@/features/webtoon-like/ui/WebtoonLikeButton.tsx";
import WebtoonFavoriteButton from "@/features/webtoon-favorite/ui/WebtoonFavoriteButton.tsx";
import WebtoonWatchedButton from "@/features/webtoon-watched/ui/WebtoonWatchedButton.tsx";
import { useWebtoonLikeStore } from "@/entities/webtoon-like/api/store.ts";
import { useWebtoonFavoriteStore } from "@/entities/webtoon-favorite/api/store.ts";
import { useWebtoonWatchedStore } from "@/entities/webtoon-watched/api/store.ts";

export interface WebtoonCardProps {
    webtoon: WebtoonInfo | any;
    // 카드 사이즈
    size?: 'sm' | 'md' | 'lg';
    // 뱃지 표시 여부 (완결, 성인)
    showBadges?: boolean;
    // 타이틀 & 평점 표시 여부
    showTitle?: boolean;
    // 장르 & 작가 표시 여부 (판타지, ... )
    showGenre?: boolean;
    // 버튼 표시 여부 (좋아요,싫어요,북마크)
    showActionButtons?: boolean;
    // AI 추천
    showAI?: boolean;
    aiPercent?: number;
    // 카운트 표시 전용 (좋아요, 즐겨찾기, 봤어요 중 하나만 표시)
    countType?: 'likes' | 'favorites' | 'watched' | null;
}

export default function WebtoonCard({
                                        webtoon,
                                        size = 'md',
                                        showBadges = true,
                                        showTitle = true,
                                        showGenre = true,
                                        showActionButtons = true,
                                        showAI = false,
                                        aiPercent = 96,
                                        countType = null
                                    }: WebtoonCardProps) {

    const sizeStyles = {
        sm: 'w-64 md:w-72 h-80 md:h-96',
        md: 'w-72 md:w-80 h-96 md:h-110',
        lg: 'w-80 md:w-96 h-110 md:h-120',
    };

    // 서로 다른 웹툰 데이터 형식 처리
    const webtoonId = 'webtoonId' in webtoon ? webtoon.webtoonId : webtoon.id;
    const title = 'titleName' in webtoon ? webtoon.titleName : webtoon.title;
    
    // 평점 처리 (문자열 또는 숫자)
    const score = typeof webtoon.starScore === 'string' 
        ? parseFloat(webtoon.starScore) 
        : webtoon.starScore;
    
    // 장르 처리
    const genres: (string | GenreType)[] = 'rankGenreTypes' in webtoon 
        ? webtoon.rankGenreTypes 
        : ('genre' in webtoon ? webtoon.genre : []);
        
    // 좋아요, 즐겨찾기, 봤어요 버튼 상태 감시
    const likedWebtoons = useWebtoonLikeStore(state => state.likedWebtoons); 
    const favoriteWebtoons = useWebtoonFavoriteStore(state => state.favoriteWebtoons);
    const watchedWebtoons = useWebtoonWatchedStore(state => state.watchedWebtoons);
    
    // 각 타입에 대한 기준 카운트 계산
    const baseLikeCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;
    const baseFavoriteCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;
    const baseWatchedCount = webtoon.totalCount ? Number(webtoon.totalCount) : 0;
    
    // 현재 로그인한 유저의 액션 상태 확인
    const isLikedByUser = webtoonId && likedWebtoons.has(webtoonId) && likedWebtoons.get(webtoonId) === true;
    const isFavoritedByUser = webtoonId && favoriteWebtoons.has(webtoonId) && favoriteWebtoons.get(webtoonId) === true;
    const isWatchedByUser = webtoonId && watchedWebtoons.has(webtoonId) && watchedWebtoons.get(webtoonId) === true;
    
    // 카운트 계산 (API 카운트 + 사용자의 액션)
    const displayLikeCount = baseLikeCount + (isLikedByUser ? 1 : 0);
    const displayFavoriteCount = baseFavoriteCount + (isFavoritedByUser ? 1 : 0);
    const displayWatchedCount = baseWatchedCount + (isWatchedByUser ? 1 : 0);

    return (
        <Card className={cn(
            "flex-shrink-0 overflow-hidden relative group",
            sizeStyles[size]
        )}>
            {/* 이미지 배경 */}
            <Link to={`/webtoon/${webtoonId}`} className="block">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={webtoon.thumbnailUrl || "/placeholder.svg"}
                        alt={title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                </div>
            </Link>

            {/* 배지 */}
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
            
            {/* 페이지별 카운트 표시 배지 */}
            {countType && (
                <div className="absolute top-2 right-2 z-10">
                    {countType === 'likes' && (
                        <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span className="font-semibold">{displayLikeCount}</span>
                        </Badge>
                    )}
                    {countType === 'favorites' && (
                        <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <Bookmark className="h-3.5 w-3.5" />
                            <span className="font-semibold">{displayFavoriteCount}</span>
                        </Badge>
                    )}
                    {countType === 'watched' && (
                        <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 px-2 py-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span className="font-semibold">{displayWatchedCount}</span>
                        </Badge>
                    )}
                </div>
            )}
            
            {/* 카운트 표시 코드 삭제 */}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-16 pb-4 px-4">
                {/* 제목, 별점 */}
                {showTitle && (
                    <div className="flex justify-between items-start text-white mb-2">
                        <CardTitle className="text-base truncate text-white">{title}</CardTitle>
                        <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1 text-white">
                                {typeof score === 'number' ? score.toFixed(1) : score}
                            </span>

                        </div>
                    </div>
                )}

                {/* AI 추천 */}
                {showAI && (
                    <div className="flex items-center text-xs text-white/80 mb-2">
                        <span>당신의 취향과 {aiPercent}% 일치</span>
                    </div>
                )}

                {/* 장르, 작가 */}
                {showGenre && (
                    <div className="flex items-center text-xs text-white/80 mb-2">
                        <span>
                            {Array.isArray(genres) && genres.length > 0 
                                ? genres.map(genre => {
                                    if (typeof genre === 'string') {
                                        // genre가 GenreType인 경우 한글로 매핑
                                        if (Object.keys(GENRE_MAPPING).includes(genre)) {
                                            return GENRE_MAPPING[genre as GenreType];
                                        }
                                        return genre; // 이미 한글이거나 매핑되지 않는 경우
                                    } else {
                                        // WebtoonInfo의 rankGenreTypes는 GenreType 배열임
                                        return mapGenre(genre);
                                    }
                                }).join(', ') 
                                : '장르 없음'
                            }
                        </span>
                        <span className="mx-1">•</span>
                        <span>{webtoon.author}</span>
                    </div>
                )}

                {/* 액션 버튼 */}
                {showActionButtons && (
                    <CardFooter className="p-0 flex justify-end gap-2">
                        <WebtoonLikeButton webtoonId={webtoonId}/>
                        <WebtoonFavoriteButton webtoonId={webtoonId} />
                        <WebtoonWatchedButton webtoonId={webtoonId} />
                    </CardFooter>
                )}
            </div>
        </Card>
    );
}