import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs.tsx"
import { NavItem as NavItemType } from "@/entities/navigation/model/types"
import { Notification } from "@/entities/notification/model/types"
import SearchBar from "@/features/search/ui/SearchBar.tsx"
import CustomDropdown from "@/shared/ui/custom/CustomDropdown.tsx"
import { Link } from "react-router-dom" // React Router 추가

interface DesktopHeaderProps {
    logo: string
    navItems: NavItemType[]
    activeTab: string
    setActiveTab: (tab: string) => void
    notifications: Notification[]
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
                                                                logo,
                                                                navItems,
                                                                activeTab,
                                                                setActiveTab,
                                                                notifications
                                                            }) => {
    return (
        <div className="hidden md:flex items-center justify-between h-16">
            {/* 왼쪽 - Logo , Tabs */}
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Logo" className="h-8" />
                </Link>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent h-16">
                        {navItems.map((item) => (
                            <TabsTrigger
                                key={item.value}
                                value={item.value}
                                className="h-full px-5 rounded-none text-gray-600 data-[state=active]:text-gray-900 !border-0 data-[state=active]:!border-0 data-[state=active]:!shadow-none data-[state=active]:bg-transparent relative transition-all after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300"
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

            {/* 오른쪽 - Search, Bell, Login, Signup */}
            <div>
                <ul className="flex items-center">
                    <li className="mr-4">
                        <SearchBar />
                    </li>
                    <li>
                        <div className="mr-2">
                            <CustomDropdown
                                label="알림"
                                items={notifications.map((notification) => ({
                                    label: notification.label,
                                    onClick: () => console.log("알림 클릭됨", notification.id),
                                }))}
                            />
                        </div>
                    </li>
                    <li className="text-gray-600 text-sm mr-4 hover:text-gray-900 transition-colors">
                        <Link to="/login">로그인</Link>
                    </li>
                    <li className="bg-gray-900 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm transition-colors">
                        <Link to="/signup">회원가입</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
