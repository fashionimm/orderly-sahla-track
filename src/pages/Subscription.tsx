
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import PaymentModal from '@/components/subscription/PaymentModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const translations = {
  en: {
    title: 'Subscription Plans',
    subtitle: 'Choose the right plan for your business',
    freePlan: 'Free Plan',
    freePlanDesc: 'For small businesses getting started',
    premiumPlan: 'Premium Plan',
    premiumPlanDesc: 'For growing businesses',
    unlimitedPlan: 'Unlimited Plan',
    unlimitedPlanDesc: 'For established businesses',
    month: 'month',
    currentPlan: 'Current Plan',
    pendingApproval: 'Pending Approval',
    downgrade: 'Downgrade',
    upgrade: 'Upgrade',
    paymentMethods: 'Payment Methods',
    paymentInfo: 'Sahla-Track supports BaridiMob payments for all subscription upgrades. After selecting a plan, enter your transaction ID and we will verify your payment manually.',
    orderLimit: 'orders per month',
    unlimitedOrders: 'Unlimited orders',
    basicTracking: 'Basic order tracking',
    advancedTracking: 'Advanced order tracking',
    emailSupport: 'Email support',
    prioritySupport: 'Priority support',
    dedicatedSupport: 'Dedicated support',
    analytics: 'Customer analytics',
    allPremiumFeatures: 'All Premium features',
    apiAccess: 'API access',
    advancedReporting: 'Advanced reporting',
    baridimobAccount: 'BaridiMob Payment Details',
    cppNumber: 'CCP Number: 007999990008820434/19',
    accountName: 'Account Name: BaridiMob',
    manualVerificationNote: 'After payment, submit your transaction ID. We will verify and activate your subscription within 24 hours.',
    pendingPayments: 'Pending Payments',
    paymentDate: 'Payment Date',
    paymentAmount: 'Amount',
    paymentStatus: 'Status',
    transactionId: 'Transaction ID',
    noPayments: 'No pending payments found',
  },
  fr: {
    title: 'Plans d\'abonnement',
    subtitle: 'Choisissez le bon plan pour votre entreprise',
    freePlan: 'Plan gratuit',
    freePlanDesc: 'Pour les petites entreprises débutantes',
    premiumPlan: 'Plan premium',
    premiumPlanDesc: 'Pour les entreprises en croissance',
    unlimitedPlan: 'Plan illimité',
    unlimitedPlanDesc: 'Pour les entreprises établies',
    month: 'mois',
    currentPlan: 'Plan actuel',
    pendingApproval: 'En attente d\'approbation',
    downgrade: 'Rétrograder',
    upgrade: 'Mettre à niveau',
    paymentMethods: 'Méthodes de paiement',
    paymentInfo: 'Sahla-Track prend en charge les paiements BaridiMob pour toutes les mises à niveau d\'abonnement. Après avoir sélectionné un plan, entrez votre ID de transaction et nous vérifierons manuellement votre paiement.',
    orderLimit: 'commandes par mois',
    unlimitedOrders: 'Commandes illimitées',
    basicTracking: 'Suivi de commande de base',
    advancedTracking: 'Suivi de commande avancé',
    emailSupport: 'Support par e-mail',
    prioritySupport: 'Support prioritaire',
    dedicatedSupport: 'Support dédié',
    analytics: 'Analyse client',
    allPremiumFeatures: 'Toutes les fonctionnalités Premium',
    apiAccess: 'Accès API',
    advancedReporting: 'Rapports avancés',
    baridimobAccount: 'Détails de paiement BaridiMob',
    cppNumber: 'Numéro CCP: 007999990008820434/19',
    accountName: 'Nom du compte: BaridiMob',
    manualVerificationNote: 'Après le paiement, soumettez votre ID de transaction. Nous vérifierons et activerons votre abonnement dans les 24 heures.',
    pendingPayments: 'Paiements en attente',
    paymentDate: 'Date de paiement',
    paymentAmount: 'Montant',
    paymentStatus: 'Statut',
    transactionId: 'ID de transaction',
    noPayments: 'Aucun paiement en attente trouvé',
  }
};

interface Payment {
  id: string;
  transaction_id: string;
  subscription_type: string;
  amount: number;
  status: string;
  created_at: string;
}

const Subscription = () => {
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchPendingPayments();
    }
  }, [user]);
  
  const fetchPendingPayments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setPendingPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpgrade = (plan: string) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free Plan */}
        <Card className={`border ${user?.subscription === 'free' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>{t.freePlan}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground">/{t.month}</span>
            </div>
            <CardDescription>{t.freePlanDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>20 {t.orderLimit}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.basicTracking}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.emailSupport}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'free' ? (
              <Button className="w-full" variant="outline" disabled>
                {t.currentPlan}
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => handleUpgrade('free')}>
                {t.downgrade}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className={`border ${user?.subscription === 'premium' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>{t.premiumPlan}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$4.99</span>
              <span className="text-muted-foreground">/{t.month}</span>
            </div>
            <CardDescription>{t.premiumPlanDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>500 {t.orderLimit}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.advancedTracking}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.prioritySupport}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.analytics}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'premium' ? (
              <Button className="w-full" variant="outline" disabled>
                {t.currentPlan}
              </Button>
            ) : user?.subscription_status === 'pending' && user?.requested_subscription === 'premium' ? (
              <Button className="w-full" variant="outline" disabled>
                <AlertCircle className="mr-2 h-4 w-4" /> {t.pendingApproval}
              </Button>
            ) : (
              <Button className="w-full" onClick={() => handleUpgrade('premium')}>
                {user?.subscription === 'unlimited' ? t.downgrade : t.upgrade}
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {/* Unlimited Plan */}
        <Card className={`border ${user?.subscription === 'unlimited' ? 'border-sahla-500 shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>{t.unlimitedPlan}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/{t.month}</span>
            </div>
            <CardDescription>{t.unlimitedPlanDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.unlimitedOrders}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.allPremiumFeatures}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.dedicatedSupport}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.apiAccess}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{t.advancedReporting}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.subscription === 'unlimited' ? (
              <Button className="w-full" variant="outline" disabled>
                {t.currentPlan}
              </Button>
            ) : user?.subscription_status === 'pending' && user?.requested_subscription === 'unlimited' ? (
              <Button className="w-full" variant="outline" disabled>
                <AlertCircle className="mr-2 h-4 w-4" /> {t.pendingApproval}
              </Button>
            ) : (
              <Button className="w-full bg-sahla-500 hover:bg-sahla-600" onClick={() => handleUpgrade('unlimited')}>
                {t.upgrade}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      {pendingPayments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">{t.pendingPayments}</h2>
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.paymentDate}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.transactionId}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.paymentAmount}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.paymentStatus}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-gray-200">
                {pendingPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {payment.transaction_id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      ${payment.amount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-muted p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">{t.paymentMethods}</h2>
        <p className="text-muted-foreground mb-4">
          {t.paymentInfo}
        </p>
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-3 rounded-md">
            <h3 className="font-medium text-sm mb-2">{t.baridimobAccount}</h3>
            <p className="text-sm">{t.cppNumber}</p>
            <p className="text-sm">{t.accountName}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t.manualVerificationNote}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img 
              src="https://cdn.privat24.ua/icons/file/ServiceIcon_BaridiMob_b.png" 
              alt="BaridiMob" 
              className="h-10 object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          fetchPendingPayments();
          if (refreshUser) refreshUser();
        }}
        subscriptionType={selectedPlan}
      />
    </div>
  );
};

export default Subscription;
