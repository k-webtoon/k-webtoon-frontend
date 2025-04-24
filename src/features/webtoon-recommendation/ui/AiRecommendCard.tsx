import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from '@/shared/ui/shadcn/card';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const AiRecommendCard = () => {
    const navigate = useNavigate();
    const [displayText, setDisplayText] = useState("");
    const fullText = "AI가 당신의 취향을 분석해 드립니다";
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (currentIndex < fullText.length && isTyping) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, 100);

            return () => clearTimeout(timeout);
        } else if (currentIndex >= fullText.length) {
            const resetTimeout = setTimeout(() => {
                setIsTyping(false);
                setCurrentIndex(fullText.length - 1);
            }, 1500);

            return () => clearTimeout(resetTimeout);
        } else if (!isTyping && currentIndex >= 0) {
            const deleteTimeout = setTimeout(() => {
                setDisplayText(prev => prev.slice(0, -1));
                setCurrentIndex(prevIndex => prevIndex - 1);
            }, 50);

            return () => clearTimeout(deleteTimeout);
        } else if (!isTyping && currentIndex < 0) {
            const restartTimeout = setTimeout(() => {
                setIsTyping(true);
                setCurrentIndex(0);
                setDisplayText("");
            }, 500);

            return () => clearTimeout(restartTimeout);
        }
    }, [currentIndex, isTyping, fullText]);

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <Card className="w-full border border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
            <CardContent className="p-0">
                <div className="relative p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full opacity-20 -mt-24 -mr-24"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200 rounded-full opacity-20 -mb-20 -ml-20"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="relative h-16 w-16 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full shadow-md flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <Typography
                                variant="h3"
                                component="h3"
                                sx={{
                                    mb: 2,
                                    fontWeight: 'bold',
                                    color: '#dd6b20',
                                    fontSize: '1.25rem',
                                    lineHeight: '1.75rem',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                {displayText}
                                <span
                                    style={{
                                        borderRight: '2px solid #dd6b20',
                                        marginLeft: '2px',
                                        animation: 'blink 1s step-end infinite'
                                    }}
                                >
                                    &nbsp;
                                </span>
                            </Typography>
                            <p className="text-gray-600">
                                지금까지 본 웹툰을 기반으로 맞춤 추천을 받아보세요.
                            </p>
                        </div>

                        <Button
                            className="bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-700 hover:to-amber-600
                                     text-white px-6 h-12 rounded-full flex items-center gap-2 font-medium shadow-md transition-all duration-300 hover:shadow-lg"
                            onClick={handleStartClick}
                        >
                            시작하기
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AiRecommendCard;