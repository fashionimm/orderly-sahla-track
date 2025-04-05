
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { fetchUserData } from '@/utils/auth-utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, add a backdoor login for testing
      if (email === 'demo@example.com' && password === 'demo123') {
        const mockUser: User = {
          id: 'demo-user-id',
          email: 'demo@example.com',
          name: 'Demo User',
          subscription: 'free',
          orderLimit: 20,
          ordersUsed: 0,
          subscription_status: 'active',
          requested_subscription: ''
        };
        setUser(mockUser);
        navigate('/dashboard');
        return { success: true };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        return { success: false, error: error.message };
      }
      
      const userData = await fetchUserData(data.user.id);
      setUser(userData);
      
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected sign in error:", error);
      return { success: false, error: error.message };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        return { success: false, error: error.message };
      }
      
      // If a user is created, fetch their data and set it
      if (data.user) {
        const userData = await fetchUserData(data.user.id);
        setUser(userData);
        
        navigate('/dashboard');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected sign up error:", error);
      return { success: false, error: error.message };
    }
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        toast.error(language === 'en' ? 'Failed to sign in with Google' : 'Échec de la connexion avec Google');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(language === 'en' ? 'Failed to sign in with Google' : 'Échec de la connexion avec Google');
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  // Refresh user data
  const refreshUser = async () => {
    const currentUser = await supabase.auth.getUser();
    if (currentUser.data.user) {
      const userData = await fetchUserData(currentUser.data.user.id);
      setUser(userData);
    }
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUser,
    isSubmitting
  };
};
