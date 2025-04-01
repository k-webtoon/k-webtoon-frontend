import { useState } from 'react';
import { Eye, EyeOff, Slash } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";

const WatchedButton = () => {
    // 0: 중립, 1: 봤어요, 2: 보지 않을래요
    const [watchState, setWatchState] = useState(0);
    // 툴팁 표시 상태
    const [showText, setShowText] = useState(false);

    const handleClick = () => {
        setWatchState((prevState) => (prevState + 1) % 3);
    };

    const getButtonContent = () => {
        switch (watchState) {
            case 0: // 중립 상태
                return {
                    icon: <Eye className="h-3 w-3 text-white" />,
                    text: "봤니?",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
            case 1:
                return {
                    icon: <Eye className="h-3 w-3 text-white" />,
                    text: "봤어요",
                    bgColor: "bg-purple-500/70 hover:bg-purple-600/70"
                };
            case 2:
                return {
                    icon: <EyeOff className="h-3 w-3 text-white" />,
                    text: "보지 않을래요",
                    bgColor: "bg-red-500/70 hover:bg-red-600/70"
                };
            default:
                return {
                    icon: <Slash className="h-3 w-3 text-white" />,
                    text: "선택해주세요",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
        }
    };

    const { icon, text, bgColor } = getButtonContent();

    return (
        <div className="relative">
            <Button
                onClick={handleClick}
                size="icon"
                className={`h-8 px-3 rounded-md ${bgColor} backdrop-blur-sm flex items-center transition-all duration-200`}
                onMouseEnter={() => setShowText(true)}
                onMouseLeave={() => setShowText(false)}
            >
                {icon}
            </Button>
            {showText && (
                <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-full mb-1 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {text}
                </div>
            )}
        </div>
    );
};

export default WatchedButton;