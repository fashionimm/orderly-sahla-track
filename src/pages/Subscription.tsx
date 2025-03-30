
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const Subscription = () => {
  const { user } = useAuth();
  
  const handleUpgrade = (plan: string) => {
    toast.info(`Upgrading to ${plan} plan - Binance Pay integration coming soon`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the right plan for your business</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <Card className={`border ${user?.subscription === 'free' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>Free Plan</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>For small businesses getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>20 orders per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Basic order tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'free' ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => handleUpgrade('free')}>
                Downgrade
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className={`border ${user?.subscription === 'premium' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>Premium Plan</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$4.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>For growing businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>500 orders per month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Advanced order tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Customer analytics</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'premium' ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleUpgrade('premium')}>
                {user?.subscription === 'unlimited' ? 'Downgrade' : 'Upgrade'}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Unlimited Plan */}
        <Card className={`border ${user?.subscription === 'unlimited' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>Unlimited Plan</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>For established businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Unlimited orders</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>All Premium features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Advanced reporting</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'unlimited' ? (
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full bg-sahla-500 hover:bg-sahla-600" onClick={() => handleUpgrade('unlimited')}>
                Upgrade
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 bg-muted p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
        <p className="text-muted-foreground mb-4">
          Sahla-Track uses Binance Pay for all subscription payments. Your payment information is securely processed and never stored on our servers.
        </p>
        <div className="flex items-center gap-2">
          <img 
            src="https://public.bnbstatic.com/static/images/common/binance-pay.png" 
            alt="Binance Pay" 
            className="h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Subscription;
