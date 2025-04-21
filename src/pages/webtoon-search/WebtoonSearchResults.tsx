import { WebtoonInfo } from "@/entities/webtoon/model/types"
import { useSearchStore } from "@/entities/webtoon-search/api/store"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { searchWebtoons, searchWebtoons_Tags, searchWebtoons_Author, topWebtoons, getWebtoonById } from "@/entities/webtoon/api/api"
import { HorizontalWebtoonCard } from "@/entities/webtoon/ui/HorizontalWebtoonCard"

const searchTypeHandlers: Record<string, any> = {
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
    const [prefix, setPrefix] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    // URL이 변경될 때만 검색 실행
    useEffect(() => {
        if (!searchQuery) return

        console.log("검색 페이지 검색 쿼리:", searchQuery);

        const firstChar = searchQuery[0];
        let actualQuery = searchQuery;
        let queryHandler: any = searchTypeHandlers.default;

        if (firstChar === '$' || firstChar === '~' || firstChar === '+' || firstChar === '-') {
            setPrefix(firstChar);
            actualQuery = searchQuery.slice(1);
            queryHandler = firstChar in searchTypeHandlers 
                ? searchTypeHandlers[firstChar] 
                : searchTypeHandlers.default;
        } else {
            setPrefix("");
        }

        console.log("실제 검색 쿼리:", actualQuery);
        setEx_searchQuery(actualQuery);  // 표시용 쿼리 저장

        const fetchSearchResults = async () => {
            try {
                setIsLoading(true);
                let data;
                
                // ID 검색인 경우
                if (prefix === '-') {
                    const id = parseInt(actualQuery);
                    if (!isNaN(id)) {
                        data = await queryHandler(id);
                    } else {
                        throw new Error('ID 검색은 숫자만 가능합니다.');
                    }
                } else {
                    data = await queryHandler(actualQuery);
                }
                
                // 단일 객체인 경우 (getWebtoonById)
                if (!data.content && data.id) {
                    setResults({ content: [data] });
                } else {
                    setResults(data);
                }
            } catch (error) {
                console.error("웹툰 검색 중 오류 발생:", error);
                setResults({ content: [] });  // 빈 결과 설정
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery, setResults]);

    // 검색어 강조 표시
    const highlightMatch = (text: string, searchTerm: string) => {
        if (!searchTerm.trim() || !text) return text;
        
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return (
          <>
            {parts.map((part, i) => 
              part.toLowerCase() === searchTerm.toLowerCase() ? 
                <span key={i} className="bg-green-200 text-green-800">{part}</span> : 
                part
            )}
          </>
        );
    };

    return (
        <div className="min-h-screen pt-20 pb-10">
            {/* 검색 결과 */}
            <div className="flex flex-col items-start mb-6">
                <h1 className="text-xl font-bold">
                    <span className="text-green-500">'{ex_searchQuery}'</span> 에 대한 검색결과 입니다.
                    {prefix === '$' && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">태그 검색</span>}
                    {prefix === '~' && <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">작가 검색</span>}
                    {prefix !== '$' && prefix !== '~' && <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">제목 검색</span>}
                </h1>
                <h2 className="text-lg font-medium mt-2">
                    웹툰 <span className="text-sm text-gray-500">총 {results.content?.length || 0}개</span>
                </h2>
            </div>

            <div className="mt-6">
                {isLoading ? (
                    <div className="bg-white rounded-lg p-8 text-center my-8 mt-20 mb-50">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
                        <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
                    </div>
                ) : results.content && results.content.length > 0 ? (
                    <div className="space-y-6">
                        {results.content.map((webtoon: WebtoonInfo) => (
                            <div key={webtoon.id} className="hover:bg-gray-50 rounded-lg p-2">
                                <HorizontalWebtoonCard webtoon={{
                                    ...webtoon,
                                    titleNameWithHighlight: highlightMatch(webtoon.titleName, ex_searchQuery),
                                    authorWithHighlight: highlightMatch(webtoon.author, ex_searchQuery)
                                }} />
                            </div>
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