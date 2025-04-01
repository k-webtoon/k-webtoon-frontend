import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from "@/shared/ui/shadcn/button.tsx";

const BookmarkButton = () => {
    // 북마크 상태 (true: 북마크됨, false: 북마크 안됨)
    const [isBookmarked, setIsBookmarked] = useState(false);
    // 툴팁 표시 상태
    const [showText, setShowText] = useState(false);

    const handleClick = () => {
        setIsBookmarked(prevState => !prevState);
    };

    const getButtonContent = () => {
        if (isBookmarked) {
            return {
                icon: <Bookmark className="h-3 w-3 text-white fill-white" />,
                text: "북마크됨",
                bgColor: "bg-green-500/70 hover:bg-green-600/70"
            };
        } else {
            return {
                icon: <Bookmark className="h-3 w-3 text-white" />,
                text: "북마크할래?",
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

export default BookmarkButton;