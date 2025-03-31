
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
    description: 'Enter your Binance transaction ID to complete subscription payment',
    transactionId: 'Transaction ID',
    binanceId: 'Binance ID (optional)',
    binanceEmail: 'Binance Email (optional)',
    submit: 'Submit Payment Details',
    submitting: 'Processing...',
    pendingMessage: 'Your payment is being processed. We will notify you once your subscription is activated.',
    errorMessage: 'Failed to submit payment details. Please try again.',
  },
  fr: {
    title: 'Détails de paiement',
    description: 'Entrez votre ID de transaction Binance pour compléter le paiement de l\'abonnement',
    transactionId: 'ID de transaction',
    binanceId: 'Binance ID (optionnel)',
    binanceEmail: 'Email Binance (optionnel)',
    submit: 'Soumettre les détails de paiement',
    submitting: 'Traitement en cours...',
    pendingMessage: 'Votre paiement est en cours de traitement. Nous vous informerons une fois que votre abonnement sera activé.',
    errorMessage: 'Échec de la soumission des détails de paiement. Veuillez réessayer.',
  }
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, subscriptionType }) => {
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  
  const [transactionId, setTransactionId] = useState('');
  const [binanceId, setBinanceId] = useState('');
  const [binanceEmail, setBinanceEmail] = useState('');
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
        } as any)
        .eq('id', user.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Send notification to Telegram for admin approval
      const notificationResponse = await supabase.functions.invoke('telegram-notification', {
        body: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          subscriptionType,
          transactionId,
          binanceId: binanceId.trim() || undefined,
          binanceEmail: binanceEmail.trim() || undefined
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transactionId">{t.transactionId}</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 123456789"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="binanceId">{t.binanceId}</Label>
            <Input
              id="binanceId"
              value={binanceId}
              onChange={(e) => setBinanceId(e.target.value)}
              placeholder="e.g. 87654321"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="binanceEmail">{t.binanceEmail}</Label>
            <Input
              id="binanceEmail"
              type="email"
              value={binanceEmail}
              onChange={(e) => setBinanceEmail(e.target.value)}
              placeholder="e.g. your.email@example.com"
            />
          </div>
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
