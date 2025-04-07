import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import AgeVerification from './steps/AgeVerification';
import TermsAgreement from './steps/TermsAgreement';
import UserInfo from './steps/UserInfo';
import Complete from './steps/Complete';
import AIRecommendation from '@/pages/AIRecommendation/AIRecommendation';

export type SignupData = {
  birthYear: string;
  terms: {
    required: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
};

const steps = [
  { path: '', name: '연령 확인' },
  { path: 'terms', name: '약관 동의' },
  { path: 'user-info', name: '정보 입력' },
  { path: 'complete', name: '가입 완료' }
];

const SignupLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/signup/')[1] || '';
  const currentStepIndex = steps.findIndex(step => step.path === currentPath);
  const isAIRecommendation = currentPath === 'ai-recommendation';

  return (
    <div className="min-h-screen bg-background pt-10">
      <div className="w-full h-full p-8 md:p-10 flex flex-col items-center justify-center">
        {!isAIRecommendation && currentStepIndex !== -1 && (
          <div className="w-full max-w-md space-y-8">
            {/* 스텝 인디케이터 */}
            <div className="mb-8">
              <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
                회원가입
              </h2>
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.path} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2
                        ${index === currentStepIndex
                          ? 'bg-indigo-600 text-white'
                          : index < currentStepIndex
                          ? 'bg-indigo-200 text-indigo-700'
                          : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-500">{step.name}</span>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 w-full mt-4
                          ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={`w-full ${isAIRecommendation ? 'max-w-4xl' : 'max-w-md'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupData>({
    birthYear: '',
    terms: {
      required: false,
      privacy: false,
      marketing: false,
    },
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });

  const updateFormData = (data: Partial<SignupData>) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <Routes>
      <Route
        index
        element={
          <SignupLayout>
            <AgeVerification
              formData={formData}
              updateFormData={updateFormData}
              nextStep={() => navigate('/signup/terms')}
            />
          </SignupLayout>
        }
      />
      <Route
        path="terms"
        element={
          <SignupLayout>
            <TermsAgreement
              formData={formData}
              updateFormData={updateFormData}
              nextStep={() => navigate('/signup/user-info')}
              prevStep={() => navigate('/signup')}
            />
          </SignupLayout>
        }
      />
      <Route
        path="user-info"
        element={
          <SignupLayout>
            <UserInfo
              formData={formData}
              updateFormData={updateFormData}
              nextStep={() => navigate('/signup/complete')}
              prevStep={() => navigate('/signup/terms')}
            />
          </SignupLayout>
        }
      />
      <Route
        path="complete"
        element={
          <SignupLayout>
            <Complete formData={formData} />
          </SignupLayout>
        }
      />
      <Route
        path="ai-recommendation"
        element={
          <SignupLayout>
            <AIRecommendation />
          </SignupLayout>
        }
      />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
};

export default Signup; 