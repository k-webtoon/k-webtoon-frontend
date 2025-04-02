import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/entities/auth/ui/LoginForm';
import {useUserStore} from '@/entities/auth/model/userStore.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, checkAuth } = useUserStore();
    // const [socialLoading, setSocialLoading] = useState(false);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginSuccess = useCallback(() => {
        console.log("로그인 성공");
        // 최신 상태를 직접 가져오기
        const currentAuthState = useUserStore.getState();
        console.log("핸들 isAuthenticated (최신 상태)", currentAuthState.isAuthenticated);

        // 리다이렉트 전에 상태가 업데이트 되었는지 확인
        if (currentAuthState.isAuthenticated) {
            navigate('/');
        } else {
            // 상태가 아직 업데이트되지 않았다면 약간의 지연 후 리다이렉트
            setTimeout(() => {
                const updatedState = useUserStore.getState();
                console.log("지연 후 상태 확인:", updatedState.isAuthenticated);
                if (updatedState.isAuthenticated) {
                    navigate('/');
                }
            }, 100);
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background pt-10">
            {/* 로그인 폼 영역 */}
            <div className="w-full h-full p-8 md:p-10 flex items-center justify-center">
                <LoginForm
                    onSuccess={handleLoginSuccess}
                    // onSocialLogin={handleSocialLogin}
                />
            </div>
        </div>
    );
};

export default LoginPage;