
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionType: string;
}

const translations = {
  en: {
    title: 'Payment Details',
    description: 'Enter your payment transaction ID to complete subscription payment',
    transactionId: 'Transaction ID',
    paymentMethods: 'Payment Methods',
    baridiMob: 'BaridiMob',
    binanceInfo: 'Binance Pay',
    accountNumber: 'CCP Number: 007999990008820434/19',
    accountName: 'Account Name: BaridiMob',
    paymentInstructions: 'Make your payment using BaridiMob to the account above, then submit your transaction ID below.',
    binanceId: 'Binance ID (optional)',
    email: 'Your Email',
    submit: 'Submit Payment Details',
    submitting: 'Processing...',
    pendingMessage: 'Your payment is being processed. We will notify you once your subscription is activated.',
    errorMessage: 'Failed to submit payment details. Please try again.',
  },
  fr: {
    title: 'Détails de paiement',
    description: 'Entrez votre ID de transaction pour compléter le paiement de l\'abonnement',
    transactionId: 'ID de transaction',
    paymentMethods: 'Méthodes de paiement',
    baridiMob: 'BaridiMob',
    binanceInfo: 'Binance Pay',
    accountNumber: 'Numéro CCP: 007999990008820434/19',
    accountName: 'Nom du compte: BaridiMob',
    paymentInstructions: 'Effectuez votre paiement via BaridiMob sur le compte ci-dessus, puis soumettez votre identifiant de transaction ci-dessous.',
    binanceId: 'Binance ID (optionnel)',
    email: 'Votre Email',
    submit: 'Soumettre les détails de paiement',
    submitting: 'Traitement en cours...',
    pendingMessage: 'Votre paiement est en cours de traitement. Nous vous informerons une fois que votre abonnement sera activé.',
    errorMessage: 'Échec de la soumission des détails de paiement. Veuillez réessayer.',
  }
};

const getPlanPrice = (planType: string) => {
  switch(planType) {
    case 'premium': return 4.99;
    case 'unlimited': return 9.99;
    default: return 0;
  }
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, subscriptionType }) => {
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [transactionId, setTransactionId] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('baridimob');
  const [binanceId, setBinanceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionId.trim()) {
      toast(language === 'en' ? 'Error' : 'Erreur', {
        description: language === 'en' ? 'Transaction ID is required' : 'L\'ID de transaction est requis'
      });
      return;
    }
    
    if (!user) {
      toast(language === 'en' ? 'Error' : 'Erreur', {
        description: language === 'en' ? 'You must be logged in' : 'Vous devez être connecté'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First update user's subscription status to pending
      const { error: updateError } = await supabase
        .from('users')
        .update({
          subscription_status: 'pending',
          requested_subscription: subscriptionType
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Create a payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          email: email.trim(),
          transaction_id: transactionId.trim(),
          amount: getPlanPrice(subscriptionType),
          subscription_type: subscriptionType,
          status: 'pending'
        })
        .select();
      
      if (paymentError) {
        throw new Error(paymentError.message);
      }
      
      // Send notification to Telegram for admin approval
      const notificationResponse = await supabase.functions.invoke('telegram-notification', {
        body: {
          userId: user.id,
          userName: user.name,
          userEmail: email.trim() || user.email,
          subscriptionType,
          transactionId: transactionId.trim(),
          amount: getPlanPrice(subscriptionType),
          paymentMethod,
          binanceId: binanceId.trim() || undefined,
          paymentId: payment?.[0]?.id || ''
        }
      });
      
      if (!notificationResponse.data?.success) {
        throw new Error('Failed to send notification for approval');
      }
      
      // Refresh the user to get updated subscription status
      if (refreshUser) {
        await refreshUser();
      }
      
      toast(language === 'en' ? 'Success' : 'Succès', {
        description: t.pendingMessage
      });
      onClose();
    } catch (error: any) {
      console.error('Payment submission error:', error);
      toast(language === 'en' ? 'Error' : 'Erreur', {
        description: t.errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 space-y-4">
          <div className="bg-muted p-3 rounded-md">
            <h3 className="font-medium text-sm mb-2">{t.baridiMob}</h3>
            <p className="text-sm">{t.accountNumber}</p>
            <p className="text-sm">{t.accountName}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {t.paymentInstructions}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionId">{t.transactionId}</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. BRDM12345678"
              required
            />
          </div>
          {paymentMethod === 'binance' && (
            <div className="space-y-2">
              <Label htmlFor="binanceId">{t.binanceId}</Label>
              <Input
                id="binanceId"
                value={binanceId}
                onChange={(e) => setBinanceId(e.target.value)}
                placeholder="e.g. 87654321"
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-sahla-500 hover:bg-sahla-600">
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
