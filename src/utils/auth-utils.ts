
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Fetch user data from Supabase
export const fetchUserData = async (userId: string): Promise<User | null> => {
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
      console.log('No user data found for ID:', userId);
      
      // If no user data found, create a mock user for demo
      const mockUserData: User = {
        id: userId,
        email: 'user@example.com',
        name: 'Demo User',
        subscription: 'free',
        orderLimit: 20,
        ordersUsed: 0,
        subscription_status: 'active',
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
