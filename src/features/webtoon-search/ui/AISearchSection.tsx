import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";

interface AISearchSectionProps {
    title?: string;
    subtitle?: string;
}

const AISearchSection: React.FC<AISearchSectionProps> = ({
                                                             title = "AI 기반 맞춤 웹툰 추천",
                                                             subtitle = "좋아하는 웹툰과 비슷한 작품을 찾고 싶으신가요?"
                                                         }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for:", query);
        // 실제 검색 로직 추가
    };

    return (
        <Card className="w-full border border-gray-200 bg-gray-50">
            <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{subtitle}</p>

                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-grow">
                        <Input
                            type="text"
                            placeholder="키워드, 장면, 대사를 입력하시면 AI가 검색해 드립니다."
                            className="h-12 pl-4 pr-10 rounded-full border-gray-200 w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>

                    <div className="flex space-x-3">
                        {/*<Button*/}
                        {/*    type="submit"*/}
                        {/*    className="h-12 px-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-800"*/}
                        {/*>*/}
                        {/*    AI 검색*/}
                        {/*</Button>*/}

                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 px-6 rounded-full border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-50"
                            onClick={() => console.log("AI 추천 요청")}
                        >
                            AI 검색
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AISearchSection;
