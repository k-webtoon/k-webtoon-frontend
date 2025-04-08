import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

const FindPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="py-4 md:py-6">
          <Link 
            to="/auth/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>로그인으로 돌아가기</span>
          </Link>
        </div>

        <section className="max-w-xl mx-auto text-center px-4 py-8 md:py-12">
          <h2 className="text-2xl font-semibold mb-2">
            로그인에 문제가 있나요?
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8">
            계정 복구를 도와드릴게요
          </p>

          <div className="grid gap-3 md:gap-4">
            <Link 
              to="/auth/find/id" 
              className="group flex items-start gap-3 p-3 md:p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-foreground mb-0.5 md:mb-1 group-hover:text-primary transition-colors">
                  아이디 찾기
                </h3>
                <p className="text-sm text-muted-foreground">
                  가입한 이메일 주소를 찾아보세요
                </p>
              </div>
            </Link>

            <Link 
              to="/auth/find/password" 
              className="group flex items-start gap-3 p-3 md:p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-foreground mb-0.5 md:mb-1 group-hover:text-primary transition-colors">
                  비밀번호 재설정
                </h3>
                <p className="text-sm text-muted-foreground">
                  새로운 비밀번호를 설정하세요
                </p>
              </div>
            </Link>
          </div>

          <p className="mt-6 md:mt-8 text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link 
              to="/auth/signup" 
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              회원가입
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default FindPage; 