
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define user type
type UserType = {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'unlimited';
  orderLimit: number;
  ordersUsed: number;
} | null;

// Define context type
type AuthContextType = {
  user: UserType;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Mock authentication functions for now
  // These will be replaced with Supabase auth later
  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user creation
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        subscription: 'free' as const,
        orderLimit: 20,
        ordersUsed: 0
      };
      
      // Store in local storage for persistence
      localStorage.setItem('sahlaUser', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('Account created successfully');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, check if the email contains "admin" to grant admin privileges
      if (email.includes('admin')) {
        const adminUser = {
          id: 'admin-id',
          email,
          name: 'Admin User',
          subscription: 'unlimited' as const,
          orderLimit: Infinity,
          ordersUsed: 0
        };
        localStorage.setItem('sahlaUser', JSON.stringify(adminUser));
        setUser(adminUser);
        setIsAdmin(true);
      } else {
        // For demo purposes, we'll create a user if none exists
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          name: email.split('@')[0],
          subscription: 'free' as const,
          orderLimit: 20,
          ordersUsed: 0
        };
        localStorage.setItem('sahlaUser', JSON.stringify(newUser));
        setUser(newUser);
      }
      
      toast.success('Signed in successfully');
    } catch (error) {
      console.error('Signin error:', error);
      toast.error('Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      // Remove from local storage
      localStorage.removeItem('sahlaUser');
      setUser(null);
      setIsAdmin(false);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Signout error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Check for existing user on load
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('sahlaUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Check if user is admin
          setIsAdmin(parsedUser.email.includes('admin'));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
