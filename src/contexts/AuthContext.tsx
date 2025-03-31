
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from './LanguageContext';

// User type definition
type User = {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'unlimited';
  orderLimit: number;
  ordersUsed: number;
  subscription_status?: 'active' | 'pending' | 'rejected';
  requested_subscription?: string;
};

// Context type definition
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin?: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle?: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  refreshUser: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useLanguage();

  // For admin check
  const isAdmin = user?.email === 'admin@example.com'; // Simple admin check based on email

  // Fetch user data from Supabase
  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
      
      if (!data) {
        // If no user data found, create a mock user for demo
        const mockUserData = {
          id: userId,
          email: 'user@example.com',
          name: 'Demo User',
          subscription: 'free' as const,
          orderLimit: 20,
          ordersUsed: 0,
          subscription_status: 'active' as const,
          requested_subscription: ''
        };
        
        // Check for admin email to set admin status for demo
        if (mockUserData.email === 'admin@example.com') {
          mockUserData.subscription = 'unlimited';
        }
        
        return mockUserData;
      }
      
      return data as User;
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return null;
    }
  };

  // Initialize auth
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      try {
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = await fetchUserData(session.user.id);
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initialize();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
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
      
      // In a real implementation, we would create the user in the users table:
      // For demo, just set the user
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
    if (user) {
      const userData = await fetchUserData(user.id);
      setUser(userData);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
