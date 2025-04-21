import React from 'react';
import LoginForm from '@/entities/auth/ui/LoginForm';

const Login: React.FC = () => {

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-160px)] px-4">
      <LoginForm 
        className="bg-card p-8 rounded-lg shadow-md"
      />
    </div>
  );
};

export default Login;