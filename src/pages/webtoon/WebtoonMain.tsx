import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider";
import WebtoonGridHorizontal from "@/features/webtoon-list/ui/WebtoonGridHorizontal";
import {useWebtoonStore} from '@/entities/webtoon/api/store';
import {useAuthStore} from "@/entities/auth/api/store";
import AIAnalysisBanner from "@/features/ai-banner/ui/AIAnalysisBanner";
import {useUserStore} from "@/entities/user/api/userStore.ts";
import {Button} from "@/shared/ui/shadcn/button";
import { Card, CardContent } from "@/shared/ui/shadcn/card.tsx";

function WebtoonMain() {
    const { isAuthenticated } = useAuthStore();
    const { userInfo, fetchCurrentUserInfo } = useUserStore();
    const {
        recommendations,
        topWebtoonList, 
        popularByLikes, 
        popularByFavorites, 
        popularByWatched,
        fetchRecommendWebtoons,
        fetchTopWebtoons, 
        fetchPopularByLikes, 
        fetchPopularByFavorites, 
        fetchPopularByWatched,
        error
    } = useWebtoonStore();

    const [localLoading, setLocalLoading] = useState(true);
    const [sortedRecommendations, setSortedRecommendations] = useState<any[]>([]);

    const CategoryLink = ({ to, title }: { to: string; title: string }) => (
        <Link 
            to={to} 
            state={{ title }}
            className="flex items-center text-xl font-bold hover:text-blue-500 transition-colors"
        >
            {title}
            <ChevronRight className="ml-1 h-5 w-5" />
        </Link>
    );

    useEffect(() => {
        try {
            if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
                const validRecommendations = recommendations.filter(item => 
                    item && typeof item === 'object' && 'sim' in item
                );
                
                if (validRecommendations.length > 0) {
                    const sorted = [...validRecommendations].sort((a, b) => {
                        const simA = a.sim !== undefined ? a.sim : 0;
                        const simB = b.sim !== undefined ? b.sim : 0;
                        return simB - simA;
                    });
                    setSortedRecommendations(sorted);
                } else {
                    setSortedRecommendations([]);
                }
            } else {
                setSortedRecommendations([]);
            }
        } catch (error) {
            console.error('추천 데이터 처리 중 오류:', error);
            setSortedRecommendations([]);
        }
    }, [recommendations]);

    // 사용자 정보 가져오기
    useEffect(() => {
        if (isAuthenticated) {
            fetchCurrentUserInfo();
        }
    }, [isAuthenticated, fetchCurrentUserInfo]);

    useEffect(() => {
        const loadData = async () => {
            setLocalLoading(true);
            try {
                // 인기 웹툰 로드
                if (!topWebtoonList || !topWebtoonList.content || topWebtoonList.content.length === 0) {
                    fetchTopWebtoons(0, 12).catch(err => {
                        console.error("인기 웹툰 로드 실패:", err);
                    });
                }
                
                // 좋아요 기준 인기 웹툰 로드
                if (!popularByLikes || popularByLikes.length === 0) {
                    fetchPopularByLikes(10).catch(err => {
                        console.error("좋아요 웹툰 로드 실패:", err);
                    });
                }
                
                // 즐겨찾기 기준 인기 웹툰 로드
                if (!popularByFavorites || popularByFavorites.length === 0) {
                    fetchPopularByFavorites(10).catch(err => {
                        console.error("즐겨찾기 웹툰 로드 실패:", err);
                    });
                }
                
                // 조회수 기준 인기 웹툰 로드
                if (!popularByWatched || popularByWatched.length === 0) {
                    fetchPopularByWatched(10).catch(err => {
                        console.error("조회수 웹툰 로드 실패:", err);
                    });
                }
                
                // 추천 웹툰 데이터 로드
                if (isAuthenticated && (!recommendations || recommendations.length === 0)) {
                    fetchRecommendWebtoons({
                        use_popularity: true,
                        use_art_style: true,
                        use_tags: true
                    }).catch(err => {
                        console.warn("추천 웹툰(sendL_if) 로드 실패:", err);
                        setSortedRecommendations([]);
                    });
                }
                
            } catch (err) {
                console.error("웹툰 데이터 로드 중 오류 발생:", err);
            } finally {
                setTimeout(() => {
                    setLocalLoading(false);
                }, 500);
            }
        };
        
        loadData();
    }, [isAuthenticated]);

    if (localLoading && !topWebtoonList && !popularByLikes && !popularByWatched && !popularByFavorites) {
        return (
            <div className="bg-white rounded-lg p-8 text-center my-8 mt-70 mb-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
                <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
            </div>
        );
    }

    // 모든 API가 실패한 경우에만 에러 화면 표시
    if (error && !topWebtoonList && !popularByLikes && !popularByWatched && !popularByFavorites) {
        return (
            <div className="container pt-20 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">데이터를 불러오는 중 오류가 발생했습니다</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="pt-10">

                <section id="section1" className="pt-10">
                    {!isAuthenticated ?
                        <AIAnalysisBanner /> :
                        (sortedRecommendations && sortedRecommendations.length > 0) ? (
                            <WebtoonGridHorizontal
                                title={`📌 ${userInfo?.nickname || ''}님의 취향 분석`}
                                comment={`큐레이툰이 분석한 ${userInfo?.nickname || ''}님의 취향과 유사한 웹툰입니다. 전체보기에서 더 상세하게 조절하실 수 있습니다.`}
                                webtoons={() => Promise.resolve(sortedRecommendations)}
                                cardSize="md"
                                showActionButtons={true}
                                showAI={true}
                                initialLoad={false}
                                rows={2}
                                countType={null}
                            />
                        ) : (
                            <Card className="w-full border border-gray-200 bg-gray-50">
                                <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-2">{`📌 ${userInfo?.nickname || ''}님의 취향 분석`}</h2>
                                <p className="text-gray-500 mb-4">{userInfo?.nickname || ''}님을 알아가고 있는 중입니다.</p>
                                <Link to="/ai-recommendation" style={{ textDecoration: 'none' }}>
                                    <Button variant="outline">
                                        AI 맞춤 추천 설정하러 가기
                                    </Button>
                                </Link>
                                </CardContent>
                            </Card>
                        )
                    }
                </section>

                {topWebtoonList && topWebtoonList.content && topWebtoonList.content.length > 0 && (
                    <section id="section2" className="pt-10">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <CategoryLink to="/webtoon/list/top" title="🔥 전체" />
                            </div>
                            <WebtoonSlider
                                title=""
                                coment="누가 봐도 인정하는 인기 웹툰! 신규 입덕자도 바로 정주행 각!"
                                webtoons={() => Promise.resolve(topWebtoonList)}
                                cardSize={'sm'}
                                initialLoad={false}
                                showActionButtons={isAuthenticated}
                            />
                        </div>
                    </section>
                )}

                {popularByLikes && popularByLikes.length > 0 && (
                    <section id="section3" className="pt-10">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <CategoryLink to="/webtoon/list/likes" title="✨ 심장을 저격한 작품들" />
                            </div>
                            <WebtoonSlider
                                title=""
                                coment="유저들이 따봉을 마구 날린 웹툰들!"
                                webtoons={() => Promise.resolve(popularByLikes)}
                                cardSize={'sm'}
                                initialLoad={false}
                                showActionButtons={isAuthenticated}
                                countType={'likes'}
                            />
                        </div>
                    </section>
                )}

                {popularByWatched && popularByWatched.length > 0 && (
                    <section id="section4" className="pt-10">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <CategoryLink to="/webtoon/list/watched" title="👀 이건 봐야 해" />
                            </div>
                            <WebtoonSlider
                                title=""
                                coment="다들 본 그 웹툰! 안 보면 손해?!"
                                webtoons={() => Promise.resolve(popularByWatched)}
                                cardSize={'sm'}
                                initialLoad={false}
                                showActionButtons={isAuthenticated}
                                countType={'watched'}
                            />
                        </div>
                    </section>
                )}

                {popularByFavorites && popularByFavorites.length > 0 && (
                    <section id="section5" className="pt-10 pb-10">
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <CategoryLink to="/webtoon/list/favorites" title="🔖 찜 안 하면 섭섭해" />
                            </div>
                            <WebtoonSlider
                                title=""
                                coment="찜했다 === 믿고 본다! 유저들이 북마크 꽂고 간 찐-작들!"
                                webtoons={() => Promise.resolve(popularByFavorites)}
                                cardSize={'sm'}
                                initialLoad={false}
                                showActionButtons={isAuthenticated}
                                countType={'favorites'}
                            />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default WebtoonMain;