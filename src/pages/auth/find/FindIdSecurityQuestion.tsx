import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/ui/shadcn/input';
import { Button } from '@/shared/ui/shadcn/button';
import { Label } from '@/shared/ui/shadcn/label';
import { Alert, AlertDescription } from '@/shared/ui/shadcn/alert';
import { AlertCircle } from 'lucide-react';
import { authApi } from '@/entities/auth/api/auth';

const FindIdSecurityQuestionPage: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL에서 데이터 가져오기
  const { phoneNumber, question } = location.state || {};

  // 이전 단계에서 필요한 정보가 없는 경우
  if (!question || !phoneNumber) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">잘못된 접근입니다</h2>
            <p className="text-muted-foreground mb-6">
              전화번호 인증을 먼저 진행해주세요.
            </p>
            <Button asChild>
              <Link to="/auth/find/id">돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('답변을 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApi.findEmail({
        phoneNumber,
        securityQuestion: question,
        securityAnswer: answer.trim()
      });
      
      navigate('/auth/find/id/result', { 
        state: { 
          email: response.email,
          phoneNumber 
        } 
      });
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('보안 질문 답변이 일치하지 않습니다. 다시 확인해주세요.');
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
            to="/auth/find/id"
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
                <p className="text-sm">{String(question)}</p>
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

            <Button type="submit" className="w-full" disabled={loading || !answer.trim()}>
              {loading ? '확인 중...' : '확인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindIdSecurityQuestionPage; 