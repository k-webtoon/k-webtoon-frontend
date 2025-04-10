import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';

const SecurityQuestionPage: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 데이터 가져오기
  const { email, phoneNumber, question, type } = location.state || {};

  // 이전 단계에서 필요한 정보가 없는 경우
  if (!question || (!email && !phoneNumber)) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">잘못된 접근입니다</h2>
            <p className="text-muted-foreground mb-6">
              이메일 또는 전화번호 인증을 먼저 진행해주세요.
            </p>
            <Button asChild>
              <Link to="/auth/find">돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: API 연동 - 보안 질문 답변 검증
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      // 아이디 찾기인 경우
      if (type === 'findId') {
        const mockEmail = 'example@email.com'; // 임시 데이터
        navigate('/auth/find/id/result', { 
          state: { email: mockEmail } 
        });
      } 
      // 비밀번호 찾기인 경우
      else {
        navigate('/auth/find/reset-password', { 
          state: { email } 
        });
      }
    } catch (err) {
      setError('보안 질문 답변이 일치하지 않습니다. 다시 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="py-4 md:py-6">
          <Link 
            to={type === 'findId' ? '/auth/find/id' : '/auth/find/password'}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">본인 확인</h2>
            <p className="text-muted-foreground">
              회원가입 시 등록한 보안 질문에 답변해주세요
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
              <Label>보안 질문</Label>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm">{question}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">답변</Label>
              <Input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="보안 질문의 답변을 입력하세요"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '확인 중...' : '확인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionPage; 