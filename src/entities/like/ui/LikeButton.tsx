// LikeButton.tsx
import React, { useEffect, useState } from 'react';
import { useLikeStore } from '@/entities/like/model/store';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
    webtoonId: number;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    withCount?: boolean;
    likeCount?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
                                                          webtoonId,
                                                          className = '',
                                                          size = 'md',
                                                          withCount = false,
                                                          likeCount = 0,
                                                      }) => {
    const { likeWebtoon, unlikeWebtoon, isWebtoonLiked, isLoading } = useLikeStore();
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(likeCount);

    // 컴포넌트 마운트 시 좋아요 상태 확인
    useEffect(() => {
        setLiked(isWebtoonLiked(webtoonId));
    }, [webtoonId, isWebtoonLiked]);

    const handleLikeToggle = async () => {
        if (isLoading) return;
        console.log(localStorage.getItem('token'));

        try {
            if (liked) {
                await unlikeWebtoon(webtoonId);
                if (withCount) setCount(prev => Math.max(0, prev - 1));
            } else {
                await likeWebtoon(webtoonId);
                if (withCount) setCount(prev => prev + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error);
        }
    };

    // 크기에 따른 스타일 설정
    const sizeStyles = {
        sm: 'text-sm p-1',
        md: 'text-base p-2',
        lg: 'text-lg p-3',
    };

    const heartSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button
            onClick={handleLikeToggle}
            disabled={isLoading}
            className={`flex items-center justify-center rounded-full transition-all duration-300 ${
                liked
                    ? 'bg-pink-100 text-pink-500 hover:bg-pink-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            } ${sizeStyles[size]} ${className}`}
            aria-label={liked ? '좋아요 취소' : '좋아요'}
        >
            <Heart
                size={heartSizes[size]}
                className={`${liked ? 'fill-pink-500' : 'fill-transparent'} transition-all duration-300`}
            />

            {withCount && (
                <span className={`ml-2 font-medium ${liked ? 'text-pink-500' : 'text-gray-500'}`}>
          {count}
        </span>
            )}
        </button>
    );
};

// 사용 예시
// <LikeButton webtoonId={123} size="md" withCount={true} likeCount={42} />