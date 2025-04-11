import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/entities/auth/ui/LoginForm';
import { useAuthStore } from '@/entities/auth/api/store.ts';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (isAuthenticated) {
            console.log("인증됨, 홈으로 리다이렉트");
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginSuccess = () => {
        console.log("로그인 성공");
    };

    return (
        <div className="min-h-screen bg-background pt-10">
            <div className="w-full h-full p-8 md:p-10 flex items-center justify-center">
                <LoginForm onSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

export default LoginPage;