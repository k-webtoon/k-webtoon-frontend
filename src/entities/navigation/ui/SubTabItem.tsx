import React from "react"
import { SubTabItem as SubTabItemType } from "../model/types"
import { cn } from "@/shared/lib/cn.ts"

interface SubTabItemProps {
    item: SubTabItemType
    active?: boolean
    index: number
}

export const SubTabItem: React.FC<SubTabItemProps> = ({
                                                          item,
                                                          active = false,
                                                          index
                                                      }) => {
    return (
        <a
            href={item.href}
            className={cn(
                "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0",
                index === 0
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
        >
            {item.title}
        </a>
    )
}