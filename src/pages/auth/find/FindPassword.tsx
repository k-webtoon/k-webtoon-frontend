import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';

const FindPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // 이메일 형식 검증
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // 이메일 입력 처리
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: API 연동 - 이메일 검증 및 보안 질문 조회
      const mockSecurityQuestion = "당신이 태어난 도시는 어디인가요?"; // 임시 데이터
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      // 보안 질문 페이지로 이동
      navigate('/auth/find/password/security-question', { 
        state: { 
          email,
          question: mockSecurityQuestion,
          type: 'findPassword'
        } 
      });
    } catch (err) {
      setError('이메일 확인에 실패했습니다. 입력하신 정보를 다시 확인해주세요.');
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
              가입한 이메일을 입력하시면 보안 질문을 통해 본인 확인을 진행합니다
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
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="가입한 이메일 주소를 입력하세요"
                required
                className={!email || isValid ? '' : 'border-red-500'}
              />
              {email && !isValid && (
                <p className="text-sm text-red-500 mt-1">
                  올바른 이메일 형식이 아닙니다
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

export default FindPasswordPage;