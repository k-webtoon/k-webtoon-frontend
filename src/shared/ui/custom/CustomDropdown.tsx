import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/ui/shadcn/dropdown-menu"; // 경로는 프로젝트에 맞게 조정

import { Bell, User } from "lucide-react"

interface DropdownItem {
    label: string;
    onClick: () => void;
}

interface CustomDropdownProps {
    label: string;
    items: DropdownItem[];
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, items }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
                    <span>
                        {label === "알림" ? (
                        <Bell className="h-5 w-5" />
                    ) : (
                        <User className="h-5 w-5" />
                    )}
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {items.map((item, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={item.onClick}
                        className="cursor-pointer"
                    >
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CustomDropdown;