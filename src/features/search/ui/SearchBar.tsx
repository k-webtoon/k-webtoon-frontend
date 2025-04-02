import React, { useState, useEffect } from "react";
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/entities/search/model/searchStore.ts";
import { WebtoonInfo } from "@/entities/webtoon/model/types.ts";
import { searchWebtoons } from "@/app/api/webtoonsApi.ts";

interface SearchBarProps {
    isMobile?: boolean;
    onClose?: () => void;
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
                                                 isMobile = false,
                                                 onClose,
                                                 className = "",
                                             }) => {
    const [query, setQuery] = useState("");
    const { results, setResults } = useSearchStore();
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            setShowResults(false);
            return;
        }

        const fetchData = async () => {
            try {
                const data = await searchWebtoons(query);
                setResults(data);
                // 결과가 있을 때 showResults를 true로 설정
                setShowResults(true);
            } catch (error) {
                console.error("웹툰 검색 중 오류 발생:", error);
                setResults([]);
                setShowResults(false);
            }
        };

        const debounceTimer = setTimeout(fetchData, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, setResults]);

    // 입력 필드에 포커스가 있을 때 검색 결과 표시
    const handleFocus = () => {
        if (query.trim() !== "" && results.length > 0) {
            setShowResults(true);
        }
    };

    if (isMobile && !onClose) {
        console.warn("모바일 모드에서는 onClose 함수가 필요합니다.");
    }

    return (
        <div className={`${className}`}>
            <div className="bg-white pb-2 pt-3">
                <div className="relative">
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={handleFocus}
                        placeholder="웹툰 제목 또는 작가를 검색하세요..."
                        className="w-full border-gray-200 focus:border-gray-300 rounded-full pl-10 pr-4 h-10 focus-visible:ring-gray-200"
                        autoFocus={isMobile}
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

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
                {showResults && results.length > 0 && (
                    <div className={`relative ${isMobile ? "mt-2 z-50" : ""}`}>
                        <ul className={`${isMobile ? "fixed inset-x-0 mx-4" : "absolute z-10 w-full"} bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1`}>
                            {results.map((item: WebtoonInfo) => (
                                <li
                                    key={item.id}
                                    className="flex items-center p-2 hover:bg-gray-100 transition duration-150 cursor-pointer"
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
        </div>
    );
};

export default SearchBar;