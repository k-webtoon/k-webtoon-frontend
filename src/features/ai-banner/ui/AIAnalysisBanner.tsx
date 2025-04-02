import { Button } from '@/shared/ui/shadcn/button';
import { ArrowRight } from 'lucide-react';

const AIAnalysisBanner = () => {
    return (
        <div className="w-full max-w-4xl mx-auto bg-orange-50 rounded-lg p-4 flex items-center gap-6">
            <div className="relative h-16 w-16 flex-shrink-0">
                <div className="absolute inset-0 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex space-x-3">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                        <div className="mt-2 w-6 h-1 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-orange-500 font-bold text-lg mb-1">AI가 당신의 취향을 분석해 드립니다!</h3>
                <p className="text-gray-600 text-sm">지금까지 본 웹툰을 기반으로 맞춤 추천을 받아보세요.</p>
            </div>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 flex items-center gap-2">
                시작하기
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default AIAnalysisBanner;