
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContextType } from '@/types/auth';
import { fetchUserData } from '@/utils/auth-utils';
import { useAuthOperations } from '@/hooks/use-auth-operations';

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
  
  // For admin check
  const isAdmin = user?.email === 'admin@example.com'; // Simple admin check based on email

  // Get auth operations from hook
  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut,
    refreshUser 
  } = useAuthOperations(setUser);

  // Initialize auth
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      
      try {
        // Check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
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
        console.log("Auth state change:", event, session?.user?.id);
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
