
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CookiePolicy = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-4">
            <Link to="/">← {language === 'en' ? 'Back to Home' : 'Retour à l\'accueil'}</Link>
          </Button>
          <h1 className="text-3xl font-bold mb-4">{t('cookiePolicy')}</h1>
          <div className="prose max-w-none">
            {language === 'en' ? (
              <>
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  This Cookie Policy explains how Sahla-Track uses cookies and similar technologies to recognize you when you visit our website or use our services.
                </p>
                <h2>What are cookies?</h2>
                <p>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </p>
                <h2>How we use cookies</h2>
                <p>
                  We use cookies for several purposes, including to:
                </p>
                <ul>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you interact with our services</li>
                  <li>Improve your browsing experience</li>
                  <li>Enhance the security of our services</li>
                </ul>
                <h2>Your choices</h2>
                <p>
                  Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                </p>
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about our use of cookies, please contact us at support@sahla-track.com.
                </p>
              </>
            ) : (
              <>
                <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
                <h2>Introduction</h2>
                <p>
                  Cette Politique de Cookies explique comment Sahla-Track utilise les cookies et les technologies similaires pour vous reconnaître lorsque vous visitez notre site web ou utilisez nos services.
                </p>
                <h2>Que sont les cookies?</h2>
                <p>
                  Les cookies sont de petits fichiers de données qui sont placés sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Les cookies sont largement utilisés par les propriétaires de sites web pour faire fonctionner leurs sites web, ou pour les faire fonctionner plus efficacement, ainsi que pour fournir des informations de rapport.
                </p>
                <h2>Comment nous utilisons les cookies</h2>
                <p>
                  Nous utilisons les cookies à plusieurs fins, notamment pour:
                </p>
                <ul>
                  <li>Se souvenir de vos préférences et paramètres</li>
                  <li>Comprendre comment vous interagissez avec nos services</li>
                  <li>Améliorer votre expérience de navigation</li>
                  <li>Renforcer la sécurité de nos services</li>
                </ul>
                <h2>Vos choix</h2>
                <p>
                  La plupart des navigateurs web vous permettent de contrôler les cookies via leurs préférences de paramètres. Cependant, si vous limitez la capacité des sites web à définir des cookies, vous risquez de dégrader votre expérience utilisateur globale.
                </p>
                <h2>Nous contacter</h2>
                <p>
                  Si vous avez des questions concernant notre utilisation des cookies, veuillez nous contacter à support@sahla-track.com.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
