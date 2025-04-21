import React, { ReactNode } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/ui/shadcn/dropdown-menu";

interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    isDanger?: boolean;
}

interface CustomDropdownProps {
    label: string | ReactNode;
    items: DropdownItem[];
    align?: "start" | "center" | "end";
    className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
    label, 
    items, 
    align = "end", 
    className = "" 
}) => {
    const safeItems = items.filter(item => !item.isDanger);
    const dangerItems = items.filter(item => item.isDanger);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className={`relative inline-flex items-center justify-center size-9 rounded-md text-gray-600 hover:text-gray-900 hover:bg-accent transition-colors cursor-pointer ${className}`}>
                    {typeof label === 'string' ? <span>{label}</span> : label}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-56">
                {safeItems.map((item, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={item.onClick}
                        className="cursor-pointer flex items-center gap-2"
                    >
                        {item.icon && <span className="text-gray-500">{item.icon}</span>}
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
                
                {safeItems.length > 0 && dangerItems.length > 0 && (
                    <DropdownMenuSeparator />
                )}
                
                {dangerItems.map((item, index) => (
                    <DropdownMenuItem
                        key={`danger-${index}`}
                        onClick={item.onClick}
                        className="cursor-pointer text-red-500 flex items-center gap-2"
                    >
                        {item.icon && <span className="text-red-500">{item.icon}</span>}
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default CustomDropdown;