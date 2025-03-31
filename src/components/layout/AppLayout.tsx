
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Check for subscription alerts
  useEffect(() => {
    if (user) {
      // Check for order limit
      const isOrderLimitReached = user.subscription === 'free' && user.ordersUsed >= user.orderLimit;
      
      if (isOrderLimitReached) {
        const title = language === 'en' 
          ? 'Order Limit Reached' 
          : 'Limite de commandes atteinte';
          
        const description = language === 'en' 
          ? 'You have reached your order limit. Please upgrade your subscription.'
          : 'Vous avez atteint votre limite de commandes. Veuillez mettre à niveau votre abonnement.';
        
        toast(title, {
          description: description,
          action: {
            label: language === 'en' ? 'Upgrade Now' : 'Mettre à niveau',
            onClick: () => navigate('/subscription')
          }
        });
      }
      
      // Check for pending subscription
      if (user.subscription_status === 'pending') {
        const title = language === 'en' 
          ? 'Subscription Pending' 
          : 'Abonnement en attente';
          
        const description = language === 'en' 
          ? `Your ${user.requested_subscription} subscription is pending approval. We'll notify you once it's activated.`
          : `Votre abonnement ${user.requested_subscription} est en attente d'approbation. Nous vous informerons une fois qu'il sera activé.`;
        
        toast(title, {
          description: description,
        });
      }
      
      // Check for rejected subscription
      if (user.subscription_status === 'rejected') {
        const title = language === 'en' 
          ? 'Subscription Rejected' 
          : 'Abonnement refusé';
          
        const description = language === 'en' 
          ? 'Your subscription request was rejected. Please contact support for more information.'
          : 'Votre demande d\'abonnement a été refusée. Veuillez contacter le support pour plus d\'informations.';
        
        toast(title, {
          description: description,
        });
      }
    }
  }, [user, navigate, language]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sahla-500"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
