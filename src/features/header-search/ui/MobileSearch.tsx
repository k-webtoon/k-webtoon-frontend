import React from "react"
import { Input } from "@/shared/ui/shadcn/input.tsx"
import { Button } from "@/shared/ui/shadcn/button.tsx"
import { Search, X } from "lucide-react"

interface MobileSearchProps {
    isOpen: boolean
    onClose: () => void
}

export const MobileSearch: React.FC<MobileSearchProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="pb-3 md:hidden">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="웹툰 제목 또는 작가를 검색하세요..."
                    className="w-full border-gray-200 focus:border-gray-300 rounded-full pl-10 pr-4 h-10 focus-visible:ring-gray-200"
                    autoFocus
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1 text-gray-400"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}