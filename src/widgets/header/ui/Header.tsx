import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useLocation, Link } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs.tsx"
import { NavItem, SubTabItem } from "@/entities/navigation/model/types"
import SearchBar from "@/features/search/ui/SearchBar.tsx"
import logo from "@/shared/assets/curatoon.png"
import HeaderActions from "@/widgets/header/ui/HeaderActions.tsx";

const HEADER_HEIGHT = 120; // 헤더와 서브네비게이션 높이
const OBSERVER_THRESHOLD = 0.5; // 섹션의 50% 이상이 보일 때 활성화

const Header: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("home");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState("section1");

    // Observer 참조 저장용 (정리 단계에서 사용)
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 네비게이션 아이템 - useMemo로 최적화
    const navItems: NavItem[] = useMemo(() => [
        { title: "홈", href: "/", value: "home" },
        { title: "웹툰", href: "/webtoon", value: "webtoon" },
        { title: "코멘트", href: "/coment", value: "coment" },
    ], []);

    // 서브 네비게이션 아이템 - useMemo로 최적화
    const homeSubTabItems: SubTabItem[] = useMemo(() => [
        { title: "AI기반 맞춤", href: "/1" },
        { title: "오늘의 추천 웹툰", href: "/2" },
        { title: "웹툰 캐릭터와 대화", href: "/3" },
        { title: "인기 리뷰", href: "/4" }
    ], []);

    const webtoonSubTabItems: SubTabItem[] = useMemo(() => [
        { title: "오늘의 추천 웹툰", href: "/1" },
        { title: "인기 웹툰", href: "/2" },
        { title: "최신 웹툰", href: "/3" },
        { title: "큐레이툰 에디터 추천", href: "/4" }
    ], []);

    // 현재 활성 탭에 따른 서브탭 아이템 선택 - useMemo로 최적화
    const currentSubTabItems = useMemo(() =>
            activeTab === "home" ? homeSubTabItems : webtoonSubTabItems,
        [activeTab, homeSubTabItems, webtoonSubTabItems]);

    // URL 경로에 따라 activeTab 업데이트
    useEffect(() => {
        const currentPath = location.pathname;

        const matchingItem = navItems.find(item =>
            item.href === currentPath ||
            (item.href !== '/' && currentPath.startsWith(item.href))
        );

        if (matchingItem) {
            setActiveTab(matchingItem.value);
        } else if (currentPath === '/') {
            setActiveTab('webtoon');
        }
    }, [location.pathname, navItems]);

    // 스크롤 이동 함수 - useCallback으로 최적화
    const scrollToSection = useCallback((e: React.MouseEvent, sectionId: string) => {
        e.preventDefault();
        setActiveSubTab(sectionId);

        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
            window.scrollTo({
                top: sectionTop,
                behavior: "smooth"
            });
        }
    }, []);

    // Intersection Observer 설정 함수 - useCallback으로 최적화
    const setupIntersectionObserver = useCallback(() => {
        // 이전 Observer 정리
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // 홈이나 웹툰 탭이 아니면 Observer를 설정하지 않음
        if (activeTab !== "home" && activeTab !== "webtoon") return;

        const options = {
            root: null,
            rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`,
            threshold: OBSERVER_THRESHOLD
        };

        // Observer 콜백 함수
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            // 교차 중인 섹션들 필터링
            const intersectingEntries = entries.filter(entry => entry.isIntersecting);

            // 교차하는 요소가 있으면 가장 첫 번째 것을 활성화
            if (intersectingEntries.length > 0) {
                const newActiveTab = intersectingEntries[0].target.id;
                setActiveSubTab(newActiveTab);
            }
        };

        // Observer 생성 및 참조에 저장
        observerRef.current = new IntersectionObserver(observerCallback, options);

        // 모든 섹션 요소 관찰 시작 - 약간 지연시켜 DOM이 업데이트될 시간 확보
        setTimeout(() => {
            if (!observerRef.current) return;

            currentSubTabItems.forEach(item => {
                const sectionId = `section${item.href.split('/').pop()}`;
                const sectionElement = document.getElementById(sectionId);
                if (sectionElement) {
                    observerRef.current?.observe(sectionElement);
                }
            });

            // 초기 활성화 탭 설정 - 현재 뷰포트에 있는 섹션 확인
            const checkInitialVisibility = () => {
                const viewportCenter = window.innerHeight / 2;
                let closestSection = null;
                let closestDistance = Infinity;

                currentSubTabItems.forEach(item => {
                    const sectionId = `section${item.href.split('/').pop()}`;
                    const section = document.getElementById(sectionId);

                    if (section) {
                        const rect = section.getBoundingClientRect();
                        const sectionCenter = rect.top + rect.height / 2;
                        const distance = Math.abs(sectionCenter - viewportCenter - HEADER_HEIGHT);

                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestSection = sectionId;
                        }
                    }
                });

                if (closestSection) {
                    setActiveSubTab(closestSection);
                }
            };

            checkInitialVisibility();
        }, 100);
    }, [activeTab, currentSubTabItems]);

    // Observer 설정 및 정리
    useEffect(() => {
        setupIntersectionObserver();

        // 컴포넌트 정리 시 Observer 해제
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [setupIntersectionObserver]);

    // 탭 변경 시 추가적인 처리
    useEffect(() => {
        // 탭이 변경될 때 현재 스크롤 위치에 맞는 서브탭 초기화
        if (activeTab === "home" || activeTab === "webtoon") {
            // 약간의 지연을 두어 DOM이 업데이트될 시간을 확보
            const timer = setTimeout(() => {
                // 현재 화면에 보이는 섹션 중 가장 상단에 있는 섹션 찾기
                let bestVisibleSection = null;
                let bestVisibleRatio = 0;

                currentSubTabItems.forEach(item => {
                    const sectionId = `section${item.href.split('/').pop()}`;
                    const section = document.getElementById(sectionId);

                    if (section) {
                        const rect = section.getBoundingClientRect();
                        const windowHeight = window.innerHeight;

                        // 화면에 얼마나 보이는지 계산 (비율)
                        const visibleTop = Math.max(0, rect.top);
                        const visibleBottom = Math.min(windowHeight, rect.bottom);
                        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                        const visibleRatio = visibleHeight / rect.height;

                        if (visibleRatio > bestVisibleRatio) {
                            bestVisibleRatio = visibleRatio;
                            bestVisibleSection = sectionId;
                        }
                    }
                });

                if (bestVisibleSection) {
                    setActiveSubTab(bestVisibleSection);
                } else if (currentSubTabItems.length > 0) {
                    // 보이는 섹션이 없으면 첫 번째 섹션으로 설정
                    const firstSectionId = `section${currentSubTabItems[0].href.split('/').pop()}`;
                    setActiveSubTab(firstSectionId);
                }
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [activeTab, currentSubTabItems]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-300">
            <div className="max-w-screen-xl mx-auto">
                {/* 로고 및 네비게이션 섹션 */}
                <div className="mx-auto border-b transition-colors duration-300">
                    {/* 로고 - 모바일 & 데스크탑 공통 */}
                    <div className="flex items-center justify-between h-16 px-4 transition-all duration-300">
                        {/* 좌측 - 로고 & 탭 */}
                        <div className="flex items-center gap-2 transition-all duration-300">
                            <Link to="/" className="flex items-center">
                                <img src={logo} alt="Logo" className="h-8 transition-transform duration-300" />
                            </Link>

                            {/* 데스크탑 탭 메뉴 */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="transition-opacity duration-300">
                                <TabsList className="bg-transparent h-16">
                                    {navItems.map((item) => (
                                        <TabsTrigger
                                            key={item.value}
                                            value={item.value}
                                            className="h-full px-5 rounded-none text-gray-600 data-[state=active]:text-gray-900 !border-0 data-[state=active]:!border-0 data-[state=active]:!shadow-none data-[state=active]:bg-transparent relative transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300"
                                            asChild
                                        >
                                            <Link
                                                to={item.href}
                                                onClick={() => setActiveTab(item.value)}
                                            >
                                                {item.title}
                                            </Link>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* 우측 - 유틸리티 메뉴 */}
                        <HeaderActions
                            isSearchOpen={isSearchOpen}
                            setIsSearchOpen={setIsSearchOpen}
                        />
                    </div>
                </div>
            </div>

            {/* 모바일 검색창 */}
            <div className="max-w-screen-xl mx-auto">
                <div
                    className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                        isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <SearchBar
                        isMobile={true}
                        onClose={() => setIsSearchOpen(false)}
                        className="md:hidden py-2"
                    />
                </div>
            </div>

            {/* 서브 네비게이션 (홈 또는 웹툰 탭에서만 표시) */}
            {(activeTab === "home" || activeTab === "webtoon") && (
                <div className="max-w-screen-xl mx-auto border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                    <ul className="flex overflow-x-auto py-3 px-4 whitespace-nowrap transition-all duration-300">
                        {currentSubTabItems.map((item, index) => {
                            // href에서 섹션 ID 추출
                            const sectionId = `section${item.href.split('/').pop()}`;

                            // 활성화 여부에 따른 클래스 결정
                            const isActive = activeSubTab === sectionId;
                            const linkClass = isActive
                                ? "text-sm font-bold text-gray-900 transition-colors duration-300"
                                : "text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300";

                            return (
                                <li key={index} className="mr-6 transition-transform duration-300">
                                    <a
                                        href={`#${sectionId}`}
                                        onClick={(e) => scrollToSection(e, sectionId)}
                                        className={linkClass}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Header;