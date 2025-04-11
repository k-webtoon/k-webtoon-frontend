import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { authApi } from '@/entities/auth/api/api.ts';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 데이터 가져오기
  const { email, phoneNumber, securityQuestion, securityAnswer } = location.state || {};

  // 이전 단계에서 필요한 정보가 없는 경우
  if (!email || !phoneNumber || !securityQuestion || !securityAnswer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">잘못된 접근입니다</h2>
            <p className="text-muted-foreground mb-6">
              보안 질문 인증을 먼저 진행해주세요.
            </p>
            <Button asChild>
              <Link to="/auth/find">돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setIsValid(validatePassword(value) && value === confirmPassword);
    setError(null);
  };

  // 비밀번호 확인 입력 처리
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setIsValid(validatePassword(newPassword) && newPassword === value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('비밀번호가 일치하지 않거나 형식이 올바르지 않습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API 호출 - 비밀번호 변경
      await authApi.changePassword({
        userEmail: email,
        phoneNumber,
        securityQuestion,
        securityAnswer,
        newPassword
      });
      
      // 비밀번호 변경 완료 페이지로 이동
      navigate('/auth/find/reset-password/result', {
        state: { email }
      });
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="py-4 md:py-6">
          <Link 
            to="/auth/find/password/security-question"
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

            <div className="space-y-2">
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="새 비밀번호를 입력하세요"
                required
                className={!newPassword || validatePassword(newPassword) ? '' : 'border-red-500'}
              />
              <p className="text-sm text-muted-foreground">
                영문, 숫자, 특수문자를 포함한 8자 이상
              </p>
              {newPassword && !validatePassword(newPassword) && (
                <p className="text-sm text-red-500 mt-1">
                  비밀번호 형식이 올바르지 않습니다
                </p>
              )}
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
                className={!confirmPassword || newPassword === confirmPassword ? '' : 'border-red-500'}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isValid}
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