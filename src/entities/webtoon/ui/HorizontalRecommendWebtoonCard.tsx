import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Card } from "@/shared/ui/shadcn/card";
import { Star } from "lucide-react";
import { WebtoonInfo, GENRE_MAPPING, GenreType, mapGenre } from "@/entities/webtoon/model/types.ts";
import { cn } from "@/shared/lib/cn.ts";
import { styled } from '@mui/material/styles';
import { Fade, Grow } from '@mui/material';

type CountType = 'views' | 'likes' | 'comments' | 'favorites' | 'watched' | null;

interface WebtoonCardHorizontalProps {
  webtoon: WebtoonInfo | any;
  size?: 'md';
  showGenre?: boolean;
  showActionButtons?: boolean;
  showAI?: boolean;
  aiPercent?: number;
  countType?: CountType;
}

// 카드 애니메이션 스타일 컴포넌트
const CardContainer = styled('div')({
  position: 'relative',
  perspective: '1000px',
  width: '100%',
  height: '100%',
  '&:hover .card-inner': {
    transform: 'rotateY(180deg)',
  },
  cursor: 'pointer',
  transition: 'box-shadow 0.3s ease-out',
  '&:hover': {
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
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

const HorizontalRecommendWebtoonCard: React.FC<WebtoonCardHorizontalProps> = ({
  webtoon,
  size = 'md',
  showGenre = true,
  showAI = true,
  aiPercent,
}) => {
  const webtoonId = 'webtoonId' in webtoon ? webtoon.webtoonId : webtoon.id;
  const similarityPercent = aiPercent !== undefined ? aiPercent : (webtoon.sim !== undefined ? Math.round(webtoon.sim) : 0);

  const sizeStyles = {
    md: 'w-72 md:w-80 h-36 md:h-40',
  };
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  
  const genres: (string | GenreType)[] = 'rankGenreTypes' in webtoon
    ? webtoon.rankGenreTypes
    : ('genre' in webtoon ? webtoon.genre : []);
  
  // 카드 틸트 효과 처리
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * -10;
    
    const shadowX = (x - 0.5) * 10;
    const shadowY = (y - 0.5) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      boxShadow: `${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.2)`,
      transition: isHovered ? 'none' : 'all 0.4s ease-out'
    });
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s ease-out'
    });
  };

  return (
    <Card 
      className={cn("flex-shrink-0 overflow-hidden relative group", sizeStyles[size])}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        backgroundImage: `url(${webtoon.thumbnailUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 to-black/60"
        style={{ mixBlendMode: 'multiply' }}
      />
      <CardContainer>
        <CardInner className="card-inner">
          <CardFront>
            <div className="grid grid-cols-7 h-full relative z-10">
              <div className="col-span-3">
                <Link to={`/webtoon/${webtoonId}`} className="block h-full">
                  <div className="w-full h-full overflow-hidden bg-pink-100">
                    <img
                      src={webtoon.thumbnailUrl}
                      alt={webtoon.titleName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              </div>

              <div className="col-span-4 px-2 py-6 flex flex-col justify-between bg-white/5 backdrop-blur-sm">
                <div className="text-left">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white">{webtoon.titleName}</h3>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-400" />
                      <span className="text-xs ml-1 text-white">
                        {webtoon.starScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  {showGenre && (
                    <div className="flex items-center text-xs text-white/80 mt-1">
                      <span className="truncate">
                        {Array.isArray(genres) && genres.length > 0
                          ? genres.map(genre => {
                            if (typeof genre === 'string') {
                              if (Object.keys(GENRE_MAPPING).includes(genre)) {
                                return GENRE_MAPPING[genre as GenreType];
                              }
                              return genre;
                            } else {
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
                </div>

                {showAI && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: `${similarityPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-[0.65rem] text-white/80 font-medium whitespace-nowrap">
                      {similarityPercent}% 일치
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardFront>
          
          <CardBack>
            <div 
              className="absolute inset-0 z-0" 
              style={{
                backgroundImage: `url(${webtoon.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.3) blur(1px)',
              }}
            />
            
            <Link to={`/webtoon/${webtoonId}`} className="absolute inset-0 z-20">
              <span className="sr-only">웹툰 상세 페이지로 이동</span>
            </Link>
            
            <Fade in={true} timeout={600}>
              <div className="p-3 text-center z-10 relative">
                <h3 className="font-bold text-white mb-2">{webtoon.titleName}</h3>
                <Grow in={true} timeout={800}>
                  <p className="text-sm text-gray-200 line-clamp-4">
                    {webtoon.synopsis || 
                    "이 웹툰의 시놉시스 정보가 준비되지 않았습니다. 웹툰 상세 페이지에서 더 많은 정보를 확인하세요."}
                  </p>
                </Grow>
              </div>
            </Fade>
          </CardBack>
        </CardInner>
      </CardContainer>
    </Card>
  );
};

export default HorizontalRecommendWebtoonCard;