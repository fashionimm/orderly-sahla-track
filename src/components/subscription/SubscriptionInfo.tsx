
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const SubscriptionInfo = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const { subscription, orderLimit, ordersUsed } = user;
  const progress = orderLimit ? Math.min(Math.round((ordersUsed / orderLimit) * 100), 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Your Plan</span>
        <span className="text-xs font-medium capitalize">
          {subscription === 'free' ? 'Free' : subscription === 'premium' ? 'Premium' : 'Unlimited'}
        </span>
      </div>
      
      {subscription === 'free' && (
        <>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Order usage</span>
              <span>{ordersUsed} / {orderLimit}</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
          
          <Button variant="outline" size="sm" className="w-full text-xs">
            Upgrade to Premium
          </Button>
        </>
      )}
      
      {subscription === 'premium' && (
        <Button variant="outline" size="sm" className="w-full text-xs">
          Manage Subscription
        </Button>
      )}
    </div>
  );
};

export default SubscriptionInfo;
