import React from "react"
import { Button } from "@/shared/ui/shadcn/button.tsx"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/shared/ui/shadcn/sheet.tsx"
import { Menu } from "lucide-react"
import { Input } from "@/shared/ui/shadcn/input.tsx"
import { Search } from "lucide-react"
import { NavItem, SubTabItem } from "@/entities/navigation/model/types"
import { cn } from "@/shared/lib/cn.ts"

interface MobileMenuProps {
    navItems: NavItem[]
    subTabItems: SubTabItem[]
    activeTab: string
    onTabChange: (tab: string) => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
                                                          navItems,
                                                          subTabItems,
                                                          activeTab,
                                                          onTabChange
                                                      }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 text-gray-700">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="relative m-4">
                            <Input
                                type="text"
                                placeholder="웹툰 제목 또는 작가를 검색하세요..."
                                className="w-full border-gray-200 focus:border-gray-300 rounded-full pl-10 pr-4 h-10 focus-visible:ring-gray-300"
                            />
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            {navItems.map((item) => (
                                <SheetClose asChild key={item.value}>
                                    <a
                                        href={item.href}
                                        className={cn(
                                            "block px-4 py-2 rounded-md text-base font-medium transition-colors",
                                            activeTab === item.value
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        )}
                                        onClick={() => onTabChange(item.value)}
                                    >
                                        {item.title}
                                    </a>
                                </SheetClose>
                            ))}
                        </div>
                    </div>

                    {activeTab === "home" && (
                        <div className="py-4 border-b">
                            <h3 className="px-4 text-sm font-medium text-gray-500 mb-2">카테고리</h3>
                            <div className="space-y-2">
                                {subTabItems.map((item, index) => (
                                    <SheetClose asChild key={item.title}>
                                        <a
                                            href={item.href}
                                            className={cn(
                                                "block px-4 py-2 text-sm transition-colors",
                                                index === 0 ? "text-gray-900 font-medium" : "text-gray-600 hover:text-gray-900",
                                            )}
                                        >
                                            {item.title}
                                        </a>
                                    </SheetClose>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto py-4 border-t">
                        <div className="flex gap-2 px-4">
                            <Button asChild variant="outline" className="flex-1 border-gray-300 text-gray-700">
                                <a href="/login">로그인</a>
                            </Button>
                            <Button asChild className="flex-1 bg-gray-900 hover:bg-gray-800 text-white">
                                <a href="/signup">회원가입</a>
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}