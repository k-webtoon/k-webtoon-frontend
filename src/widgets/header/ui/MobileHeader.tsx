import React from "react"
import { Button } from "@/shared/ui/shadcn/button.tsx"
import { Search, Bell } from "lucide-react"
import { NavItem } from "@/entities/navigation/model/types"
import { MobileMenu } from "@/features/mobile-menu/ui/MobileMenu"
import { SubTabItem } from "@/entities/navigation/model/types"
import { Link } from "react-router-dom"

interface MobileHeaderProps {
    logo: string
    navItems: NavItem[]
    subTabItems: SubTabItem[]
    activeTab: string
    setActiveTab: (tab: string) => void
    isSearchOpen: boolean
    setIsSearchOpen: (isOpen: boolean) => void
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
                                                              logo,
                                                              navItems,
                                                              subTabItems,
                                                              activeTab,
                                                              setActiveTab,
                                                              isSearchOpen,
                                                              setIsSearchOpen
                                                          }) => {
    return (
        <div className="flex md:hidden items-center justify-between h-16">
            <div className="flex items-center">
                {/* Mobile menu button */}
                <MobileMenu
                    navItems={navItems}
                    subTabItems={subTabItems}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-8"/>
                    </Link>
                </div>
            </div>

            {/* Right utility navigation */}
            <div className="flex items-center">
                <ul className="flex">
                    <li>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-600 mr-2"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search />
                        </Button>
                    </li>
                    <li>
                        <Button variant="ghost" size="icon" className="text-gray-600 mr-2">
                            <Bell />
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    )
}