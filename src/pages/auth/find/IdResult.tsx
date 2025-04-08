import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/shadcn/button';

const IdResultPage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || {};

  if (!email) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">잘못된 접근입니다</h2>
            <p className="text-muted-foreground mb-6">
              본인 인증을 먼저 진행해주세요.
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
          <div className="text-center space-y-6">
            <div className="p-6 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">
                회원님의 아이디는
              </p>
              <p className="text-xl font-semibold text-primary">{email}</p>
              <p className="text-sm text-muted-foreground mt-2">
                입니다
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/login">
                <Button className="w-full">로그인하기</Button>
              </Link>
              <Link to="/auth/find/password">
                <Button variant="outline" className="w-full">
                  비밀번호 재설정
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdResultPage; 