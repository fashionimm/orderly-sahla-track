
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const PolicyLinks = ({ className = '' }: { className?: string }) => {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
      <Link to="/privacy-policy" className="hover:underline transition-all">
        {t('privacyPolicy')}
      </Link>
      <Link to="/terms-of-service" className="hover:underline transition-all">
        {t('termsOfService')}
      </Link>
      <Link to="/cookie-policy" className="hover:underline transition-all">
        {t('cookiePolicy')}
      </Link>
    </div>
  );
};

export default PolicyLinks;
