import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { authApi } from '@/entities/auth/api/api.ts';

const FindPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const navigate = useNavigate();

  // 이메일 형식 검증
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // 전화번호 형식 검증
  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phoneRegex.test(number);
  };

  // 전화번호 자동 하이픈 추가
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3);
    return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
  };

  // 이메일 입력 처리
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
    setError(null);
  };

  // 전화번호 입력 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    if (formattedNumber.length <= 13) { // 최대 13자리 (하이픈 포함)
      setPhoneNumber(formattedNumber);
      setIsPhoneValid(validatePhoneNumber(formattedNumber));
      setError(null);
    }
  };

  // 이메일 확인
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API 호출 - 이메일 검증
      const response = await authApi.verifyEmail({ email });
      setSecurityQuestion(response.securityQuestion);
      setIsEmailVerified(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('등록되지 않은 이메일입니다. 입력하신 정보를 다시 확인해주세요.');
      } else {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      setIsEmailVerified(false);
    } finally {
      setLoading(false);
    }
  };

  // 전화번호 확인
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API 호출 - 전화번호 검증
      const response = await authApi.verifyPhoneNumber({ phoneNumber });
      
      // 전화번호의 보안 질문과 이메일의 보안 질문이 일치하는지 확인
      if (response.securityQuestion !== securityQuestion) {
        throw new Error('PHONE_MISMATCH');
      }

      // 보안 질문 페이지로 이동
      navigate('/auth/find/password/security-question', { 
        state: { 
          email,
          phoneNumber,
          question: securityQuestion,
          type: 'findPassword'
        } 
      });
    } catch (err: any) {
      if (err.message === 'PHONE_MISMATCH') {
        setError('입력하신 전화번호가 이메일과 일치하지 않습니다.');
      } else if (err.response?.status === 404) {
        setError('등록되지 않은 전화번호입니다. 입력하신 정보를 다시 확인해주세요.');
      } else {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="py-4 md:py-6">
          <Link 
            to="/auth/find"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">비밀번호 재설정</h2>
            <p className="text-muted-foreground">
              가입한 이메일과 전화번호를 입력하시면 보안 질문을 통해 본인 확인을 진행합니다
            </p>
          </div>

          {/* 이메일 입력 폼 */}
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="가입한 이메일 주소를 입력하세요"
                  required
                  disabled={isEmailVerified}
                  className={!email || isEmailValid ? '' : 'border-red-500'}
                />
                {!isEmailVerified && (
                  <Button 
                    type="submit" 
                    disabled={loading || !isEmailValid}
                  >
                    {loading ? '확인 중...' : '확인'}
                  </Button>
                )}
              </div>
              {email && !isEmailValid && (
                <p className="text-sm text-red-500 mt-1">
                  올바른 이메일 형식이 아닙니다
                </p>
              )}
            </div>
          </form>

          {/* 전화번호 입력 폼 */}
          {isEmailVerified && (
            <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                  required
                  className={!phoneNumber || isPhoneValid ? '' : 'border-red-500'}
                />
                <p className="text-sm text-muted-foreground">
                  형식: 010-1234-5678
                </p>
                {phoneNumber && !isPhoneValid && (
                  <p className="text-sm text-red-500 mt-1">
                    올바른 전화번호 형식이 아닙니다
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isPhoneValid}
              >
                {loading ? '확인 중...' : '다음'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;