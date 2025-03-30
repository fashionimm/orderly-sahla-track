
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define available languages
export type LanguageType = 'en' | 'fr';

// Define our translations
export const translations = {
  en: {
    // Navigation & Buttons
    signIn: "Sign In",
    getStarted: "Get Started",
    learnMore: "Learn More",
    startForFree: "Start for Free",
    
    // Hero Section
    heroTitle: "Sahla-Track",
    heroSubtitle: "The simplest way to track and manage your orders for Algerian businesses",
    
    // Features Section
    featuresTitle: "Features",
    feature1Title: "Simple Order Management",
    feature1Desc: "Create, track, and manage orders with just a few clicks. Keep all your delivery information in one place.",
    feature2Title: "Insightful Dashboard",
    feature2Desc: "Get a quick overview of your orders, customers, and business performance at a glance.",
    feature3Title: "Affordable Plans",
    feature3Desc: "Start with our free plan and upgrade as your business grows. Transparent pricing with Binance Pay support.",
    
    // Pricing Section
    pricingTitle: "Simple Pricing",
    freePlan: "Free Plan",
    premiumPlan: "Premium Plan",
    unlimitedPlan: "Unlimited Plan",
    month: "/month",
    popular: "POPULAR",
    
    // Free Plan Features
    freeFeature1: "20 orders per month",
    freeFeature2: "Basic features",
    freeFeature3: "Email support",
    
    // Premium Plan Features
    premiumFeature1: "500 orders per month",
    premiumFeature2: "All Free features",
    premiumFeature3: "Priority support",
    premiumFeature4: "Advanced analytics",
    
    // Unlimited Plan Features
    unlimitedFeature1: "Unlimited orders",
    unlimitedFeature2: "All Premium features",
    unlimitedFeature3: "API access",
    unlimitedFeature4: "Dedicated support",
    
    // Footer
    footerDesc: "The simplest way to track and manage your orders for Algerian businesses.",
    product: "Product",
    company: "Company",
    support: "Support",
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    helpCenter: "Help Center",
    terms: "Terms",
    documentation: "Documentation",
    copyright: "© {year} Sahla-Track. All rights reserved.",
    
    // Policies
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy"
  },
  fr: {
    // Navigation & Buttons
    signIn: "Se Connecter",
    getStarted: "Commencer",
    learnMore: "En Savoir Plus",
    startForFree: "Commencer Gratuitement",
    
    // Hero Section
    heroTitle: "Sahla-Track",
    heroSubtitle: "La façon la plus simple de suivre et de gérer vos commandes pour les entreprises algériennes",
    
    // Features Section
    featuresTitle: "Fonctionnalités",
    feature1Title: "Gestion Simple des Commandes",
    feature1Desc: "Créez, suivez et gérez vos commandes en quelques clics. Gardez toutes vos informations de livraison en un seul endroit.",
    feature2Title: "Tableau de Bord Perspicace",
    feature2Desc: "Obtenez un aperçu rapide de vos commandes, clients et performances commerciales en un coup d'œil.",
    feature3Title: "Plans Abordables",
    feature3Desc: "Commencez avec notre plan gratuit et évoluez à mesure que votre entreprise se développe. Tarification transparente avec support Binance Pay.",
    
    // Pricing Section
    pricingTitle: "Tarification Simple",
    freePlan: "Plan Gratuit",
    premiumPlan: "Plan Premium",
    unlimitedPlan: "Plan Illimité",
    month: "/mois",
    popular: "POPULAIRE",
    
    // Free Plan Features
    freeFeature1: "20 commandes par mois",
    freeFeature2: "Fonctionnalités de base",
    freeFeature3: "Support par email",
    
    // Premium Plan Features
    premiumFeature1: "500 commandes par mois",
    premiumFeature2: "Toutes les fonctionnalités gratuites",
    premiumFeature3: "Support prioritaire",
    premiumFeature4: "Analyses avancées",
    
    // Unlimited Plan Features
    unlimitedFeature1: "Commandes illimitées",
    unlimitedFeature2: "Toutes les fonctionnalités Premium",
    unlimitedFeature3: "Accès API",
    unlimitedFeature4: "Support dédié",
    
    // Footer
    footerDesc: "La façon la plus simple de suivre et de gérer vos commandes pour les entreprises algériennes.",
    product: "Produit",
    company: "Entreprise",
    support: "Support",
    features: "Fonctionnalités",
    pricing: "Tarification",
    faq: "FAQ",
    about: "À Propos",
    contact: "Contact",
    privacy: "Confidentialité",
    helpCenter: "Centre d'Aide",
    terms: "Conditions",
    documentation: "Documentation",
    copyright: "© {year} Sahla-Track. Tous droits réservés.",
    
    // Policies
    privacyPolicy: "Politique de Confidentialité",
    termsOfService: "Conditions d'Utilisation",
    cookiePolicy: "Politique de Cookies"
  }
};

type ContextType = {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<ContextType>({
  language: 'fr',  // Change default to French
  setLanguage: () => {},
  t: (key) => key.toString(),
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get language from localStorage if available, otherwise default to 'fr'
  const [language, setLanguage] = useState<LanguageType>(() => {
    const savedLanguage = localStorage.getItem('sahlaTrackLanguage');
    return (savedLanguage as LanguageType) || 'fr';  // Change default to French
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('sahlaTrackLanguage', language);
  }, [language]);

  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    const translation = translations[language][key];
    
    // Handle dynamic year in copyright text
    if (key === 'copyright') {
      return translation.replace('{year}', new Date().getFullYear().toString());
    }
    
    return translation || key.toString();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
