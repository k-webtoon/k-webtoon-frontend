import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs"
import SearchBar from "@/features/webtoon-search/ui/SearchBar"
import logo from "@/shared/assets/curatoon.png"
import HeaderActions from "@/widgets/header/ui/HeaderActions";
import { homeSubNavItems, webtoonSubNavItems, findActiveSubNavItemByPath, SubNavItem, getSectionId } from "@/shared/config/navigation";

interface NavItem {
    title: string
    href: string
    value: string
}

const HEADER_HEIGHT = 120; // 헤더와 서브네비게이션 높이
const OBSERVER_THRESHOLD = 0.5; // 섹션의 50% 이상이 보일 때 활성화

const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeSubNav, setActiveSubNav] = useState<SubNavItem | undefined>(undefined);
    const [activeSubTab, setActiveSubTab] = useState("section1");

    // Observer 참조 저장용 (정리 단계에서 사용)
    const observerRef = useRef<IntersectionObserver | null>(null);

    // 네비게이션 아이템 - useMemo로 최적화
    const navItems: NavItem[] = useMemo(() => [
        { title: "홈", href: "/", value: "home" },
        { title: "웹툰", href: "/webtoon", value: "webtoon" },
        { title: "코멘트", href: "/coment", value: "coment" },
    ], []);

    const currentSubNavItems = useMemo(() => 
        activeTab === "home" ? homeSubNavItems : webtoonSubNavItems,
    [activeTab]);

    // 현재 경로에 따라 활성 탭 설정
    useEffect(() => {
        const currentPath = location.pathname;

        const matchingItem = navItems.find(item =>
            item.href === currentPath ||
            (item.href !== '/' && currentPath.startsWith(item.href))
        );

        if (matchingItem) {
            setActiveTab(matchingItem.value);
        } else if (currentPath === '/') {
            setActiveTab('home');
        }
    }, [location.pathname, navItems]);

    // 현재 경로에 따라 활성 서브네비게이션 아이템 설정
    useEffect(() => {
        const currentPath = location.pathname;
        const items = activeTab === "home" ? homeSubNavItems : webtoonSubNavItems;
        const activeItem = findActiveSubNavItemByPath(items, currentPath);
        
        if (activeItem) {
            setActiveSubNav(activeItem);
            setActiveSubTab(getSectionId(activeItem.href));
        } else if (items.length > 0) {
            setActiveSubNav(items[0]);
            setActiveSubTab(getSectionId(items[0].href));
        }
    }, [location.pathname, activeTab]);

    // 스크롤 이동 함수 - useCallback으로 최적화
    const scrollToSection = useCallback((e: React.MouseEvent, sectionId: string, item: SubNavItem) => {
        e.preventDefault();
        setActiveSubTab(sectionId);
        setActiveSubNav(item);

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
                
                // 해당 ID에 맞는 서브네비게이션 아이템 찾기
                const items = activeTab === "home" ? homeSubNavItems : webtoonSubNavItems;
                const matchingItem = items.find(item => getSectionId(item.href) === newActiveTab);
                if (matchingItem) {
                    setActiveSubNav(matchingItem);
                }
            }
        };

        // Observer 생성 및 참조에 저장
        observerRef.current = new IntersectionObserver(observerCallback, options);

        // 모든 섹션 요소 관찰 시작 - 약간 지연시켜 DOM이 업데이트될 시간 확보
        setTimeout(() => {
            if (!observerRef.current) return;

            currentSubNavItems.forEach(item => {
                const sectionId = getSectionId(item.href);
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

                currentSubNavItems.forEach(item => {
                    const sectionId = getSectionId(item.href);
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
                    // 해당 ID에 맞는 서브네비게이션 아이템 찾기
                    const matchingItem = currentSubNavItems.find(
                        item => getSectionId(item.href) === closestSection
                    );
                    if (matchingItem) {
                        setActiveSubNav(matchingItem);
                    }
                }
            };

            checkInitialVisibility();
        }, 100);
    }, [activeTab, currentSubNavItems]);

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

    // 서브 네비게이션 클릭 핸들러
    const handleSubNavClick = (e: React.MouseEvent, item: SubNavItem) => {
        const sectionId = getSectionId(item.href);
        
        // 스크롤이 필요한 경우 스크롤 처리
        if (document.getElementById(sectionId)) {
            scrollToSection(e, sectionId, item);
        } else {
            // 스크롤 대상이 없으면 페이지 이동
            e.preventDefault();
            setActiveSubNav(item);
            navigate(item.path);
        }
    };

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
                <div className="max-w-screen-xl mx-auto border-b transition-all duration-300">
                    <ul className="flex overflow-x-auto py-3 px-4 whitespace-nowrap transition-all duration-300">
                        {currentSubNavItems.map((item, index) => {
                            // href에서 섹션 ID 추출
                            const sectionId = getSectionId(item.href);

                            // 활성화 여부에 따른 클래스 결정
                            const isActive = activeSubNav?.title === item.title;
                            const linkClass = isActive
                                ? "text-sm font-bold text-yellow-500 transition-colors duration-300"
                                : "text-sm text-gray-700 hover:text-gray-900 transition-colors duration-300";

                            return (
                                <li key={index} className="mr-6 transition-transform duration-300">
                                    <a
                                        href={`#${sectionId}`}
                                        onClick={(e) => handleSubNavClick(e, item)}
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