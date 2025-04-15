import { useEffect } from "react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import { useWebtoonStore } from '@/entities/webtoon/api/store.ts';

function WebtoonMain() {
    const { topWebtoonList, popularByLikes, popularByFavorites, popularByWatched, fetchTopWebtoons, fetchPopularByLikes, fetchPopularByFavorites, fetchPopularByWatched } = useWebtoonStore();

    useEffect(() => {
        if (!topWebtoonList || !topWebtoonList.content || topWebtoonList.content.length === 0) {
            fetchTopWebtoons(0, 10);
        }

        if (!popularByLikes || popularByLikes.length === 0) {
            fetchPopularByLikes(0, 10);
        }
        
        if (!popularByFavorites || popularByFavorites.length === 0) {
            fetchPopularByFavorites(0, 10);
        }

        if (!popularByWatched || popularByWatched.length === 0) {
            fetchPopularByWatched(0, 10);
        }
    }, [topWebtoonList, popularByFavorites]);

    return (
        <div className="container">

            <div className="pt-10">

                <section id="section1" className="pt-10">
                    {/*<WebtoonSlider*/}
                    {/*    title="오늘의 추천 웹툰"*/}
                    {/*    coment="사용자의 데이터 기반으로 추천되었습니다."*/}
                    {/*    webtoons={() => Promise.resolve(topWebtoonList)}*/}
                    {/*    cardSize={'sm'}*/}
                    {/*    cardAIButton={true}*/}
                    {/*    initialLoad={true}*/}
                    {/*/>*/}
                </section>

                <section id="section2" className="pt-10">
                    {topWebtoonList && (
                        <WebtoonSlider
                            title="🔥 이건 진짜 인기 있음"
                            coment="누가 봐도 인정하는 인기 웹툰! 신규 입덕자도 바로 정주행 각!"
                            webtoons={() => Promise.resolve(topWebtoonList)}
                            cardSize={'sm'}
                            initialLoad={false}
                        />
                    )}
                </section>

                <section id="section3" className="pt-10">
                    {popularByWatched && popularByWatched.length > 0 && (
                        <WebtoonSlider
                            title="👀 이건 봐야 해"
                            coment="다들 본 그 웹툰! 안 보면 손해?!"
                            webtoons={() => Promise.resolve(popularByWatched)}
                            cardSize={'sm'}
                            initialLoad={false}
                        />
                    )}
                </section>

                <section id="section4" className="pt-10">
                    {popularByLikes && popularByLikes.length > 0 && (
                        <WebtoonSlider
                            title="✨ 심장을 저격한 작품들"
                            coment="유저들이 따봉을 마구 날린 웹툰들!"
                            webtoons={() => Promise.resolve(popularByLikes)}
                            cardSize={'sm'}
                            initialLoad={false}
                        />
                    )}
                </section>

                <section id="section5" className="pt-10">

                    {popularByFavorites && popularByFavorites.length > 0 && (
                        <WebtoonSlider
                            title="🔖 찜 안 하면 섭섭해"
                            coment="찜했다 === 믿고 본다! 유저들이 북마크 꽂고 간 찐-작들!"
                            webtoons={() => Promise.resolve(popularByFavorites)}
                            cardSize={'sm'}
                            initialLoad={false}
                        />
                    )}
                </section>

            </div>
        </div>
    );
}

export default WebtoonMain;