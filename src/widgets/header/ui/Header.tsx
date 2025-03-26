import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs.tsx"
import { NavItem, SubTabItem } from "@/entities/navigation/model/types"
import SearchBar from "@/features/search/ui/SearchBar.tsx"
import logo from "@/shared/assets/curatoon.png"
import HeaderActions from "@/widgets/header/ui/HeaderActions.tsx";

const Header: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("home")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [activeSubTab, setActiveSubTab] = useState("section1")

    const navItems: NavItem[] = [
        { title: "홈", href: "/", value: "home" },
        { title: "웹툰", href: "/webtoon", value: "webtoon" },
        { title: "코멘트", href: "/coment", value: "coment" },
    ]

    // URL 경로에 따라 activeTab 업데이트
    useEffect(() => {
        const currentPath = location.pathname;

        // 현재 URL과 일치하는 navItem 찾기
        const matchingItem = navItems.find(item =>
            item.href === currentPath ||
            (item.href !== '/' && currentPath.startsWith(item.href))
        );

        if (matchingItem) {
            setActiveTab(matchingItem.value);
        } else if (currentPath === '/') {
            setActiveTab('home');
        }
    }, [location.pathname]);

    const subTabItems: SubTabItem[] = [
        { title: "#취향에 따라 골라봤어요", href: "/1" },
        { title: "#인기 웹툰", href: "/2" },
        { title: "#최신 웹툰", href: "/3" },
        { title: "#큐레이툰 에디터 추천", href: "/4" }
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white transition-all duration-300">
            <div>
                {/* 로고 및 네비게이션 섹션 */}
                <div className="container mx-auto border-b transition-colors duration-300">
                    {/* 로고 - 모바일 & 데스크탑 공통 */}
                    <div className="flex items-center justify-between h-16 px-4 md:px-0 transition-all duration-300">
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
            <div
                className={`container mx-auto px-4 md:px-0 transition-all duration-300 ease-in-out overflow-hidden ${
                    isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <SearchBar
                    isMobile={true}
                    onClose={() => setIsSearchOpen(false)}
                    className="md:hidden py-2"
                />
            </div>

            {/* 서브 네비게이션 (홈 탭에서만 표시) */}
            {activeTab === "home" && (
                <div className="container mx-auto border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
                    <ul className="flex overflow-x-auto py-3 px-4 md:px-0 whitespace-nowrap transition-all duration-300">
                        {subTabItems.map((item, index) => {
                            // href에서 섹션 ID 추출
                            const sectionId = `section${item.href.split('/').pop()}`;

                            // 활성화 여부에 따른 클래스 결정
                            const isActive = activeSubTab === sectionId;
                            const linkClass = isActive
                                ? "text-sm font-bold text-gray-900 transition-colors duration-300"
                                : "text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300";

                            // 스크롤 이동 함수
                            const scrollToSection = (e: React.MouseEvent) => {
                                e.preventDefault();
                                setActiveSubTab(sectionId);

                                const section = document.getElementById(sectionId);
                                if (section) {
                                    // 헤더 높이를 고려하여 스크롤 위치 조정
                                    const headerHeight = 80; // 헤더와 서브네비게이션 높이에 맞게 조정
                                    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;

                                    window.scrollTo({
                                        top: sectionTop,
                                        behavior: "smooth"
                                    });
                                }
                            };

                            return (
                                <li key={index} className="mr-6 transition-transform duration-300">
                                    <a
                                        href={`#${sectionId}`}
                                        onClick={scrollToSection}
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