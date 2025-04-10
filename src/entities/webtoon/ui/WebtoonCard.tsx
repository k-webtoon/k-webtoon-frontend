import { Link } from "react-router-dom";
import { Card, CardFooter, CardTitle } from "@/shared/ui/shadcn/card.tsx"
import { Badge } from "@/shared/ui/shadcn/badge.tsx"
import { Star } from "lucide-react"
import {mapGenre, WebtoonInfo} from "@/entities/webtoon/model/types.ts";
import { cn } from "@/shared/lib/cn";
import WebtoonLikeButton from "@/features/webtoon-like/ui/WebtoonLikeButton.tsx";
import BookmarkButton from "@/features/bookmark/ui/BookmarkButton.tsx";
import WatchedButton from "@/features/watched-status/ui/WatchedButton.tsx";

export interface WebtoonCardProps {
    webtoon: WebtoonInfo;
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
}

export default function WebtoonCard({
                                        webtoon,
                                        size = 'md',
                                        showBadges = true,
                                        showTitle = true,
                                        showGenre = true,
                                        showActionButtons = true,
                                        showAI = false,
                                        aiPercent = 96
                                    }: WebtoonCardProps) {

    const sizeStyles = {
        sm: 'w-64 md:w-72 h-80 md:h-96',
        md: 'w-72 md:w-80 h-96 md:h-110',
        lg: 'w-80 md:w-96 h-110 md:h-120',
    };

    return (
        <Card className={cn(
            "flex-shrink-0 overflow-hidden relative group",
            sizeStyles[size]
        )}>
            {/* 이미지 배경 */}
            <Link to={`/webtoon/${webtoon.id}`} className="block">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={webtoon.thumbnailUrl || "/placeholder.svg"}
                        alt={webtoon.titleName}
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

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-16 pb-4 px-4">
                {/* 제목, 별점 */}
                {showTitle && (
                    <div className="flex justify-between items-start text-white mb-2">
                        <CardTitle className="text-base truncate text-white">{webtoon.titleName}</CardTitle>
                        <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs ml-1 text-white">{webtoon.starScore.toFixed(1)}</span>
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
                            {webtoon.rankGenreTypes.map(genre =>
                                typeof genre === 'string' ? mapGenre(genre) : genre
                            ).join(', ')}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{webtoon.author}</span>
                    </div>
                )}

                {/* 액션 버튼 */}
                {showActionButtons && (
                    <CardFooter className="p-0 flex justify-end gap-2">
                        <WebtoonLikeButton webtoonId={webtoon.id}/>
                        <BookmarkButton />
                        <WatchedButton />
                    </CardFooter>
                )}
            </div>
        </Card>
    );
}