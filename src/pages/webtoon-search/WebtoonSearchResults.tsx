import { WebtoonInfo, WebtoonPaginatedResponse } from "@/entities/webtoon/model/types.ts"
import { useSearchStore } from "@/entities/webtoon-search/api/store.ts"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { searchWebtoons } from "@/entities/webtoon/api/api.ts"
import { HorizontalWebtoonCard } from "@/entities/webtoon/ui/HorizontalWebtoonCard.tsx";

export default function WebtoonSearchResults() {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const searchQuery = searchParams.get("query") || ""

    const { results, setResults } = useSearchStore()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (searchQuery) {
            setIsLoading(true)

            const fetchSearchResults = async () => {
                try {
                    const data: WebtoonPaginatedResponse = await searchWebtoons(searchQuery)
                    setResults(data)
                } catch (error) {
                    console.error("웹툰 검색 중 오류 발생:", error)
                    // 빈 결과 객체 생성
                    const emptyResults: WebtoonPaginatedResponse = { content: [] }
                    setResults(emptyResults)
                } finally {
                    setIsLoading(false)
                }
            }

            fetchSearchResults()
        }
    }, [searchQuery, setResults])

    return (
        <div className="min-h-screen pt-20 pb-10">
            {/* 검색 결과 */}
            <div className="flex flex-col items-start mb-6">
                <h1 className="text-xl font-bold">
                    <span className="text-green-500">'{searchQuery}'</span> 에 대한 검색결과 입니다.
                </h1>
                <h2 className="text-lg font-medium mt-2">
                    웹툰 <span className="text-sm text-gray-500">총 {results.content.length}</span>
                </h2>
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : results.content.length > 0 ? (
                    <div className="space-y-6">
                        {results.content.map((webtoon: WebtoonInfo) => (
                            <HorizontalWebtoonCard key={webtoon.id} webtoon={webtoon} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        '{searchQuery}'에 대한 검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}