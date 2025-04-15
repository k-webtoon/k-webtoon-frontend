import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/entities/webtoon-search/api/store.ts";
import { searchWebtoons, searchWebtoons_Tags, searchWebtoons_Author } from "@/entities/webtoon/api/api.ts";
import { WebtoonInfo, WebtoonPaginatedResponse } from "@/entities/webtoon/model/types.ts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
  className?: string;
  dataSource?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                isMobile = false,
                                                onClose,
                                                className = "",
                                                dataSource = "header",
                                              }) => {
  const [query, setQuery] = useState("");
  const { results, setResults } = useSearchStore();
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState("default");
  const navigate = useNavigate();
  const location = useLocation();

  const emptyResults: WebtoonPaginatedResponse = { content: [] };

  useEffect(() => {
    setQuery("");
    setShowResults(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(emptyResults);
      setShowResults(false);
      return;
    }

    const fetchData = async () => {
      try {
        let data;
        switch (searchType) {
          case "$":
            data = await searchWebtoons_Tags(query);
            break;
          case "~":
            data = await searchWebtoons_Author(query);
            break;
          case "!":
          case "default":
          default:
            data = await searchWebtoons(query);
        }
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("웹툰 검색 중 오류 발생:", error);
        setResults(emptyResults);
        setShowResults(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, setResults, searchType]);

  // 입력 필드에 포커스가 있을 때 검색 결과 표시
  const handleFocus = () => {
    if (query.trim() !== "" && results.content.length > 0) { // content 배열 접근
      setShowResults(true);
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/webtoon/${id}`);
    setShowResults(false);
    // 검색 결과 클릭 시 query 초기화
    setQuery("");
  };

  // 엔터 키를 누를 때 검색 페이지로 이동
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setShowResults(false);
      if (onClose) onClose();
    }
  };

  // 검색 버튼 클릭 시 검색 페이지로 이동
  const handleSearchClick = () => {
    if (query.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setShowResults(false);
      // 페이지 이동 시 query 값을 초기화하지 않음 (검색 페이지에서는 유지)
      if (onClose) onClose();
    }
  };

  if (isMobile && !onClose) {
    console.warn("모바일 모드에서는 onClose 함수가 필요합니다.");
  }

  const searchOptions = [
    { value: "!", label: "제목 검색" },
    { value: "$", label: "태그 검색" },
    { value: "~", label: "작가 검색" },
  ];

  return (
    <div className={className}>
      <div className="bg-white pb-2 pt-3 relative flex items-center gap-2 border border-gray-300 rounded-full overflow-hidden px-3 py-0.5 w-full">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="rounded-full text-sm px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 min-w-[100px]">
              {searchType === "default" ? (
                <span className="text-gray-400">검색 유형</span>
              ) : (
                searchOptions.find(o => o.value === searchType)?.label
              )}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 border border-gray-200 z-50">
            {searchOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                className="text-sm text-gray-800 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                onSelect={() => setSearchType(option.value)}
              >
                {option.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="웹툰 제목 또는 작가를 검색하세요..."
          data-source={dataSource} // 👈 이게 핵심!
          className="w-full border-none focus:border-gray-300 rounded-l-full px-4 py-2 focus-visible:ring-2 focus-visible:ring-blue-500"
          autoFocus={isMobile}
        />

        <div className="absolute right-3 top-5.5 h-4 w-4 text-gray-400 cursor-pointer" onClick={handleSearchClick}>
          <Search className="h-4 w-4" />
        </div>

        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 검색 결과 */}
      {showResults && results.content.length > 0 && (
              <div className={`relative ${isMobile ? "mt-2 z-50" : ""}`}>
                <ul
                    className={`${
                        isMobile ? "fixed inset-x-0 mx-4" : "absolute z-10 w-full"
                    } bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1`}
                >
                  {results.content.map((item: WebtoonInfo) => (
                      <li
                          key={item.id}
                          className="flex items-center p-2 hover:bg-gray-100 transition duration-150 cursor-pointer"
                          onClick={() => handleResultClick(item.id.toString())}
                      >
                        <img
                            src={item.thumbnailUrl}
                            alt={item.titleName}
                            className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div className="flex flex-col">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            {item.titleName}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {item.author}
                          </div>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>
          )}
        </div>
  );
};


export default SearchBar;
