import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";
import { logTyping } from "@/shared/logging/log";
import { useTextBasedRecommendationStore } from "@/entities/webtoon-search-ai/api/store.ts";

interface TextSearchSectionProps {
    title?: string;
    subtitle?: string;
    dataSource?: string; // 👈 추가!
}


const WebtoonTextSearchForm: React.FC<TextSearchSectionProps> = ({
                                                                     title = "AI 기반 맞춤 웹툰 추천",
                                                                     subtitle = "좋아하는 웹툰과 비슷한 작품을 찾고 싶으신가요?",
                                                                     dataSource = "ai" // 👈 기본값
                                                                 }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement>(null);

    const { setSearchOptions } = useTextBasedRecommendationStore();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlQuery = queryParams.get('query');

        if (urlQuery) {
            setQuery(decodeURIComponent(urlQuery));
        }
    }, [location.search]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) return;

        // 기본 검색 옵션 설정
        setSearchOptions({
            filterThreshold: 0.3,
            limit: 20,
            includeDetails: true
        });

        try {
            const encodedQuery = encodeURIComponent(query);

            navigate(`/text-based-recommendations?query=${encodedQuery}`);
        } catch (error) {
            console.error('검색 처리 중 오류 발생:', error);
        }
    };

    return (
        <Card className="w-full border border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
            <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full opacity-20 -mt-20 -mr-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full opacity-20 -mb-16 -ml-16"></div>

                <div className="relative z-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-gray-600 mb-6">{subtitle}</p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-grow">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="키워드, 장면, 대사를 입력하시면 텍스트 기반으로 검색해 드립니다."
                                className="h-12 pl-4 pr-10 rounded-full border-gray-200 w-full bg-white bg-opacity-70"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                data-source={dataSource} // 👈 여기에 사용
                            />
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 px-6 rounded-full border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 bg-white bg-opacity-70 font-medium"
                                onClick={(e) => {
                                    const keyword = inputRef.current?.value.trim();
                                    const source = inputRef.current?.getAttribute("data-source");

                                    if (keyword && source) logTyping(keyword, source);
                                    handleSearch(e);
                                }} >
                                AI 검색
                            </Button>
                        </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};

export default WebtoonTextSearchForm;