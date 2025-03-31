
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  subscriptionType: string;
};

const translations = {
  en: {
    title: 'Submit Payment Information',
    description: 'Enter your Binance Pay transaction details to upgrade your subscription',
    transactionId: 'Transaction ID',
    transactionIdPlaceholder: 'Enter your Binance transaction ID',
    binanceAccount: 'Your Binance Account (optional)',
    binanceAccountPlaceholder: 'Your Binance account ID/email (optional)',
    binanceInfo: 'Please send the payment to:',
    binanceId: 'Binance ID: 384371330',
    binanceEmail: 'Email: hassad.med.achraf@gmail.com',
    instructions: 'After sending the payment, submit the transaction ID here. We will verify your payment and activate your subscription.',
    submit: 'Submit Payment Details',
    cancel: 'Cancel',
    processing: 'Processing...',
    successMessage: 'Payment details submitted! Your subscription will be activated after verification.',
    errorMessage: 'Failed to submit payment details. Please try again.',
    pendingMessage: 'Your subscription is now pending approval.',
  },
  fr: {
    title: 'Soumettre les informations de paiement',
    description: 'Entrez les détails de votre transaction Binance Pay pour mettre à niveau votre abonnement',
    transactionId: 'ID de transaction',
    transactionIdPlaceholder: 'Entrez votre ID de transaction Binance',
    binanceAccount: 'Votre compte Binance (facultatif)',
    binanceAccountPlaceholder: 'Votre ID/email de compte Binance (facultatif)',
    binanceInfo: 'Veuillez envoyer le paiement à:',
    binanceId: 'Binance ID: 384371330',
    binanceEmail: 'Email: hassad.med.achraf@gmail.com',
    instructions: 'Après avoir envoyé le paiement, soumettez l\'ID de transaction ici. Nous vérifierons votre paiement et activerons votre abonnement.',
    submit: 'Soumettre les détails du paiement',
    cancel: 'Annuler',
    processing: 'Traitement en cours...',
    successMessage: 'Détails de paiement soumis! Votre abonnement sera activé après vérification.',
    errorMessage: 'Échec de la soumission des détails de paiement. Veuillez réessayer.',
    pendingMessage: 'Votre abonnement est maintenant en attente d\'approbation.',
  }
};

const PaymentModal = ({ isOpen, onClose, subscriptionType }: PaymentModalProps) => {
  const { user, refreshUser } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [transactionId, setTransactionId] = useState('');
  const [binanceAccount, setBinanceAccount] = useState('');
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
      // For demo purposes, we'll update the local storage user object
      // In a real app, this would be a Supabase update
      const updatedUser = {
        ...user,
        subscription_status: 'pending',
        requested_subscription: subscriptionType
      };
      
      localStorage.setItem('sahlaUser', JSON.stringify(updatedUser));
      
      // Send notification to Telegram via the edge function
      const response = await supabase.functions.invoke('telegram-notification', {
        body: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          subscriptionType,
          transactionId,
          binanceId: binanceAccount.includes('@') ? undefined : binanceAccount,
          binanceEmail: binanceAccount.includes('@') ? binanceAccount : undefined
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Refresh the user to get updated subscription status
      if (refreshUser) {
        await refreshUser();
      }
      
      toast(language === 'en' ? 'Success' : 'Succès', {
        description: t.pendingMessage
      });
      onClose();
    } catch (error) {
      console.error('Payment submission error:', error);
      toast(language === 'en' ? 'Error' : 'Erreur', {
        description: t.errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-3 rounded-md mb-4">
          <p className="font-medium text-sm mb-2">{t.binanceInfo}</p>
          <p className="text-sm">{t.binanceId}</p>
          <p className="text-sm">{t.binanceEmail}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {t.instructions}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transactionId">{t.transactionId} *</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={t.transactionIdPlaceholder}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="binanceAccount">{t.binanceAccount}</Label>
              <Input
                id="binanceAccount"
                value={binanceAccount}
                onChange={(e) => setBinanceAccount(e.target.value)}
                placeholder={t.binanceAccountPlaceholder}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t.processing : t.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
