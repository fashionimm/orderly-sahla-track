
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-50">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-bold text-sahla-800 mb-2">Sahla-Track</h1>
        <p className="text-slate-600">
          The simplest way to track and manage your orders
        </p>
      </div>
      
      {isLogin ? (
        <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}

      <p className="mt-8 text-sm text-slate-500">
        Sahla-Track © {new Date().getFullYear()} | Built for Algerian businesses
      </p>
    </div>
  );
};

export default Auth;
