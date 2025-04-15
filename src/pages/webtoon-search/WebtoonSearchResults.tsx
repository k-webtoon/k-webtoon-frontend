import { WebtoonInfo, WebtoonPaginatedResponse } from "@/entities/webtoon/model/types.ts"
import { useSearchStore } from "@/entities/webtoon-search/api/store.ts"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { searchWebtoons, searchWebtoons_Tags, searchWebtoons_Author, topWebtoons, getWebtoonById } from "@/entities/webtoon/api/api.ts"
import { HorizontalWebtoonCard } from "@/entities/webtoon/ui/HorizontalWebtoonCard.tsx"

const searchTypeHandlers = {
  "$": searchWebtoons_Tags,  // 태그 검색
  "~": searchWebtoons_Author,  // 작가 검색
  "+": topWebtoons, // 조회수 높은거 검색
  "-": getWebtoonById, // ID로 검색
  default: searchWebtoons,  // 제목 검색
}

export default function WebtoonSearchResults() {
    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get("query") || ""
    
    const { results, setResults } = useSearchStore()
    const [ex_searchQuery, setEx_searchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!searchQuery) return

        const prefix = searchQuery[0]
        const queryHandler = searchTypeHandlers[prefix] || searchTypeHandlers.default

        setEx_searchQuery(searchQuery.slice(1))  // 특수문자 제거한 쿼리 저장

        const fetchSearchResults = async () => {
            try {
                const data = await queryHandler(searchQuery.slice(1))
                setResults(data)
            } catch (error) {
                console.error("웹툰 검색 중 오류 발생:", error)
                setResults({ content: [] })  // 빈 결과 설정
            } finally {
                setIsLoading(false)
            }
        }

        setIsLoading(true)
        fetchSearchResults()
    }, [searchQuery, setResults])

    return (
        <div className="min-h-screen pt-20 pb-10">
            {/* 검색 결과 */}
            <div className="flex flex-col items-start mb-6">
                <h1 className="text-xl font-bold">
                    <span className="text-green-500">'{ex_searchQuery}'</span> 에 대한 검색결과 입니다.
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
                        '{ex_searchQuery}'에 대한 검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}