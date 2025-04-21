import {Link, useLocation} from 'react-router-dom';
import { Home, LogIn, AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import {useAuthStore} from "@/entities/auth/api/store.ts";

interface AdminAccessDeniedProps {
    title?: string;
    description?: string;
    homeHref?: string;
    loginHref?: string;
}

// 관리자 권한이 없는 사용자에게 보여줄 페이지
export default function AdminAccessDenied({
                                              title = "관리자 권한이 필요합니다",
                                              description = "죄송합니다. 요청하신 페이지는 관리자 권한이 필요합니다.",
                                              homeHref = "/",
                                              loginHref = "/login"
                                          }: AdminAccessDeniedProps) {

    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const loginHrefWithRedirect = `${loginHref}?redirect=${encodeURIComponent(from)}`;

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <Card className="mx-auto max-w-md text-center shadow-lg p-8">
                <CardHeader>
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                        <AlertCircle className="h-10 w-10 text-blue-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-base">{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">관리자 계정으로 로그인하거나, 관리자 권한이 필요하시면 시스템 관리자에게 문의해주세요.</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="flex-1" variant="outline">
                        <Link to={homeHref}>
                            <Home className="mr-2 h-4 w-4" />
                            홈으로
                        </Link>
                    </Button>
                    {!isAuthenticated && (
                        <Button asChild className="flex-1" variant="default">
                            <Link to={loginHrefWithRedirect}>
                                <LogIn className="mr-2 h-4 w-4" />
                                로그인
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}