import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../header/ui/Header";
import Footer from "../../footer/ui/Footer";

const Layout: FC = () => {
  const location = useLocation();
  const isWebtoonListPage = location.pathname.includes('/webtoon/list');
  const isWebtoonSimilarPage = location.pathname.includes('/webtoon/similar');
  const isWebtoonRecommendationsPage = location.pathname === '/webtoon/recommendations';
  const isUserBasedRecommendationsPage = location.pathname === '/user-based-recommendations';
  
  const showSubNav = isWebtoonListPage || isWebtoonSimilarPage || isWebtoonRecommendationsPage || isUserBasedRecommendationsPage;

  return (
    <>
      <Header />
      <div className={showSubNav ? 'fixed top-[105px] left-0 right-0 z-40 w-full' : 'hidden'}>
        <div id="sub-nav-placeholder"></div>
      </div>
      <main className="main">
        <div className="pt-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;