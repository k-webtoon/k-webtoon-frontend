import React, { useState, useEffect } from "react";
import { useSearchStore, Webtoon } from "@/shared/store/searchStore.ts";
import { searchWebtoons } from "@/app/api/webtoonsApi.ts";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/shadcn/input";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { results, setResults } = useSearchStore();

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      const data = await searchWebtoons(query);
      setResults(data);
    };

    fetchData();
  }, [query, setResults]);

  return (
    <div className="relative max-w-lg mx-auto p-4">
      {/* 검색 입력창 */}
      <div className="relative">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="웹툰 제목을 검색하세요..."
          className="w-64 border-gray-200 focus:border-gray-300 rounded-full pl-10 pr-4 h-10 focus-visible:ring-gray-200 transition-all"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>

      {/* 검색 결과 */}
      {results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((item: Webtoon) => (
            <li
              key={item.id}
              className="flex items-center p-2 hover:bg-gray-100 transition duration-150 cursor-pointer"
            >
              <img
                src={item.thumbnailUrl}
                alt={item.titleName}
                className="w-12 h-12 object-cover rounded-md mr-3"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {item.titleName}
                </div>
                <div className="text-xs text-gray-600">{item.author}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
