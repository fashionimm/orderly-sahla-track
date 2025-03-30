
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">← {language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}</Link>
          </Button>
          <h1 className="text-3xl font-bold mb-4">{t('privacyPolicy')}</h1>
          <div className="prose max-w-none">
            {language === 'en' ? (
              <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  Sahla-Track ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Sahla-Track.
                </p>
                <h2>Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, such as when you create an account, subscribe to our service, or contact our customer support. This may include your name, email address, phone number, and payment information.
                </p>
                <h2>How We Use Your Information</h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, process your transactions, communicate with you, and comply with legal obligations.
                </p>
                <h2>Cookies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience, gather information about users, and improve our services.
                </p>
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at support@sahla-track.com.
                </p>
              </>
            ) : (
              <>
                <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  Sahla-Track ("nous", "notre" ou "nos") s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment vos informations personnelles sont collectées, utilisées et divulguées par Sahla-Track.
                </p>
                <h2>Informations que nous collectons</h2>
                <p>
                  Nous collectons les informations que vous nous fournissez directement, comme lorsque vous créez un compte, vous abonnez à notre service, ou contactez notre service client. Cela peut inclure votre nom, adresse e-mail, numéro de téléphone et informations de paiement.
                </p>
                <h2>Comment nous utilisons vos informations</h2>
                <p>
                  Nous utilisons les informations que nous collectons pour fournir, maintenir et améliorer nos services, traiter vos transactions, communiquer avec vous et respecter les obligations légales.
                </p>
                <h2>Cookies</h2>
                <p>
                  Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, recueillir des informations sur les utilisateurs et améliorer nos services.
                </p>
                <h2>Nous contacter</h2>
                <p>
                  Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter à support@sahla-track.com.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
