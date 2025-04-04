import { Badge } from "@/shared/ui/shadcn/badge.tsx"
import { WebtoonInfo, mapGenre } from "@/entities/webtoon/model/types.ts"
import { useSearchStore } from "@/entities/search/model/searchStore.ts"
import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { searchWebtoons } from "@/app/api/webtoonsApi.ts"

export default function Search() {
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
                    const data: WebtoonInfo = await searchWebtoons(searchQuery)
                    setResults([data])
                } catch (error) {
                    console.error("웹툰 검색 중 오류 발생:", error)
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
                    웹툰 <span className="text-sm text-gray-500">총 {results.length}</span>
                </h2>
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-6">
                        {results.map((webtoon: WebtoonInfo) => (
                            <div key={webtoon.id} className="flex gap-6 pb-6 border-b">
                                <div className="flex-shrink-0">
                                    <Link to={`/webtoon/${webtoon.id}`}>
                                        <img
                                            src={webtoon.thumbnailUrl}
                                            alt={webtoon.titleName}
                                            width="150"
                                            height="150"
                                            className="rounded-md cursor-pointer hover:brightness-90 transition-all duration-200"
                                        />
                                    </Link>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link to={`/webtoon/${webtoon.id}`} className="hover:underline">
                                            <h3 className="text-xl font-bold text-green-500">{webtoon.titleName}</h3>
                                        </Link>
                                        <div className="flex items-center">
                                            <span className="text-yellow-500">★</span>
                                            <span className="text-sm ml-1">{webtoon.starScore.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <span className="inline-block w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center">
                                            ✓
                                          </span>
                                          <span>{webtoon.author}</span>
                                        </span>
                                        <span>· {webtoon.rankGenreTypes.map(genre => mapGenre(genre)).join(', ')}</span>
                                        <span>{webtoon.finish ? '완결' : '연재중'}</span>
                                        <span>{webtoon.age}</span>
                                    </div>
                                    <p className="mb-3 text-gray-700 text-left">{webtoon.synopsis}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {webtoon.rankGenreTypes.map((genre, index) => (
                                            <Badge key={index} variant="outline" className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                                                #{mapGenre(genre)}
                                            </Badge>
                                        ))}
                                        {webtoon.finish && (
                                            <Badge variant="outline" className="bg-blue-100 hover:bg-blue-200 text-blue-700">
                                                #완결
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
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