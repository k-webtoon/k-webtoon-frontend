import React, { useEffect, useState } from "react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import WebtoonTextSearchForm from "@/features/webtoon-search-ai/ui/WebtoonTextSearchForm.tsx";
import CharacterChat from "@/features/webtoon-character-chat/ui/CharacterChat.tsx";
import CommunityReviews from "@/features/webtoon-reviews/ui/CommunityReviews.tsx";
import AIAnalysisBanner from "@/features/ai-banner/ui/AIAnalysisBanner.tsx";
import { useWebtoonStore } from '@/entities/webtoon/api/store.ts';
import { useAuthStore } from "@/entities/auth/api/store.ts";
import { useUserStore } from "@/entities/user/api/userStore.ts";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import WebtoonGridHorizontal from "@/features/webtoon-list/ui/WebtoonGridHorizontal.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import {Card, CardContent} from "@/shared/ui/shadcn/card.tsx";

interface Review {
    id: string;
    webtoonId: string;
    webtoonTitle: string;
    content: string;
    rating: number;
    authorName: string;
    createdAt: Date;
}

const Main: React.FC = () => {
    const { isAuthenticated, initialize } = useAuthStore();
    const { userInfo, fetchCurrentUserInfo } = useUserStore();
    const { 
        topWebtoonList, 
        fetchTopWebtoons,
        recommendations,
        fetchRecommendWebtoons
    } = useWebtoonStore();

    const [sortedRecommendations, setSortedRecommendations] = useState<any[]>([]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        fetchTopWebtoons(0, 10); // 첫 페이지, 10개 항목 로드
    }, [fetchTopWebtoons]);

    // 사용자 정보 가져오기
    useEffect(() => {
        if (isAuthenticated) {
            fetchCurrentUserInfo();
        }
    }, [isAuthenticated, fetchCurrentUserInfo]);

    // 추천 데이터 정렬 처리
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

    // 추천 데이터 로드 로직
    const [apiErrorStatus, setApiErrorStatus] = useState<{ status: number | null, retryCount: number }>({
        status: null,
        retryCount: 0
    });
    
    const [requestSent, setRequestSent] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    
    interface ErrorResponse {
        error: string;
        status?: number;
        message?: string;
    }
    
    // 타입 가드 함수: API 응답이 에러인지 확인
    function isErrorResponse(result: unknown): result is ErrorResponse {
        return Boolean(
            result && 
            typeof result === 'object' && 
            'error' in result
        );
    }

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
        if (
            requestSent || 
            !isAuthenticated || 
            (recommendations && recommendations.length > 0)
        ) {
            return;
        }
        
        if (apiErrorStatus.status === 500 && apiErrorStatus.retryCount >= 3) {
            console.warn("추천 API 서버 오류가 지속됩니다. 더 이상 시도하지 않습니다.");
            setSortedRecommendations([]);
            return;
        }
        
        const loadRecommendations = async () => {
            setRequestSent(true);
            setLocalLoading(true);
            
            try {
                const result = await fetchRecommendWebtoons({
                    use_popularity: true,
                    use_art_style: true,
                    use_tags: true
                });
                
                if (isErrorResponse(result)) {
                    if (result.error === 'SERVER_ERROR' && result.status === 500) {
                        setApiErrorStatus(prev => ({
                            status: 500,
                            retryCount: prev.retryCount + 1
                        }));
                    }
                    setSortedRecommendations([]);
                }
            } catch (err) {
                console.error("추천 웹툰 처리 중 오류:", err);
                setSortedRecommendations([]);
            } finally {
                setTimeout(() => {
                    setLocalLoading(false);
                }, 0);
            }
        };
        
        loadRecommendations();
    }, [isAuthenticated, recommendations, requestSent, apiErrorStatus]);

    const sampleReviews: Review[] = [
        {
            id: '1',
            webtoonId: '101',
            webtoonTitle: '노블레스',
            content: '캐릭터들의 성격과 능력이 다양해서 매화마다 새로운 볼거리가 있습니다. 특히 주인공의 성장 과정이 정말 인상적이었고, 스토리 전개도 탄탄해서 정주행하게 되었어요.',
            rating: 5,
            authorName: '웹툰러버',
            createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5분 전
        },
        {
            id: '2',
            webtoonId: '102',
            webtoonTitle: '마음의소리',
            content: '일상 에피소드가 너무 공감되고 항상 웃음이 나옵니다. 간단한 그림체지만 그 안에 담긴 유머와 철학이 정말 대단해요. 10년 넘게 보고 있는데 여전히 최고의 웹툰입니다.',
            rating: 4.5,
            authorName: '만화광',
            createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10분 전
        },
        {
            id: '3',
            webtoonId: '103',
            webtoonTitle: '외모지상주의',
            content: '주인공의 성장 이야기가 정말 감동적입니다. 학교 폭력과 외모 지상주의라는 사회적 문제를 잘 녹여낸 작품이라고 생각해요. 그림체도 점점 발전해서 보는 재미가 있습니다.',
            rating: 4,
            authorName: '웹툰팬',
            createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30분 전
        },
    ];

    return (
        <div className="container">
            <div className="pt-10">
                {!isAuthenticated ?
                    <>
                        <section id="section1" className="pt-10">
                            <AIAnalysisBanner />
                        </section>
                        <section id="section2" className="pt-5">
                            <WebtoonTextSearchForm />
                        </section>
                        <section id="section3" className="pt-5">
                            <div>
                                <div className="flex  justify-between items-center mb-4">
                                    <Link
                                        to="/webtoon/list/top"
                                        state="인기 웹툰"
                                        className="flex items-center text-xl font-bold hover:text-blue-500 transition-colors"
                                    >
                                        인기 웹툰
                                        <ChevronRight className="ml-1 h-5 w-5" />
                                    </Link>
                                </div>
                                <WebtoonSlider
                                    title=""
                                    webtoons={() => Promise.resolve(topWebtoonList!)}
                                    cardSize={'sm'}
                                    initialLoad={false}
                                    showActionButtons={isAuthenticated}
                                />
                            </div>
                        </section>
                        <section id="section4" className="pt-5">
                            <CharacterChat />
                        </section>

                        <section id="section5" className="pt-5">
                            <CommunityReviews reviews={sampleReviews} />
                        </section>
                    </>
                    :
                    <>
                        <section id="section1" className="pt-10">
                            <WebtoonTextSearchForm />
                        </section>
                        <section id="section2" className="pt-10">
                            {apiErrorStatus.status !== 500 ? (
                                <div>
                                    <div>
                                        <div>
                                            <CategoryLink to="/webtoon/list/likes" title={`📌 ${userInfo?.nickname || ''}님의 취향 분석`} />
                                        </div>
                                        <div className="pt-4 pb-6">
                                            <p className="text-left text-gray-500">{`큐레이툰이 분석한 ${userInfo?.nickname || ''}님의 취향과 유사한 웹툰입니다. 전체보기에서 더 상세하게 조절하실 수 있습니다.`}</p>
                                        </div>
                                    </div>
                                    
                                    {localLoading ? (
                                        <div className="bg-white rounded-lg p-8 text-center my-8">
                                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-xl font-semibold text-gray-700">데이터를 불러오는 중입니다...</p>
                                            <p className="text-gray-500 mt-2">잠시만 기다려주세요</p>
                                        </div>
                                    ) : sortedRecommendations && sortedRecommendations.length > 0 ? (
                                        <WebtoonGridHorizontal
                                            title=""
                                            comment=""
                                            webtoons={() => Promise.resolve(sortedRecommendations)}
                                            cardSize="md"
                                            showActionButtons={true}
                                            showAI={true}
                                            initialLoad={false}
                                            rows={2}
                                            countType={null}
                                        />
                                    ) : (
                                        <div className="bg-white rounded-lg p-8 text-center my-8">
                                            <p className="text-gray-700">아직 추천 데이터가 준비되지 않았습니다.</p>
                                        </div>
                                    )}
                                </div>
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
                            )}
                        </section>
                        <section id="section3" className="pt-5">
                            <CharacterChat />
                        </section>
                        <section id="section4" className="pt-5">
                            <CommunityReviews reviews={sampleReviews} />
                        </section>
                    </>
                }
            </div>
        </div>
    );
};

export default Main;