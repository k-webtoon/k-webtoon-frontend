import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/ui/shadcn/dropdown-menu";

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
                <div className="inline-flex items-center justify-center size-9 rounded-md text-gray-600 hover:text-gray-900 hover:bg-accent transition-colors cursor-pointer">
                    <span>
                        {label === "알림" ? (
                        <Bell className="h-4 w-4" />
                    ) : (
                        <User className="h-4 w-4" />
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