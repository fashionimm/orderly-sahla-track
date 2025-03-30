
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();
  
  // Animation class state
  const [animateClass, setAnimateClass] = useState('');
  
  // Add animation effect on initial load
  useEffect(() => {
    setAnimateClass('animate-in fade-in slide-in-from-bottom-4 duration-500');
  }, []);

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-white to-slate-100">
      <div className={`w-full max-w-md text-center mb-8 ${animateClass}`}>
        <h1 className="text-4xl font-bold text-sahla-800 mb-2 relative inline-block">
          Sahla-Track
          <span className="absolute -top-3 -right-3 text-xs bg-sahla-500 text-white px-1.5 py-0.5 rounded-md rotate-12">
            Beta
          </span>
        </h1>
        <p className="text-slate-600">
          {language === 'en' 
            ? 'The simplest way to track and manage your orders'
            : 'La façon la plus simple de suivre et gérer vos commandes'}
        </p>
      </div>
      
      <div className={animateClass}>
        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Sahla-Track © {new Date().getFullYear()} | 
        {language === 'en' 
          ? ' Built for Algerian businesses'
          : ' Conçu pour les entreprises algériennes'}
      </p>
    </div>
  );
};

export default Auth;
