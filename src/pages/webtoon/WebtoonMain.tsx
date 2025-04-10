import { useEffect } from "react";
import WebtoonSlider from "@/features/webtoon-list/ui/WebtoonSlider.tsx";
import { useWebtoonStore } from '@/entities/webtoon/api/store.ts';

function WebtoonMain() {
    const { topWebtoonList, fetchTopWebtoons } = useWebtoonStore();

    useEffect(() => {
        fetchTopWebtoons(0, 10); // 첫 페이지, 10개 항목 로드
    }, [fetchTopWebtoons]);

    useEffect(() => {
        if (topWebtoonList) {
            console.log('topWebtoonList 업데이트됨:', topWebtoonList);
        }
    }, [topWebtoonList]);

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
                    <WebtoonSlider
                        title="인기 웹툰"
                        webtoons={() => Promise.resolve(topWebtoonList!)}
                        cardSize={'sm'}
                        initialLoad={true}
                    />
                </section>

                <section id="section3" className="pt-10">
                    {/*최신 웹툰 (카테고리? 변경 예정)*/}
                </section>

                <section id="section4" className="pt-10">
                    {/*큐레이툰 에디터 추천*/}
                </section>

            </div>
        </div>
    );
}

export default WebtoonMain;