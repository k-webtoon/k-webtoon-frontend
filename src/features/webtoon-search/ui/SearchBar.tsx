import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/shared/ui/shadcn/input";
import { Button } from "@/shared/ui/shadcn/button";
import { Search, X } from "lucide-react";
import { searchWebtoons, searchWebtoons_Tags, searchWebtoons_Author } from "@/entities/webtoon/api/api";
import { WebtoonInfo } from "@/entities/webtoon/model/types";
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
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState("default");
  const navigate = useNavigate();
  const location = useLocation();
  
  // 드롭다운에 표시하기 위한 로컬 검색 결과 추가
  const [localResults, setLocalResults] = useState<WebtoonInfo[]>([]);

  useEffect(() => {
    setQuery("");
    setShowResults(false);
  }, [location.pathname]);
  
  // 드롭다운을 위한 로컬 검색 함수
  const fetchDropdownResults = async (searchQuery: string, type: string) => {
    if (!searchQuery.trim()) {
      setLocalResults([]);
      setShowResults(false);
      return;
    }

    console.log("드롭다운 검색 실행:", searchQuery, "유형:", type);

    try {
      let data;
      switch (type) {
        case "$":
          data = await searchWebtoons_Tags(searchQuery);
          break;
        case "~":
          data = await searchWebtoons_Author(searchQuery);
          break;
        case "!":
        case "default":
        default:
          data = await searchWebtoons(searchQuery);
      }
      
      // 로컬 상태에만 저장
      setLocalResults(data.content || []);
      setShowResults(true);
    } catch (error) {
      console.error("웹툰 검색 중 오류 발생:", error);
      setLocalResults([]);
      setShowResults(false);
    }
  };
  
  // 전체 검색 페이지를 위한 검색 함수
  const fetchPageSearchResults = async (searchQuery: string) => {
    console.log("검색 페이지로 이동:", searchQuery);
  };

  useEffect(() => {
    if (!query.trim()) {
      setLocalResults([]);
      setShowResults(false);
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchDropdownResults(query, searchType);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [query, searchType]);

  // 검색 유형 변경 핸들러
  const handleSearchTypeChange = (type: string) => {
    console.log("검색 유형 변경:", type); 
    setSearchType(type);
  };

  // 입력 필드에 포커스가 있을 때 검색 결과 표시
  const handleFocus = () => {
    if (query.trim() !== "" && localResults.length > 0) {
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
      console.log("엔터 키 검색:", query);
      console.log("검색 유형:", searchType);
      
      let searchQuery = query;
      if (searchType !== "default") {
        searchQuery = searchType + query;
      }
      
      fetchPageSearchResults(searchQuery);
      
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      
      if (onClose) onClose();
    }
  };

  // 검색 버튼 클릭 시 검색 페이지로 이동
  const handleSearchClick = () => {
    if (query.trim() !== '') {
      console.log("검색 버튼 클릭:", query);
      console.log("검색 유형:", searchType);
      
      let searchQuery = query;
      if (searchType !== "default") {
        searchQuery = searchType + query;
      }
      
      fetchPageSearchResults(searchQuery);
      
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      
      if (onClose) onClose();
    }
  };

  // 검색어 강조 표시 함수
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? 
            <span key={i} className="bg-green-200 text-green-800">{part}</span> : 
            part
        )}
      </>
    );
  };
  
  if (isMobile && !onClose) {
    console.warn("모바일 모드에서는 onClose 함수가 필요합니다.");
  }

  const searchOptions = [
    { value: "default", label: "제목 검색" },
    { value: "$", label: "태그 검색" },
    { value: "~", label: "작가 검색" },
  ];

  return (
    <div className={`${className} ${isMobile ? "" : "w-72 md:w-80 lg:w-96"}`}>
      <div className="bg-white shadow-sm hover:shadow transition-shadow duration-300 relative flex items-center gap-1 border border-gray-200 rounded-full overflow-hidden px-2 py-1 w-full">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button className="rounded-full text-sm px-2 py-1 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 min-w-[90px] h-8">
              {searchOptions.find(o => o.value === searchType)?.label || "검색 유형"}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 border border-gray-200 z-50">
            {searchOptions.map((option) => (
              <DropdownMenu.Item
                key={option.value}
                className="text-sm text-gray-800 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                onSelect={() => handleSearchTypeChange(option.value)}
              >
                {option.label}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <Input
          type="text"
          value={query}
          onChange={(e) => {
            // 입력값 그대로 설정 (첫 글자 유지)
            const inputValue = e.target.value;
            console.log("입력값:", inputValue);
            setQuery(inputValue);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="웹툰 제목 또는 작가를 검색하세요..."
          data-source={dataSource}
          className="w-full border-none focus:border-0 focus:outline-none shadow-none focus-visible:ring-0 rounded-full px-3 py-1 h-8 text-sm"
          autoFocus={isMobile}
        />

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4" />
        </Button>

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

      {/* 검색 결과 드롭다운 - 로컬 상태 사용 */}
      {showResults && localResults.length > 0 && (
        <div className={`relative ${isMobile ? "mt-2 z-50" : ""}`}>
          <ul
            className={`${
              isMobile ? "fixed inset-x-0 mx-4" : "absolute z-10 w-full"
            } bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-1`}
          >
            {localResults.map((item: WebtoonInfo) => (
              <li
                key={item.id}
                className="flex items-center p-2 hover:bg-gray-50 transition duration-150 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleResultClick(item.id.toString())}
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.titleName}
                  className="w-10 h-12 object-cover rounded-md mr-3"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {highlightMatch(item.titleName, query)}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {highlightMatch(item.author, query)}
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