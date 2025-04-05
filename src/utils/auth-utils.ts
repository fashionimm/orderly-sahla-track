
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Fetch user data from Supabase
export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    
    if (!data) {
      console.log('No user data found for ID:', userId);
      
      // Create a new user record in the database
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
      
      // Try to get user email from auth
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser && authUser.user) {
        mockUserData.email = authUser.user.email || mockUserData.email;
      }
      
      // Insert the new user into the database
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: mockUserData.email,
          name: mockUserData.name,
          subscription: mockUserData.subscription,
          orderlimit: mockUserData.orderLimit,
          ordersused: mockUserData.ordersUsed,
          subscription_status: mockUserData.subscription_status,
          requested_subscription: mockUserData.requested_subscription
        });
      
      if (insertError) {
        console.error('Error creating user record:', insertError);
      } else {
        console.log('Created new user record for:', userId);
      }
      
      // Check for admin email to set admin status for demo
      if (mockUserData.email === 'admin@example.com') {
        mockUserData.subscription = 'unlimited';
      }
      
      return mockUserData;
    }
    
    // Map database column names to our User type (camelCase)
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      subscription: data.subscription,
      orderLimit: data.orderlimit,
      ordersUsed: data.ordersused,
      subscription_status: data.subscription_status,
      requested_subscription: data.requested_subscription
    } as User;
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    return null;
  }
};
