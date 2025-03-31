
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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
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
        console.error('No user data found');
        return null;
      }

      // Map database user to our User type
      return {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split('@')[0],
        subscription: data.subscription || 'free',
        orderLimit: data.subscription === 'free' ? 20 : data.subscription === 'premium' ? 500 : Infinity,
        ordersUsed: data.orders_used || 0,
        subscription_status: data.subscription_status || 'active',
        requested_subscription: data.requested_subscription,
      } as User;
    } catch (error) {
      console.error('Unexpected error fetching user:', error);
      return null;
    }
  };

  // Initialize auth
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      // Check if user is already authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        setUser(userData);
      }
      
      setLoading(false);
      
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
        return { success: false, error: error.message };
      }
      
      const userData = await fetchUserData(data.user.id);
      setUser(userData);
      
      return { success: true };
    } catch (error: any) {
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
        return { success: false, error: error.message };
      }
      
      // Create user record in 'users' table
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email,
            name,
            subscription: 'free',
            orders_used: 0,
            subscription_status: 'active',
          },
        ]);
        
      if (insertError) {
        // Revert auth signup if user table insert fails
        await supabase.auth.signOut();
        return { success: false, error: insertError.message };
      }
      
      // Fetch the newly created user
      const userData = await fetchUserData(data.user!.id);
      setUser(userData);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/auth');
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
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
