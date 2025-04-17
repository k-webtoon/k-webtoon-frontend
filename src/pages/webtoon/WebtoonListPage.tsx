import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {WebtoonInfo, GENRE_MAPPING, GenreType, KoreanGenreType} from '@/entities/webtoon/model/types';
import WebtoonCard from '@/entities/webtoon/ui/WebtoonCard';
import SubNavigationFilter from '@/widgets/sub-navigation/ui/SubNavigationFilter';
import { createPortal } from 'react-dom';
import { getSectionId } from '@/shared/config/navigation';
import { topWebtoons, getPopularByFavorites, getPopularByLikes, getPopularByWatched } from '@/entities/webtoon/api/api';
import { useAuthStore } from '@/entities/auth/api/store';

interface FilterOptions {
  sortBy: 'latest' | 'popularity' | 'rating';
  genre: string[];
  onlyCompleted: boolean;
  excludeAdult: boolean;
}

const WebtoonListPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const title = state?.title || "웹툰 목록";
  const { isAuthenticated } = useAuthStore();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [activeFilterOptions, setActiveFilterOptions] = useState<FilterOptions>({
    sortBy: 'popularity',
    genre: [],
    onlyCompleted: false,
    excludeAdult: true,
  });
  
  const [allWebtoonData, setAllWebtoonData] = useState<(WebtoonInfo)[]>([]);
  const [filteredWebtoons, setFilteredWebtoons] = useState<(WebtoonInfo)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [subNavPortalTarget, setSubNavPortalTarget] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    if (location.pathname === '/webtoon/list') {
      navigate('/webtoon/list/top', { replace: true });
    }
  }, [location.pathname, navigate]);

  // 장르 리스트 추출
  const allGenres = Object.values(GENRE_MAPPING)
    .filter((value, index, self) => 
      self.indexOf(value) === index
    );

  useEffect(() => {
    const subNavPlaceholder = document.getElementById('sub-nav-placeholder');
    if (subNavPlaceholder) {
      setSubNavPortalTarget(subNavPlaceholder);
    }
  }, []);
  
  // 필터링 함수
  const applyFilters = useCallback((data: (WebtoonInfo)[], options: FilterOptions) => {
    if (!data.length) return;
    
    let filtered = [...data];
    
    if (options.genre.length > 0) {
      filtered = filtered.filter(webtoon => {
        const koreanGenres = webtoon.rankGenreTypes?.map(g => GENRE_MAPPING[g as GenreType]) || [];
        
        return options.genre.some(genre => koreanGenres.includes(genre as KoreanGenreType));
      });
    }
    
    // 완결작 필터링
    if (options.onlyCompleted) {
      filtered = filtered.filter(webtoon => webtoon.finish);
    }
    
    // 성인물 제외
    if (options.excludeAdult) {
      filtered = filtered.filter(webtoon => !webtoon.adult);
    }
    
    // 정렬
    filtered.sort((a, b) => {
      const getStarScore = (webtoon: WebtoonInfo): number => {
        return typeof webtoon.starScore === 'string' 
          ? parseFloat(webtoon.starScore) 
          : (webtoon.starScore || 0);
      };
      
      const getTotalCount = (webtoon: WebtoonInfo): number => {
        return webtoon.totalCount || 0;
      };
      
      if (options.sortBy === 'rating') {
        return getStarScore(b) - getStarScore(a);
      } else if (options.sortBy === 'popularity') {
        return getTotalCount(b) - getTotalCount(a);
      }
      return 0;
    });
    
    setFilteredWebtoons(filtered);
    
    setCurrentPage(0);
  }, []);
  
  // 필터 적용 콜백
  const handleFilterChange = useCallback((options: FilterOptions) => {
    if (allWebtoonData.length === 0) return;
    
    setActiveFilterOptions(options);
    
    applyFilters(allWebtoonData, options);
  }, [allWebtoonData, applyFilters]);

  // 카테고리에 따라 모든 웹툰 데이터 로드
  useEffect(() => {
    setActiveFilterOptions({
      sortBy: 'popularity',
      genre: [],
      onlyCompleted: false,
      excludeAdult: true,
    });
    
    setCurrentPage(0);
    
    const loadAllData = async () => {
      setLoading(true);
      
      try {
        let data: (WebtoonInfo)[] = [];
        let totalItemsCount = 0;
        
        switch(category) {
          case 'top': {
            const topResult = await topWebtoons(0, 2000);
            data = topResult.content || [];
            totalItemsCount = topResult.totalElements || data.length;
            break;
          }
          case 'favorites': {
            const favoritesResult = await getPopularByFavorites(2000);
            data = favoritesResult || [];
            totalItemsCount = data.length;
            break;
          }
          case 'likes': {
            const likesResult = await getPopularByLikes(2000);
            data = likesResult || [];
            totalItemsCount = data.length;
            break;
          }
          case 'watched': {
            const watchedResult = await getPopularByWatched(2000);
            data = watchedResult || [];
            totalItemsCount = data.length;
            break;
          }
          default:
            if (!category) {
              navigate('/webtoon/list/top', { replace: true });
              return;
            }
            break;
        }
        
        setAllWebtoonData(data);
        setTotalItems(totalItemsCount);
        
        // 초기화된 필터 적용
        setFilteredWebtoons(data);
      } catch (error) {
        console.error('데이터 로드 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [category, itemsPerPage, navigate]);

  const handlePageChange = (newPage: number) => {
    console.log(`페이지 변경: ${currentPage} -> ${newPage}`);
    setCurrentPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    if (filteredWebtoons.length === 0) return null;
    
    const filteredTotalPages = Math.ceil(filteredWebtoons.length / itemsPerPage);
    
    const pageRange = 5;
    const startPage = Math.max(0, Math.min(currentPage - Math.floor(pageRange / 2), filteredTotalPages - pageRange));
    const endPage = Math.min(startPage + pageRange, filteredTotalPages);
    
    if (currentPage >= filteredTotalPages && filteredTotalPages > 0) {
      setCurrentPage(0);
    }
    
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
            key={page} 
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

  const sectionId = category ? getSectionId(`/${category === 'top' ? '2' : category === 'likes' ? '3' : category === 'favorites' ? '5' : category === 'watched' ? '4' : '1'}`) : '';
  
  if (loading) {
    return <div className="container pt-45 py-8 text-center">데이터를 불러오는 중입니다...</div>;
  }
  
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageWebtoons = filteredWebtoons.slice(startIndex, endIndex);
  
  console.log(`현재 페이지: ${currentPage}, 표시할 웹툰: ${startIndex} ~ ${endIndex-1}, 총 ${filteredWebtoons.length}개 중`);
  
  return (
    <div className="container pt-45 py-8" id={sectionId}>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {subNavPortalTarget && createPortal(
        <SubNavigationFilter 
          onFilterChange={handleFilterChange}
          genres={allGenres as string[]}
          initialFilter={activeFilterOptions}
          key={category}
        />,
        subNavPortalTarget
      )}
      
      <div className="text-sm text-gray-600 mb-4">
        전체 {totalItems}개 중 {filteredWebtoons.length}개의 웹툰 ({currentPage + 1} / {Math.max(1, Math.ceil(filteredWebtoons.length / itemsPerPage))} 페이지)
      </div>
      
      {currentPageWebtoons.length === 0 ? (
        <div className="text-center py-8">
          조건에 맞는 웹툰이 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 mt-8">
            {currentPageWebtoons.map((webtoon) => (
              <div key={String('webtoonId' in webtoon ? webtoon.webtoonId : webtoon.id)} className="flex flex-col h-full">
                <WebtoonCard 
                  webtoon={webtoon}
                  size={'sm'}
                  showTitle={true}
                  showBadges={true}
                  showGenre={true}
                  showActionButtons={isAuthenticated}
                  countType={category === 'likes' ? 'likes' : category === 'favorites' ? 'favorites' : category === 'watched' ? 'watched' : null}
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

export default WebtoonListPage;