import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL에서 이메일 가져오기
  const { email } = location.state || {};

  // 비밀번호 요구사항 검증
  const passwordRequirements = [
    {
      label: '8자 이상',
      test: (value: string) => value.length >= 8
    },
    {
      label: '대문자 포함',
      test: (value: string) => /[A-Z]/.test(value)
    },
    {
      label: '소문자 포함',
      test: (value: string) => /[a-z]/.test(value)
    },
    {
      label: '숫자 포함',
      test: (value: string) => /[0-9]/.test(value)
    },
    {
      label: '특수문자 포함',
      test: (value: string) => /[!@#$%^&*]/.test(value)
    }
  ];

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    const failedRequirement = passwordRequirements.find(req => !req.test(value));
    return failedRequirement ? `비밀번호는 ${failedRequirement.label}이어야 합니다.` : null;
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    if (confirmPassword) {
      setConfirmError(value !== confirmPassword ? '비밀번호가 일치하지 않습니다.' : null);
    }
  };

  // 비밀번호 확인 입력 처리
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmError(password !== value ? '비밀번호가 일치하지 않습니다.' : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setError(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: API 연동 - 비밀번호 재설정
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      // 비밀번호 재설정 완료 페이지로 이동
      navigate('/auth/find/reset-password/result', { 
        state: { email } 
      });
    } catch (err) {
      setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">잘못된 접근입니다</h2>
            <p className="text-muted-foreground mb-6">
              이메일 인증을 먼저 진행해주세요.
            </p>
            <Button asChild>
              <Link to="/auth/find">돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              새로운 비밀번호를 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">새 비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="새로운 비밀번호를 입력하세요"
                  required
                  className={`transition-all duration-200 ${passwordError ? 'border-red-500 focus-visible:ring-red-500' : password ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {passwordRequirements.map((req, index) => (
                  <div 
                    key={index}
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                      !password 
                        ? 'bg-muted text-muted-foreground'
                        : req.test(password)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                      !password 
                        ? 'bg-muted-foreground/50'
                        : req.test(password)
                          ? 'bg-green-500'
                          : 'bg-red-500'
                    }`} />
                    {req.label}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  className={`transition-all duration-200 ${
                    confirmError 
                      ? 'border-red-500 focus-visible:ring-red-500' 
                      : confirmPassword 
                        ? 'border-green-500 focus-visible:ring-green-500' 
                        : ''
                  }`}
                />
                {confirmError && (
                  <p className="text-sm text-red-500 mt-1">{confirmError}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !!passwordError || !!confirmError}
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 