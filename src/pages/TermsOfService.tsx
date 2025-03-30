
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfService = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">← {language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}</Link>
          </Button>
          <h1 className="text-3xl font-bold mb-4">{t('termsOfService')}</h1>
          <div className="prose max-w-none">
            {language === 'en' ? (
              <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  These Terms of Service ("Terms") govern your access to and use of Sahla-Track services. By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <h2>Use of Our Services</h2>
                <p>
                  You must follow any policies made available to you within the Services. You may use our Services only as permitted by law. We may suspend or stop providing our Services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct.
                </p>
                <h2>Your Sahla-Track Account</h2>
                <p>
                  You need a Sahla-Track Account to use our services. You are responsible for maintaining the security of your account and password. Sahla-Track cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
                </p>
                <h2>Subscription and Payments</h2>
                <p>
                  Some of our services require payment. Payment terms will be specified at the time of purchase. Subscription fees are non-refundable except as required by law.
                </p>
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at support@sahla-track.com.
                </p>
              </>
            ) : (
              <>
                <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  Ces Conditions d'Utilisation ("Conditions") régissent votre accès et votre utilisation des services Sahla-Track. En accédant ou en utilisant nos services, vous acceptez d'être lié par ces Conditions.
                </p>
                <h2>Utilisation de nos services</h2>
                <p>
                  Vous devez suivre toutes les politiques mises à votre disposition dans les Services. Vous ne pouvez utiliser nos Services que dans la mesure permise par la loi. Nous pouvons suspendre ou arrêter de vous fournir nos Services si vous ne respectez pas nos conditions ou politiques ou si nous enquêtons sur une suspicion de mauvaise conduite.
                </p>
                <h2>Votre compte Sahla-Track</h2>
                <p>
                  Vous avez besoin d'un compte Sahla-Track pour utiliser nos services. Vous êtes responsable du maintien de la sécurité de votre compte et de votre mot de passe. Sahla-Track ne peut pas et ne sera pas responsable des pertes ou dommages résultant de votre non-respect de cette obligation de sécurité.
                </p>
                <h2>Abonnement et paiements</h2>
                <p>
                  Certains de nos services nécessitent un paiement. Les conditions de paiement seront précisées au moment de l'achat. Les frais d'abonnement ne sont pas remboursables, sauf si la loi l'exige.
                </p>
                <h2>Nous contacter</h2>
                <p>
                  Si vous avez des questions concernant ces Conditions, veuillez nous contacter à support@sahla-track.com.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
