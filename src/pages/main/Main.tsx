import React from "react";

const Main: React.FC = () => {
    return (
        <div className="container">

            <section id="section1" className="py-12">
                <h2>#취향에 따라 골라봤어요</h2>
                {/* 추천 웹툰 콘텐츠 */}
                <div>
                    {/* 웹툰 카드들 */}
                </div>
            </section>

            <section id="section2" className="py-12">
                <h2>#인기 웹툰</h2>
                <div>
                    {/* 웹툰 카드들 */}
                </div>
            </section>

            <section id="section3" className="py-12">
                <h2>#최신 웹툰</h2>
                <div>
                    {/* 웹툰 카드들 */}
                </div>
            </section>

            <section id="section4" className="py-12">
                <h2>#큐레이툰 에디터 추천</h2>
                <div>
                    {/* 웹툰 카드들 */}
                </div>
            </section>

        </div>
    );
};

export default Main;