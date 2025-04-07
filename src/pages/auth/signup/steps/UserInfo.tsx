import React, { useState, useEffect } from 'react';
import type { SignupData } from '../Signup';
import { Eye, EyeOff } from 'lucide-react';

interface UserInfoProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

interface ValidationState {
  email: {
    isValid: boolean;
    message: string;
  };
  password: {
    isValid: boolean;
    message: string;
    strength: 'weak' | 'medium' | 'strong';
  };
  confirmPassword: {
    isValid: boolean;
    message: string;
  };
  nickname: {
    isValid: boolean;
    message: string;
  };
}

const genres = [
  '액션', '로맨스', '판타지', '스포츠', '일상',
  '드라마', '코미디', '스릴러', '미스터리', 'SF'
];

const UserInfo: React.FC<UserInfoProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '', strength: 'weak' },
    confirmPassword: { isValid: false, message: '' },
    nickname: { isValid: false, message: '' },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? '' : '올바른 이메일 형식이 아닙니다.',
    };
  };

  const validatePassword = (password: string) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let message = '';

    if (!password) {
      message = '비밀번호를 입력해주세요.';
    } else if (!isLongEnough) {
      message = '비밀번호는 8자 이상이어야 합니다.';
    } else {
      const score = [hasNumber, hasLetter, hasSpecial].filter(Boolean).length;
      strength = score === 3 ? 'strong' : score === 2 ? 'medium' : 'weak';
      message = strength === 'weak' ? '숫자, 문자, 특수문자를 조합해주세요.' : '';
    }

    return {
      isValid: isLongEnough && strength !== 'weak',
      message,
      strength,
    };
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    return {
      isValid: password === confirmPassword && !!confirmPassword,
      message: password === confirmPassword ? '' : '비밀번호가 일치하지 않습니다.',
    };
  };

  const validateNickname = (nickname: string) => {
    return {
      isValid: nickname.length >= 2,
      message: nickname.length >= 2 ? '' : '닉네임은 2자 이상이어야 합니다.',
    };
  };

  useEffect(() => {
    setValidation({
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
      nickname: validateNickname(formData.nickname),
    });
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(validation).every(v => v.isValid)) {
      nextStep();
    }
  };

  const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  const handleInterestChange = (genre: string) => {
    const newInterests = formData.interests.includes(genre)
      ? formData.interests.filter(g => g !== genre)
      : formData.interests.length < 3
      ? [...formData.interests, genre]
      : formData.interests;

    updateFormData({ interests: newInterests });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          회원 정보 입력
        </h3>
        <p className="text-sm text-gray-500 text-center mb-8">
          웹툰 서비스 이용을 위한 기본 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${validation.email.isValid
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {validation.email.message && (
              <p className="mt-1 text-sm text-red-600">{validation.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {['weak', 'medium', 'strong'].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded-full ${
                      validation.password.strength === 'weak'
                        ? 'bg-red-500'
                        : validation.password.strength === 'medium' && level !== 'strong'
                        ? 'bg-yellow-500'
                        : validation.password.strength === 'strong'
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p
                className={`mt-1 text-sm ${
                  validation.password.strength === 'strong'
                    ? 'text-green-600'
                    : validation.password.strength === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {validation.password.message ||
                  (validation.password.strength === 'strong'
                    ? '안전한 비밀번호입니다.'
                    : validation.password.strength === 'medium'
                    ? '적정한 비밀번호입니다.'
                    : '비밀번호를 더 강화해주세요.')}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            비밀번호 확인
          </label>
          <div className="mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${validation.confirmPassword.isValid && formData.confirmPassword
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {validation.confirmPassword.message && (
              <p className="mt-1 text-sm text-red-600">{validation.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="nickname"
              value={formData.nickname}
              onChange={(e) => updateFormData({ nickname: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
                ${validation.nickname.isValid && formData.nickname
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              required
            />
            {validation.nickname.message && (
              <p className="mt-1 text-sm text-red-600">{validation.nickname.message}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            이전
          </button>
          <button
            type="submit"
            disabled={!Object.values(validation).every(v => v.isValid)}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo; 