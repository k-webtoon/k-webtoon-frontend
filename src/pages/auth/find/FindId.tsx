import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';

const FindIdPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

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

  // 전화번호 입력 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedNumber = formatPhoneNumber(value);
    if (formattedNumber.length <= 13) { // 최대 13자리 (하이픈 포함)
      setPhoneNumber(formattedNumber);
      setIsValid(validatePhoneNumber(formattedNumber));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: API 연동 - 전화번호 검증 및 보안 질문 조회
      const mockSecurityQuestion = "당신이 태어난 도시는 어디인가요?"; // 임시 데이터
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      // 보안 질문 페이지로 이동
      navigate('/auth/find/id/security-question', { 
        state: { 
          phoneNumber,
          question: mockSecurityQuestion,
          type: 'findId'
        } 
      });
    } catch (err) {
      setError('전화번호 확인에 실패했습니다. 입력하신 정보를 다시 확인해주세요.');
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
            <h2 className="text-2xl font-semibold mb-2">아이디 찾기</h2>
            <p className="text-muted-foreground">
              가입 시 등록한 전화번호를 입력하시면 보안 질문을 통해 본인 확인을 진행합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                required
                className={!phoneNumber || isValid ? '' : 'border-red-500'}
              />
              <p className="text-sm text-muted-foreground">
                형식: 010-1234-5678
              </p>
              {phoneNumber && !isValid && (
                <p className="text-sm text-red-500 mt-1">
                  올바른 전화번호 형식이 아닙니다
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isValid}
            >
              {loading ? '확인 중...' : '다음'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindIdPage; 