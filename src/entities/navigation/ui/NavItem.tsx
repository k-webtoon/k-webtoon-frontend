import React from "react"
import { TabsTrigger } from "@/shared/ui/shadcn/tabs.tsx"
import { NavItem as NavItemType } from "../model/types"
import { cn } from "@/shared/lib/cn.ts"

interface NavItemProps {
    item: NavItemType
    active: boolean
    onSelect: (value: string) => void
    className?: string
}

export const NavItem: React.FC<NavItemProps> = ({
                                                    item,
                                                    active,
                                                    onSelect,
                                                    className
                                                }) => {
    const handleClick = () => {
        onSelect(item.value)
        window.location.href = item.href
    }

    return (
        <TabsTrigger
            value={item.value}
            className={cn(
                "h-full px-5 rounded-none text-gray-600 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent relative transition-all after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:duration-300",
                className
            )}
            onClick={handleClick}
        >
            {item.title}
        </TabsTrigger>
    )
}
