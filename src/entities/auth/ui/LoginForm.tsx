import React, { useState } from "react";
import useAuthStore from "@/entities/auth/model/authStore.ts";
import { Input } from "@/shared/ui/shadcn/input.tsx";
import { Button } from "@/shared/ui/shadcn/button.tsx";
import { Label } from "@/shared/ui/shadcn/label.tsx";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/shadcn/alert.tsx";
import { Link } from "react-router-dom";

type SocialProvider = "kakao" | "google";

interface LoginFormProps {
  onSuccess?: () => void;
  className?: string;
  onSocialLogin?: (provider: SocialProvider) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  className = "",
  onSocialLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!email || !password) {
      return;
    }

    try {
      // userEmail과 userPassword로 정확히 매핑
      await login(email, password);
      if (onSuccess) onSuccess();
      console.log("로그인 시도:", { userEmail: email, userPassword: password });
    } catch (err) {
      console.error("로그인 에러:", err);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    if (onSocialLogin) {
      await onSocialLogin(provider);
    }
  };

  return (
    <div className={`w-full max-w-md space-y-8 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">로그인</h2>
        <p className="mt-2 text-muted-foreground">
          계정에 로그인하여 서비스를 이용하세요
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
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            {/*<Button variant="link" className="p-0 h-auto text-sm" type="button">*/}
            {/*    비밀번호 찾기*/}
            {/*</Button>*/}
            <Link to="/find/password" className="p-0 h-auto text-sm">
              비밀번호 찾기
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            소셜 계정으로 로그인
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="w-full h-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            className="h-5 w-5 mr-2"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <Button
          variant="outline"
          type="button"
          onClick={() => handleSocialLogin("kakao")}
          className="bg-[#FEE500] text-black hover:bg-[#FEE500]/90 hover:text-black w-full h-12"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C7.58172 4 4 6.8147 4 10.2986C4 12.3898 5.34897 14.2282 7.41131 15.2748L6.58683 18.5549C6.52347 18.7747 6.77051 18.9488 6.96582 18.8304L10.9076 16.2916C11.2636 16.3299 11.6277 16.3502 12 16.3502C16.4183 16.3502 20 13.5355 20 10.0516C20 6.56776 16.4183 4 12 4Z"
              fill="black"
            />
          </svg>
          Kakao
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-sm text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
