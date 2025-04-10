import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent } from '@/shared/ui/shadcn/card';

const AIAnalysisBanner = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };
    return (
        <Card className="w-full border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 overflow-hidden">
            <CardContent className="p-0">
                <div className="relative p-6">

                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full opacity-20 -mt-24 -mr-24"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-300 rounded-full opacity-20 -mb-20 -ml-20"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="relative h-16 w-16 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full shadow-md flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-orange-600 mb-2">
                                AI가 당신의 취향을 분석해 드립니다!
                            </h3>
                            <p className="text-gray-600">
                                지금까지 본 웹툰을 기반으로 맞춤 추천을 받아보세요.
                            </p>
                        </div>

                        <Button
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600
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

export default AIAnalysisBanner;