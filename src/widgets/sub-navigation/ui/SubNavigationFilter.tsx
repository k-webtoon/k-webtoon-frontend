import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
import { Label } from '@/shared/ui/shadcn/label';
import { Button } from '@/shared/ui/shadcn/button';
import { useParams } from 'react-router-dom';

interface FilterOptions {
  sortBy: 'latest' | 'popularity' | 'rating';
  genre: string[];
  onlyCompleted: boolean;
  excludeAdult: boolean;
}

interface SubNavigationFilterProps {
  onFilterChange: (options: FilterOptions) => void;
  genres: string[];
  initialFilter?: FilterOptions;
}

const SubNavigationFilter: React.FC<SubNavigationFilterProps> = memo(({
  onFilterChange,
  genres,
  initialFilter
}) => {
  const { category } = useParams<{ category: string }>();
  const didInitRef = useRef(false);
  
  const defaultFilter: FilterOptions = {
    sortBy: 'popularity',
    genre: [],
    onlyCompleted: false,
    excludeAdult: true,
  };
  
  const [filter, setFilter] = useState<FilterOptions>(
    initialFilter || defaultFilter
  );

  const initialGenre = initialFilter?.genre?.length ? initialFilter.genre[0] as string : null;
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);

  useEffect(() => {
    setFilter(initialFilter || defaultFilter);
    setActiveGenre(initialFilter?.genre?.length ? initialFilter.genre[0] as string : null);
  }, [initialFilter]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      onFilterChange(filter);
    }
  }, [filter, onFilterChange]);

  const handleGenreClick = useCallback((genre: string) => {
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
      sortBy: value as 'latest' | 'popularity' | 'rating'
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  }, [filter, onFilterChange]);

  const handleCheckboxChange = useCallback((key: 'onlyCompleted' | 'excludeAdult', checked: boolean) => {
    const newFilter = {
      ...filter,
      [key]: checked
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  }, [filter, onFilterChange]);

  const resetFilters = useCallback(() => {
    setActiveGenre(null);
    const resetFilter = {
      sortBy: 'popularity',
      genre: [],
      onlyCompleted: false,
      excludeAdult: true,
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  }, [onFilterChange]);

  const completedId = `completed-${category || ''}`;
  const adultId = `adult-${category || ''}`;

  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-screen-xl mx-auto">
        {/* 장르 필터 - 첫 번째 줄 */}
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

        {/* 추가 필터 옵션 - 두 번째 줄 */}
        <div className="flex items-center justify-between py-2 px-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button 
                onClick={() => handleSortChange('popularity')} 
                className={`text-xs px-2 py-1 rounded ${filter.sortBy === 'popularity' ? 'bg-gray-200 font-bold' : 'bg-gray-100'}`}
              >
                인기순
              </button>
              <button 
                onClick={() => handleSortChange('rating')} 
                className={`text-xs px-2 py-1 rounded ${filter.sortBy === 'rating' ? 'bg-gray-200 font-bold' : 'bg-gray-100'}`}
              >
                평점순
              </button>
            </div>
            
            <div className="flex items-center">
              <Checkbox
                id={completedId}
                checked={filter.onlyCompleted}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('onlyCompleted', checked === true)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={completedId}
                className="ml-2 text-xs cursor-pointer"
              >
                완결작만
              </Label>
            </div>
            
            <div className="flex items-center">
              <Checkbox
                id={adultId}
                checked={filter.excludeAdult}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('excludeAdult', checked === true)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={adultId}
                className="ml-2 text-xs cursor-pointer"
              >
                성인물 제외
              </Label>
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

export default SubNavigationFilter;