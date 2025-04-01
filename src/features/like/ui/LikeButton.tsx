import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";

const LikeButton = () => {
    // 0: 중립 상태, 1: 좋아요, 2: 싫어요
    const [state, setState] = useState(0);
    // 툴팁 표시 상태
    const [showText, setShowText] = useState(false);

    const handleClick = () => {
        setState((prevState) => (prevState + 1) % 3);
    };

    const getButtonContent = () => {
        switch (state) {
            case 0: // 중립 상태
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white" />,
                    text: "평가할래?",
                    bgColor: "bg-white/20 hover:bg-white/40"
                };
            case 1: // 좋아요
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white" />,
                    text: "좋아요",
                    bgColor: "bg-blue-500/70 hover:bg-blue-600/70"
                };
            case 2: // 싫어요
                return {
                    icon: <ThumbsDown className="h-3 w-3 text-white" />,
                    text: "싫어요",
                    bgColor: "bg-red-500/70 hover:bg-red-600/70"
                };
            default:
                return {
                    icon: <ThumbsUp className="h-3 w-3 text-white opacity-50" />,
                    text: "평가할래?",
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

export default LikeButton;