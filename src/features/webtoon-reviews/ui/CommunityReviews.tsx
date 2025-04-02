import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/shadcn/avatar.tsx";
import { Star } from 'lucide-react';

interface Review {
    id: string;
    webtoonId: string;
    webtoonTitle: string;
    content: string;
    rating: number;
    authorName: string;
    authorAvatar?: string;
    createdAt: Date;
}

interface CommunityReviewsProps {
    title?: string;
    reviews: Review[];
}

const CommunityReviews: React.FC<CommunityReviewsProps> = ({
                                                               title = "커뮤니티 인기 리뷰",
                                                               reviews
                                                           }) => {
    // 시간 형식화 함수
    const formatTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

        return date.toLocaleDateString();
    };

    // 별점 렌더링
    const renderStars = (rating: number): React.ReactNode => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half" className="relative w-4 h-4">
                    <Star className="w-4 h-4 absolute text-yellow-400" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        }

        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
            );
        }

        return stars;
    };

    return (
        <div className="container mx-auto px-4 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.map((review) => (
                    <Card key={review.id} className="h-full border border-gray-200 hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base font-bold text-gray-800">{review.webtoonTitle}</CardTitle>
                                    <div className="flex items-center mt-1">
                                        {renderStars(review.rating)}
                                        <span className="text-xs text-gray-500 ml-2">{review.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Avatar className="w-8 h-8 mr-2">
                                        <AvatarImage src={review.authorAvatar} alt={review.authorName} />
                                        <AvatarFallback className="bg-gray-200 text-gray-600">
                                            {review.authorName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-medium text-gray-700">{review.authorName}</p>
                                        <p className="text-xs text-gray-500">{formatTimeAgo(review.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-gray-600 text-sm line-clamp-3">{review.content}</p>
                            <button className="text-xs text-yellow-500 font-medium mt-2 hover:underline">
                                더 보기
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button className="px-6 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    더 많은 리뷰 보기
                </button>
            </div>
        </div>
    );
};

export default CommunityReviews;