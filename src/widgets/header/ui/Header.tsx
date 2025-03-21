import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { DesktopHeader } from "./DesktopHeader"
import { MobileHeader } from "./MobileHeader"
import { MobileSearch } from "@/features/header-search/ui/MobileSearch"
import { SubNavigation } from "./SubNavigation"
import logo from "@/shared/assets/curatoon.png"
import { NavItem, SubTabItem } from "@/entities/navigation/model/types"
import { Notification } from "@/entities/notification/model/types"

const Header: React.FC = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("home")
    const [isSearchOpen, setIsSearchOpen] = useState(false)

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

    // 알림 데이터
    const notifications: Notification[] = [
        { id: 1, label: "새로운 웹툰이 업로드되었습니다." },
        { id: 2, label: "친구가 웹툰 리스트를 스크랩했습니다." },
        { id: 3, label: "알림 설정이 변경되었습니다." },
    ]

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
                <header className="w-full  backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    {/* 데스크탑 헤더 - 항상 최상단에 위치하도록 수정 */}
                    <div className="border-b">
                        <div className="px-5">
                            <DesktopHeader
                                logo={logo}
                                navItems={navItems}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                notifications={notifications}
                            />
                        </div>

                        {/* 모바일 헤더 */}
                        <div className="px-5">
                            <MobileHeader
                                logo={logo}
                                navItems={navItems}
                                subTabItems={subTabItems}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                isSearchOpen={isSearchOpen}
                                setIsSearchOpen={setIsSearchOpen}
                            />
                        </div>
                    </div>
                    <div>
                        {/* 모바일 검색창 */}
                        <MobileSearch
                            isOpen={isSearchOpen}
                            onClose={() => setIsSearchOpen(false)}
                        />    {/* 서브 네비게이션 - 데스크탑 헤더 아래에 위치하도록 분리 */}
                        {activeTab === "home" && (
                            <div className="w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5">
                                <SubNavigation
                                    activeTab={activeTab}
                                    subTabItems={subTabItems}
                                />
                            </div>
                        )}
                    </div>
                </header>


            </div>
            {/* 헤더와 서브네비게이션의 높이만큼 여백 추가 */}
        </>
    )
}

export default Header;