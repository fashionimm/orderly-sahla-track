
// Define auth-related types
export type User = {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'unlimited';
  orderLimit: number;
  ordersUsed: number;
  subscription_status?: 'active' | 'pending' | 'rejected';
  requested_subscription?: string;
};

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
