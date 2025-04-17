import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider";
import { useWebtoonStore } from '@/entities/webtoon/api/store';
import {useAuthStore} from "@/entities/auth/api/store";
import AIAnalysisBanner from "@/features/ai-banner/ui/AIAnalysisBanner";
import { WebtoonPaginatedResponse } from '@/entities/webtoon/model/types';

function WebtoonMain() {
    const { isAuthenticated } = useAuthStore();
    const { 
        topWebtoonList, 
        popularByLikes, 
        popularByFavorites, 
        popularByWatched, 
        fetchTopWebtoons, 
        fetchPopularByLikes, 
        fetchPopularByFavorites, 
        fetchPopularByWatched,
        isLoading,
        error
    } = useWebtoonStore();
    
    const [localLoading, setLocalLoading] = useState(true);

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
        const loadData = async () => {
            setLocalLoading(true);
            try {
                const promises = [];
                
                if (!topWebtoonList || !topWebtoonList.content || topWebtoonList.content.length === 0) {
                    promises.push(fetchTopWebtoons(0, 10));
                }
                
                if (!popularByLikes || popularByLikes.length === 0) {
                    promises.push(fetchPopularByLikes(0, 10));
                }
                
                if (!popularByFavorites || popularByFavorites.length === 0) {
                    promises.push(fetchPopularByFavorites(0, 10));
                }
                
                if (!popularByWatched || popularByWatched.length === 0) {
                    promises.push(fetchPopularByWatched(0, 10));
                }
                
                await Promise.allSettled(promises);
                
            } catch (err) {
                console.error("웹툰 데이터 로드 중 오류 발생:", err);
            } finally {
                setLocalLoading(false);
            }
        };
        
        loadData();
    }, []);

    if (localLoading || isLoading) {
        return (
            <div className="container pt-20 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-52 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-gray-500">웹툰 데이터를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {
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
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <CategoryLink to="/webtoon/list/top" title="👑 맞춤 추천 웹툰" />
                            </div>
                            <WebtoonSlider
                                title=""
                                coment="회원님의 취향 데이터를 기반으로 추천했어요!"
                                webtoons={() => Promise.resolve(topWebtoonList || { content: [] } as WebtoonPaginatedResponse)}
                                cardSize={'sm'}
                                initialLoad={false}
                                showActionButtons={isAuthenticated}
                            />
                        </div>
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