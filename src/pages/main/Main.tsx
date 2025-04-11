import React, { useEffect } from "react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import WebtoonTextSearchForm from "@/features/webtoon-search-ai/ui/WebtoonTextSearchForm.tsx";
import CharacterChat from "@/features/webtoon-character-chat/ui/CharacterChat.tsx";
import CommunityReviews from "@/features/webtoon-reviews/ui/CommunityReviews.tsx";
import AIAnalysisBanner from "@/features/ai-banner/ui/AIAnalysisBanner.tsx";
import { useWebtoonStore } from '@/entities/webtoon/api/store.ts';
import {useAuthStore} from "@/entities/auth/api/store.ts";

const Main: React.FC = () => {
    const { isAuthenticated, initialize } = useAuthStore();
    const { topWebtoonList, fetchTopWebtoons } = useWebtoonStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        fetchTopWebtoons(0, 10); // 첫 페이지, 10개 항목 로드
    }, [fetchTopWebtoons]);

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
            <div className="pt-5">
                {!isAuthenticated ?
                    <>
                        <section id="section1" className="pt-10">
                            <AIAnalysisBanner />
                        </section>
                        <section id="section2" className="pt-5">
                            <WebtoonTextSearchForm />
                        </section>
                        <section id="section3" className="pt-5">
                            <WebtoonSlider
                                title="인기 웹툰"
                                webtoons={() => Promise.resolve(topWebtoonList!)}
                                cardSize={'sm'}
                                showActionButtons={false}
                                showAI={false}
                                initialLoad={true}
                            />
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
                        <section id="section2" className="pt-5">
                            <WebtoonSlider
                                title="오늘의 추천 웹툰"
                                webtoons={() => Promise.resolve(topWebtoonList!)}
                                cardSize={'sm'}
                                showAI={true}
                                initialLoad={true}
                            />
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