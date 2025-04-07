import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';
import { AIRecommendationPopup } from '@/shared/ui/ai-recommendation-popup';

interface CompleteProps {
  formData: {
    email: string;
    nickname: string;
  };
}

const Complete: React.FC<CompleteProps> = ({ formData }) => {
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAI(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setShowAI(false);
    navigate('/ai-recommendation');
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          회원가입 완료
        </h3>
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {formData.nickname}님, 환영합니다!
        </h2>
        <p className="text-sm text-gray-500">
          회원가입이 완료되었습니다.
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <button
          onClick={() => navigate('/login')}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          로그인하러 가기
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          메인으로 가기
        </button>
      </div>

      <AIRecommendationPopup
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        onStart={handleStart}
      />
    </div>
  );
};

export default Complete; 