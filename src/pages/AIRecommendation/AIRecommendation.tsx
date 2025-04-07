import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Star, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card } from '@/shared/ui/shadcn/card';
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import { useWebtoonStore } from '@/entities/webtoon/model/store.ts';

const genreTagMap = {
  '액션': ['격투기', '무협', '생존', '복수', '도전', '전투', '사이코패스', '폭력성', '히어로', '전쟁', '암살자', '총기'],
  '코믹': ['개그', '병맛', '일상개그', '웃음', '하이텐션', '유쾌', '패러디', '병맛개그'],
  '일상': ['힐링', '소소함', '청춘', '자취', '일상툰', '리얼라이프', '하루하루', '동물', '반려동물'],
  '드라마': ['가족', '삼각관계', '성장', '사랑과 이별', '감정선', '서사', '눈물', '현실고발', '불륜', '불행', '비극'],
  '판타지': ['이세계', '마법', '게임판타지', '이능력', '차원이동', '환생물', '판타지액션', '고대문명', '마검', '소환사'],
  '역사': ['조선', '고구려', '사극', '왕', '궁중로맨스', '무장', '고전미', '역사왜곡', '왕족', '고증'],
  '순정': ['첫사랑', '고백', '짝사랑', '달달', '남사친', '여고생', '설렘', '계약연애', '후회물', '로맨스'],
  '감성': ['감성드라마', '몽환', '잔잔함', '서정적', '잔잔한 전개', '내면심리', '인생툰', '감성', '휴먼드라마'],
  '스포츠': ['야구', '축구', '농구', '체육고', '스포츠정신', '승부', '운동부', '시합'],
  '스릴러': ['서스펜스', '추리', '살인', '심리전', '범죄', '공포', '긴장감', '복수극', '납치', '스릴'],
};

// 임시 인기 웹툰 데이터
const popularWebtoons = [
  { id: 1, title: '나 혼자만 레벨업', author: '추공', genre: '판타지', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/783052/thumbnail/thumbnail_IMAG21_023d23c2-97ec-4dd7-8d71-0dd4c53b891c.jpg', rating: 9.9, views: 1200000 },
  { id: 2, title: '전지적 독자 시점', author: '싱숑', genre: '판타지', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/747269/thumbnail/thumbnail_IMAG21_4048794521764084273.jpg', rating: 9.8, views: 1100000 },
  { id: 3, title: '여신강림', author: '야옹이', genre: '로맨스', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/703846/thumbnail/thumbnail_IMAG21_4048794521764084273.jpg', rating: 9.7, views: 1000000 },
  { id: 4, title: '화산귀환', author: '비가', genre: '액션', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/769209/thumbnail/thumbnail_IMAG21_7220173823764518710.jpg', rating: 9.6, views: 950000 },
  { id: 5, title: '독립일기', author: '자까', genre: '일상', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/748105/thumbnail/thumbnail_IMAG21_d9398229-cbfd-47dc-9208-0f929f1eaef3.jpg', rating: 9.5, views: 900000 },
  { id: 6, title: '외모지상주의', author: '박태준', genre: '드라마', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/641253/thumbnail/thumbnail_IMAG21_4048794521764084273.jpg', rating: 9.4, views: 850000 },
  { id: 7, title: '갓 오브 하이스쿨', author: '박용제', genre: '액션', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/318995/thumbnail/thumbnail_IMAG21_3546307457055187510.jpg', rating: 9.3, views: 800000 },
  { id: 8, title: '연애혁명', author: '232', genre: '로맨스', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/570503/thumbnail/thumbnail_IMAG21_7291945820447799095.jpg', rating: 9.2, views: 750000 },
  { id: 9, title: '신의 탑', author: 'SIU', genre: '판타지', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/183559/thumbnail/thumbnail_IMAG21_3546307457055187510.jpg', rating: 9.1, views: 700000 },
  { id: 10, title: '취사병 전설이 되다', author: '제이', genre: '코믹', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/783054/thumbnail/thumbnail_IMAG21_7149293296223018808.jpg', rating: 9.0, views: 650000 },
  { id: 11, title: '더 게이머', author: '성상영', genre: '판타지', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/358967/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.9, views: 600000 },
  { id: 12, title: '광마회귀', author: '유진성', genre: '액션', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/786537/thumbnail/thumbnail_IMAG21_7291945820447799095.jpg', rating: 8.8, views: 550000 },
  { id: 13, title: '내일', author: '라마', genre: '드라마', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/793283/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.7, views: 500000 },
  { id: 14, title: '윈드브레이커', author: '조용석', genre: '스포츠', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/602910/thumbnail/thumbnail_IMAG21_7220173823764518710.jpg', rating: 8.6, views: 450000 },
  { id: 15, title: '스위트홈', author: '김칸비', genre: '스릴러', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/701081/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.5, views: 400000 },
  { id: 16, title: '기기괴괴', author: '오성대', genre: '공포', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/557672/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.4, views: 350000 },
  { id: 17, title: '호랑이형님', author: '이상규', genre: '코믹', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/650305/thumbnail/thumbnail_IMAG21_7221635195813024057.jpg', rating: 8.3, views: 300000 },
  { id: 18, title: '하루만 네가 되고 싶어', author: '삼', genre: '로맨스', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/783052/thumbnail/thumbnail_IMAG21_3546307457055187510.jpg', rating: 8.2, views: 250000 },
  { id: 19, title: '모죠의 일지', author: '모죠', genre: '일상', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/728750/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.1, views: 200000 },
  { id: 20, title: '평범한 8반', author: '영파카', genre: '드라마', thumbnail: 'https://shared-comic.pstatic.net/thumb/webtoon/597478/thumbnail/thumbnail_IMAG21_7219895501494138680.jpg', rating: 8.0, views: 150000 }
];

const genres = Object.keys(genreTagMap);


const AIRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [selectedWebtoons, setSelectedWebtoons] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { topWebtoonList, fetchTopWebtoons } = useWebtoonStore();

  React.useEffect(() => {
    fetchTopWebtoons(0, 20);
  }, [fetchTopWebtoons]);

  const handleGenreSelect = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
      const newTags = { ...selectedTags };
      delete newTags[genre];
      setSelectedTags(newTags);
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
      setSelectedTags({ ...selectedTags, [genre]: [] });
    }
  };

  const handleTagSelect = (genre: string, tag: string) => {
    setSelectedTags(prev => {
      const genreTags = prev[genre] || [];
      if (genreTags.includes(tag)) {
        return {
          ...prev,
          [genre]: genreTags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          [genre]: [...genreTags, tag]
        };
      }
    });
  };

  const handleWebtoonSelect = (webtoonId: number) => {
    setSelectedWebtoons(prev => {
      if (prev.includes(webtoonId)) {
        return prev.filter(id => id !== webtoonId);
      } else {
        return [...prev, webtoonId];
      }
    });
  };

  const handleNext = () => {
    if (step === 1 && selectedGenres.length === 0) return;
    if (step === 3 && selectedWebtoons.length < 5) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // TODO: AI 추천 데이터 저장 API 호출
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <Wand2 className="w-8 h-8 text-purple-500 mr-2" />
              <h2 className="text-2xl font-bold">관심 있는 장르를 선택해주세요</h2>
            </div>
            <p className="text-center text-gray-500">
              최대 3개까지 선택 가능합니다 ({selectedGenres.length}/3)
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreSelect(genre)}
                  className={`p-4 rounded-xl border text-base transition-all ${
                    selectedGenres.includes(genre)
                      ? 'border-purple-500 bg-purple-50 text-purple-600 font-medium'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleNext}
                disabled={selectedGenres.length === 0}
                className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 ${
                  selectedGenres.length > 0 
                    ? 'hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                다음
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold">선호하는 태그를 선택해주세요</h2>
            </div>
            <p className="text-center text-gray-500 mb-6">
              각 장르별로 최소 3개 이상의 태그를 선택해주세요
            </p>
            <div className="space-y-6">
              {selectedGenres.map((genre) => (
                <div key={genre} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{genre}</h3>
                    <span className="text-sm text-purple-600">
                      {selectedTags[genre]?.length || 0}/3+
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genreTagMap[genre as keyof typeof genreTagMap].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagSelect(genre, tag)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          selectedTags[genre]?.includes(tag)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold">추천 웹툰</h2>
            </div>
            <p className="text-center text-gray-500 mb-6">
              선택하신 취향을 바탕으로 인기 웹툰을 추천해드립니다
            </p>
            <p className="text-center text-purple-600 text-sm mb-6">
              관심있는 웹툰을 최소 5개 이상 선택해주세요 ({selectedWebtoons.length}/5+)
            </p>
            <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {topWebtoonList?.content?.map((webtoon) => {
                const isSelected = selectedWebtoons.includes(webtoon.id);
                return (
                  <div
                    key={webtoon.id}
                    onClick={() => handleWebtoonSelect(webtoon.id)}
                    className={`bg-white rounded-lg ${
                      isSelected 
                        ? 'ring-2 ring-purple-500 shadow-md' 
                        : 'hover:shadow-md'
                    } transition-all cursor-pointer relative`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-purple-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                      <img
                        src={webtoon.thumbnailUrl}
                        alt={webtoon.titleName}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/240x320?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                        {webtoon.titleName}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{webtoon.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">
                          {webtoon.rankGenreTypes[0]}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs font-medium">{webtoon.starScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedWebtoons.length >= 5 && (
              <div className="flex justify-center mt-8 pt-4 border-t">
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  선택 완료
                </Button>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold">선호 취향 분석 결과</h2>
            </div>
            
            {/* 선택한 장르 */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">선택하신 장르</h3>
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <span key={genre} className="px-4 py-2 bg-purple-500 text-white rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* 선택한 태그 */}
            <div className="bg-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">선택하신 태그</h3>
              <div className="space-y-4">
                {selectedGenres.map((genre) => (
                  <div key={genre}>
                    <h4 className="font-medium mb-2">{genre}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags[genre]?.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-indigo-500 text-white rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 선택한 웹툰 */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">선택하신 웹툰</h3>
              <div className="grid grid-cols-5 gap-4">
                {selectedWebtoons.map((webtoonId) => {
                  const webtoon = topWebtoonList?.content?.find(w => w.id === webtoonId);
                  if (!webtoon) return null;
                  return (
                    <div key={webtoonId} className="space-y-2">
                      <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <img
                          src={webtoon.thumbnailUrl}
                          alt={webtoon.titleName}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/240x320?text=No+Image';
                          }}
                        />
                      </div>
                      <p className="text-sm font-medium truncate">{webtoon.titleName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                AI 추천 받기
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI 맞춤 추천 설정
            </h1>
            <p className="text-gray-500">
              당신의 취향을 분석하여 맞춤 웹툰을 추천해드립니다
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          s <= step
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                  {step === 3 && (
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-yellow-500 mr-2" />
                    </div>
                  )}
                  {step === 4 && (
                    <div className="flex items-center">
                      <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {step}/4 단계
                </span>
              </div>

              {renderStepContent()}

              {step > 1 && step < 3 && (
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedGenres.every(genre => (selectedTags[genre]?.length || 0) >= 3)}
                    className={`bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 ${
                      selectedGenres.every(genre => (selectedTags[genre]?.length || 0) >= 3)
                        ? 'hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    다음
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation; 