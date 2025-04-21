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

const HEADER_HEIGHT = 120;
const OBSERVER_THRESHOLD = 0.5;

const Header: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("home");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeSubNav, setActiveSubNav] = useState<SubNavItem | undefined>(undefined);
    const [isScrolled, setIsScrolled] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const navItems: NavItem[] = useMemo(() => [
        { title: "홈", href: "/", value: "home" },
        { title: "웹툰", href: "/webtoon", value: "webtoon" },
    ], []);

    const currentSubNavItems = useMemo(() => 
        activeTab === "home" ? homeSubNavItems : webtoonSubNavItems,
    [activeTab]);

    useEffect(() => {
        const currentPath = location.pathname;

        if (currentPath === '/user-based-recommendations') {
            setActiveTab('webtoon');
            return;
        }

        if (currentPath.startsWith('/mypage')) {
            setActiveTab('');
            return;
        }

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

    useEffect(() => {
        const currentPath = location.pathname;
        const items = activeTab === "home" ? homeSubNavItems : webtoonSubNavItems;
        
        if (currentPath === '/user-based-recommendations') {
            const aiRecommendationItem = webtoonSubNavItems.find(item => item.path === '/user-based-recommendations');
            if (aiRecommendationItem) {
                setActiveSubNav(aiRecommendationItem);
                return;
            }
        }
        
        const activeItem = findActiveSubNavItemByPath(items, currentPath);
        
        if (activeItem) {
            setActiveSubNav(activeItem);
        } else if (items.length > 0) {
            setActiveSubNav(items[0]);
        }
    }, [location.pathname, activeTab]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = useCallback((e: React.MouseEvent, sectionId: string, item: SubNavItem) => {
        e.preventDefault();
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

    const setupIntersectionObserver = useCallback(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        if (activeTab !== "home" && activeTab !== "webtoon") return;

        const options = {
            root: null,
            rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`,
            threshold: OBSERVER_THRESHOLD
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            const intersectingEntries = entries.filter(entry => entry.isIntersecting);

            if (intersectingEntries.length > 0) {
                const newActiveTab = intersectingEntries[0].target.id;
                
                const items = activeTab === "home" ? homeSubNavItems : webtoonSubNavItems;
                const matchingItem = items.find(item => getSectionId(item.href) === newActiveTab);
                if (matchingItem) {
                    setActiveSubNav(matchingItem);
                }
            }
        };

        observerRef.current = new IntersectionObserver(observerCallback, options);

        setTimeout(() => {
            if (!observerRef.current) return;

            currentSubNavItems.forEach(item => {
                const sectionId = getSectionId(item.href);
                const sectionElement = document.getElementById(sectionId);
                if (sectionElement) {
                    observerRef.current?.observe(sectionElement);
                }
            });

            const checkInitialVisibility = () => {
                const viewportCenter = window.innerHeight / 2;
                let closestSection: string | null = null;
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

    useEffect(() => {
        setupIntersectionObserver();

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [setupIntersectionObserver]);

    const handleSubNavClick = (e: React.MouseEvent, item: SubNavItem) => {
        const sectionId = getSectionId(item.href);
        
        if (document.getElementById(sectionId)) {
            scrollToSection(e, sectionId, item);
        } else {
            e.preventDefault();
            setActiveSubNav(item);
            navigate(item.path);
        }
    };

    const isMyPage = location.pathname.startsWith('/mypage');
    const headerBgClass = useMemo(() => {
        return "bg-white";
    }, []);

    const headerShadowClass = useMemo(() => {
        return isScrolled ? "shadow" : "";
    }, [isScrolled]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${headerBgClass} ${headerShadowClass}`}>
            <div className="max-w-screen-xl mx-auto">
                <div className="mx-auto border-b transition-colors duration-300">
                    <div className="flex items-center justify-between h-16 px-4 transition-all duration-300">
                        <div className="flex items-center gap-2 transition-all duration-300">
                            <Link to="/" className="flex items-center">
                                <img src={logo} alt="Logo" className="h-8 transition-transform duration-300" />
                            </Link>

                            {!isMyPage && (
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
                            )}
                            
                            {isMyPage && (
                                <div className="ml-4 text-xl font-bold">마이페이지</div>
                            )}
                        </div>

                        <HeaderActions
                            isSearchOpen={isSearchOpen}
                            setIsSearchOpen={setIsSearchOpen}
                        />
                    </div>
                </div>
            </div>

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

            {((activeTab === "home" || activeTab === "webtoon") && !isMyPage) && (
                <div className="max-w-screen-xl mx-auto border-b transition-all duration-300">
                    <ul className="flex overflow-x-auto py-3 px-4 whitespace-nowrap transition-all duration-300">
                        {currentSubNavItems.map((item, index) => {
                            const sectionId = getSectionId(item.href);
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
            
            {isMyPage && (
                <div className="max-w-screen-xl mx-auto border-b transition-all duration-300">
                    <ul className="flex overflow-x-auto py-3 px-4 whitespace-nowrap transition-all duration-300">
                        <li className="mr-6">
                            <Link to="/mypage" className={`text-sm ${location.pathname === '/mypage' ? 'font-bold text-yellow-500' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-300`}>
                                프로필
                            </Link>
                        </li>
                        <li className="mr-6">
                            <Link to="/mypage/liked" className={`text-sm ${location.pathname === '/mypage' ? 'font-bold text-yellow-500' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-300`}>
                                좋아요한 웹툰
                            </Link>
                        </li>
                        <li className="mr-6">
                            <Link to="/mypage/comments" className={`text-sm ${location.pathname === '/mypage' ? 'font-bold text-yellow-500' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-300`}>
                                내 댓글
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Header;