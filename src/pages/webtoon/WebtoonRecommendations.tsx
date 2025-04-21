import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { WebtoonInfo, GENRE_MAPPING, GenreType, KoreanGenreType } from '@/entities/webtoon/model/types';
import { RecommendationRequest } from '@/entities/webtoon/model/types';
import { useWebtoonStore } from '@/entities/webtoon/api/store';
import WebtoonCard from '@/entities/webtoon/ui/WebtoonCard';
import { createPortal } from 'react-dom';
import { getSectionId } from '@/shared/config/navigation';
import { useAuthStore } from '@/entities/auth/api/store';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Label } from '@/shared/ui/shadcn/label';
import { Button } from '@/shared/ui/shadcn/button';


// 필터 옵션 인터페이스
interface FilterOptions {
  sortBy: 'rating' | 'similarity';
  genre: KoreanGenreType[];
  use_popularity: boolean;
  use_art_style: boolean;
  use_tags: boolean;
}

interface TasteAnalysisFilterProps {
  onFilterChange: (options: FilterOptions) => void;
  genres: KoreanGenreType[];
  initialFilter?: FilterOptions;
}

// 서브네비게이션 필터 컴포넌트
const TasteAnalysisFilter: React.FC<TasteAnalysisFilterProps> = React.memo(({
  onFilterChange,
  genres,
  initialFilter
}) => {
  const { category } = useParams<{ category: string }>();
  const didInitRef = useRef(false);
  
  const defaultFilter: FilterOptions = {
    sortBy: 'similarity',
    genre: [],
    use_popularity: true,
    use_art_style: true,
    use_tags: true,
  };
  
  const [filter, setFilter] = useState<FilterOptions>(
    initialFilter || defaultFilter
  );

  const initialGenre = initialFilter?.genre?.length ? initialFilter.genre[0] : null;
  const [activeGenre, setActiveGenre] = useState<KoreanGenreType | null>(initialGenre as KoreanGenreType | null);

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
      setActiveGenre(initialFilter.genre?.length ? initialFilter.genre[0] : null);
    }
  }, [initialFilter]);

  useEffect(() => {
    const isInitialized = didInitRef.current;
    
    if (!isInitialized) {
      onFilterChange(filter);
      didInitRef.current = true;
    }
  }, [filter, onFilterChange]);

  const handleGenreClick = useCallback((genre: KoreanGenreType | '') => {
    if (genre === '' || activeGenre === genre) {
      setActiveGenre(null);
      
      const newFilter = {
        ...filter,
        genre: []
      };
      
      setFilter(newFilter);
      onFilterChange(newFilter);
    } else {
      setActiveGenre(genre);
      
      const newFilter = {
        ...filter,
        genre: [genre]
      };
      
      setFilter(newFilter);
      onFilterChange(newFilter);
    }
  }, [activeGenre, filter, onFilterChange]);

  const handleSortChange = useCallback((value: string) => {
    const newFilter = {
      ...filter,
      sortBy: value as 'rating' | 'similarity'
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  }, [filter, onFilterChange]);

  const handleCheckboxChange = useCallback((
    key: 'use_popularity' | 'use_art_style' | 'use_tags', 
    checked: boolean
  ) => {
    const newFilter = {
      ...filter,
      [key]: checked
    };
    setFilter(newFilter);
    onFilterChange({...newFilter});
  }, [filter, onFilterChange]);

  const resetFilters = useCallback(() => {
    setActiveGenre(null);
    const resetFilter: FilterOptions = {
      sortBy: 'similarity',
      genre: [],
      use_popularity: true,
      use_art_style: true,
      use_tags: true,
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  }, [onFilterChange]);

  const fanbaseId = `fanbase-${category || ''}`;
  const styleId = `style-${category || ''}`;
  const featuresId = `features-${category || ''}`;

  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-screen-xl mx-auto">
        {/* 장르 필터 */}
        <ul className="flex overflow-x-auto whitespace-nowrap px-4">
          <li className="pt-5 pb-3">
            <button 
              onClick={() => handleGenreClick('')}
              className={`text-sm rounded-full ${!activeGenre ? 'font-bold bg-yellow-400 px-2 py-1' : 'text-gray-700'} focus:outline-none`}
            >
              전체
            </button>
          </li>
          {genres.map((genre) => (
            <li key={genre} className="pt-5 pb-3 ml-6">
              <button 
                onClick={() => handleGenreClick(genre)}
                className={`text-sm rounded-full ${activeGenre === genre ? 'font-bold bg-yellow-400 px-2 py-1' : 'text-gray-700'} focus:outline-none`}
              >
                {genre}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between py-2 px-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button 
                onClick={() => handleSortChange('similarity')} 
                className={`text-xs px-2 py-1 rounded ${filter.sortBy === 'similarity' ? 'bg-gray-200 font-bold' : 'bg-gray-100'}`}
              >
                유사도순
              </button>
              <button 
                onClick={() => handleSortChange('rating')} 
                className={`text-xs px-2 py-1 rounded ${filter.sortBy === 'rating' ? 'bg-gray-200 font-bold' : 'bg-gray-100'}`}
              >
                평점순
              </button>
            </div>
            
            <div className="flex items-center group relative">
              <Checkbox
                id={fanbaseId}
                checked={filter.use_popularity}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('use_popularity', checked === true)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={fanbaseId}
                className="ml-2 text-xs cursor-pointer"
              >
                유사 팬층
              </Label>
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                같은 취향의 사용자들이 좋아하는 웹툰을 보여줍니다.
              </div>
            </div>
            
            <div className="flex items-center group relative">
              <Checkbox
                id={styleId}
                checked={filter.use_art_style}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('use_art_style', checked === true)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={styleId}
                className="ml-2 text-xs cursor-pointer"
              >
                유사 그림체
              </Label>
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                비슷한 그림체와 아트 스타일의 웹툰을 보여줍니다.
              </div>
            </div>

            <div className="flex items-center group relative">
              <Checkbox
                id={featuresId}
                checked={filter.use_tags}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('use_tags', checked === true)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={featuresId}
                className="ml-2 text-xs cursor-pointer"
              >
                유사 특징
              </Label>
              <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                스토리 전개, 등장인물 유형 등 콘텐츠 특징이 비슷한 웹툰을 보여줍니다.
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs h-8 px-2"
          >
            필터 초기화
          </Button>
        </div>
      </div>
    </div>
  );
});

// 웹툰 추천 페이지
const WebtoonRecommendations: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { recommendations, isLoading, error, fetchRecommendWebtoons } = useWebtoonStore();
  const forceUpdateKey = useRef(0);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage] = useState<number>(20);
  
  const [activeFilterOptions, setActiveFilterOptions] = useState<FilterOptions>({
    sortBy: 'similarity',
    genre: [],
    use_popularity: true,
    use_art_style: true,
    use_tags: true,
  });
  
  const [filteredWebtoons, setFilteredWebtoons] = useState<WebtoonInfo[]>([]);
  const [subNavPortalTarget, setSubNavPortalTarget] = useState<HTMLElement | null>(null);

  // 필터 적용
  const applyFilters = useCallback((data: WebtoonInfo[], options: FilterOptions) => {
    if (!data || data.length === 0) return [];
    
    let filtered = [...data];
    
    if (options.genre.length > 0) {
      filtered = filtered.filter(webtoon => {
        const rankGenres = webtoon.rankGenreTypes || [];
        const koreanGenres = rankGenres.map(g => GENRE_MAPPING[g as GenreType] || g);
        return options.genre.some(genreOption => 
          koreanGenres.some(kg => kg === genreOption)
        );
      });
    }
    
    filtered.sort((a, b) => {
      if (options.sortBy === 'rating') {
        return b.starScore - a.starScore;
      } else if (options.sortBy === 'similarity') {
        const simA = a.sim ?? 0;
        const simB = b.sim ?? 0;
        return simB - simA;
      }
      return 0;
    });
    
    return filtered;
  }, []);
  
  const handleFilterChange = useCallback((options: FilterOptions) => {
    setActiveFilterOptions(options);
    
    if (recommendations.length > 0) {
      const newFiltered = applyFilters(recommendations, options);
      setFilteredWebtoons(newFiltered);
      setCurrentPage(0);
      forceUpdateKey.current++;
    }
  }, [recommendations, applyFilters]);

  const resetFilters = useCallback(() => {
    const resetOptions = {
      sortBy: 'similarity' as const,
      genre: [],
      use_popularity: true,
      use_art_style: true,
      use_tags: true,
    };
    
    setActiveFilterOptions(resetOptions);
    
    if (recommendations && recommendations.length > 0) {
      const filtered = applyFilters(recommendations, resetOptions);
      setFilteredWebtoons(filtered);
      setCurrentPage(0);
      forceUpdateKey.current++;
    }
  }, [recommendations, applyFilters, setActiveFilterOptions, setFilteredWebtoons, setCurrentPage]);
    
  const allGenres = Object.values(GENRE_MAPPING);
    
  // 서브네비게이션 설정
  useEffect(() => {
    const subNavPlaceholder = document.getElementById('sub-nav-placeholder');
    if (subNavPlaceholder) {
      setSubNavPortalTarget(subNavPlaceholder);
    }
  }, [location.pathname]);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialRecommendations = async () => {
      const requestData: RecommendationRequest = {
        use_popularity: true,
        use_art_style: true,
        use_tags: true
      };

      try {
        await fetchRecommendWebtoons(requestData);
      } catch (fetchError) {
        console.error('fetchRecommendWebtoons 오류:', fetchError);
      }
    };

    loadInitialRecommendations();
  }, [fetchRecommendWebtoons]);

  const filterChangeCountRef = useRef(0);
  const isFirstRenderRef = useRef(true);
  
  // 필터 변경 시 새 데이터 요청
  useEffect(() => {
    const loadFilteredRecommendations = async () => {
      filterChangeCountRef.current += 1;
      const currentFilterChange = filterChangeCountRef.current;
      
      const requestData: RecommendationRequest = {
        use_popularity: activeFilterOptions.use_popularity,
        use_art_style: activeFilterOptions.use_art_style,
        use_tags: activeFilterOptions.use_tags
      };
      
      const allFiltersOff = !requestData.use_popularity && !requestData.use_art_style && !requestData.use_tags;
      
      if (allFiltersOff) {
        setFilteredWebtoons([]);
        return;
      }
      
      try {
        await fetchRecommendWebtoons(requestData);
        
        if (currentFilterChange !== filterChangeCountRef.current) {
          return;
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      }
    };
    
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    
    loadFilteredRecommendations();
    
  }, [activeFilterOptions.use_popularity, activeFilterOptions.use_art_style, activeFilterOptions.use_tags, fetchRecommendWebtoons, setFilteredWebtoons]);

  const areAllFiltersOff = useCallback(() => {
    return !activeFilterOptions.use_popularity && 
           !activeFilterOptions.use_art_style && 
           !activeFilterOptions.use_tags;
  }, [activeFilterOptions.use_popularity, activeFilterOptions.use_art_style, activeFilterOptions.use_tags]);

  // 추천 데이터 필터링
  useEffect(() => {
    if (recommendations.length > 0) {
      if (areAllFiltersOff()) {
        setFilteredWebtoons([]);
        return;
      }
      
      const filtered = applyFilters(recommendations, activeFilterOptions);
      setFilteredWebtoons(filtered);
      forceUpdateKey.current++;
    }
  }, [recommendations, activeFilterOptions, applyFilters, areAllFiltersOff]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (filteredWebtoons.length > 0) {
      const filteredTotalPages = Math.ceil(filteredWebtoons.length / itemsPerPage);
      if (currentPage >= filteredTotalPages) {
        setCurrentPage(0);
      }
    }
  }, [filteredWebtoons.length, currentPage, itemsPerPage]);
  
  // 페이지네이션
  const Pagination = () => {
    if (filteredWebtoons.length === 0) return null;
    
    const filteredTotalPages = Math.ceil(filteredWebtoons.length / itemsPerPage);
    
    const pageRange = 5;
    const startPage = Math.max(0, Math.min(currentPage - Math.floor(pageRange / 2), filteredTotalPages - pageRange));
    const endPage = Math.min(startPage + pageRange, filteredTotalPages);
    
    return (
      <div className="flex items-center justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(0)} 
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded ${currentPage === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
        >
          &laquo;
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 0}
          className={`px-3 py-1 rounded ${currentPage === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
        >
          &lt;
        </button>
        {Array.from({ length: endPage - startPage }, (_, i) => i + startPage).map(page => (
          <button 
            key={`page-${page}-${forceUpdateKey.current}`} 
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage >= filteredTotalPages - 1}
          className={`px-3 py-1 rounded ${currentPage >= filteredTotalPages - 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
        >
          &gt;
        </button>
        <button
          onClick={() => handlePageChange(filteredTotalPages - 1)} 
          disabled={currentPage >= filteredTotalPages - 1}
          className={`px-3 py-1 rounded ${currentPage >= filteredTotalPages - 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
        >
          &raquo;
        </button>
      </div>
    );
  };

  const sectionId = getSectionId("/1");
  
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageWebtoons = filteredWebtoons.slice(startIndex, endIndex);

  return (
      <div className="container pt-45 py-8" id={sectionId}>
        <h1 className="text-2xl font-bold mb-6">AI 취향 분석</h1>
        
        {subNavPortalTarget && createPortal(
            <TasteAnalysisFilter 
              onFilterChange={handleFilterChange}
              genres={allGenres}
              initialFilter={activeFilterOptions}
              key="taste-analysis-filter"
            />,
          subNavPortalTarget
        )}
        
        <div className="text-sm text-gray-600 mb-4">
          {!areAllFiltersOff() && !isLoading && filteredWebtoons.length > 0 && (
            <div>
              전체 {recommendations.length}개 중 {filteredWebtoons.length}개의 웹툰 ({currentPage + 1} / {Math.max(1, Math.ceil(filteredWebtoons.length / itemsPerPage))} 페이지)
            </div>
          )}
        </div>
        
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 mt-20 mb-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
            <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center my-8">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중 오류가 발생했습니다</p>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button 
              onClick={() => {
                const requestData: RecommendationRequest = {
                  use_popularity: activeFilterOptions.use_popularity,
                  use_art_style: activeFilterOptions.use_art_style,
                  use_tags: activeFilterOptions.use_tags
                };
                fetchRecommendWebtoons(requestData);
              }}
              className="mt-4"
            >
              다시 시도
            </Button>
          </div>
        ) : areAllFiltersOff() ? (
          <div className="p-8 text-center my-8">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">불러올 데이터가 없습니다</h3>
            <p className="text-gray-600 mb-4">최소한 하나 이상의 유사도 필터를 선택해주세요.</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        ) : filteredWebtoons.length === 0 ? (
          <div className="p-8 text-center my-8">
            <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">조건에 맞는 웹툰이 없습니다</h3>
            <p className="text-gray-600 mb-4">필터 조건을 변경하거나 다른 검색어를 사용해보세요.</p>
            <button 
              onClick={resetFilters}
              className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <>
            <div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 mt-8" 
              key={`grid-${forceUpdateKey.current}`}
            >
              {currentPageWebtoons.map((webtoon, index) => (
                <div 
                  key={`webtoon-${webtoon.id}-${index}-${forceUpdateKey.current}`} 
                  className="flex flex-col h-full"
                >
                  <WebtoonCard 
                    webtoon={webtoon}
                    size={'sm'}
                    showTitle={true}
                    showBadges={true}
                    showGenre={true}
                    showActionButtons={isAuthenticated}
                    countType={null}
                    aiPercent={webtoon.sim}
                    showAI={true}
                  />
                </div>
              ))}
            </div>
            
            <Pagination />
          </>
        )}
      </div>
  );
};

export default WebtoonRecommendations;