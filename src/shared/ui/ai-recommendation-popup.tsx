import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wand2, Star } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/shared/ui/shadcn/dialog';

interface AIRecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const AIRecommendationPopup: React.FC<AIRecommendationPopupProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    await onStart();
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-sm border-0 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-2" />
            AI 맞춤 추천
          </DialogTitle>
          <DialogDescription className="text-center text-indigo-200">
            당신만의 맞춤 웹툰을 추천해드립니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
            <Wand2 className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-semibold">개인화된 웹툰 추천</h3>
              <p className="text-sm text-indigo-200">당신의 취향을 분석하여 맞춤 웹툰을 추천합니다</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
            <Star className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="font-semibold">실시간 업데이트</h3>
              <p className="text-sm text-indigo-200">새로운 웹툰이 추가될 때마다 추천이 업데이트됩니다</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
              onClick={onClose}
            >
              건너뛰기
            </Button>
          </DialogClose>
          <Button
            onClick={handleStart}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                이동 중...
              </div>
            ) : (
              'AI 추천 시작하기'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 