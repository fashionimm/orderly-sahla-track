
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-sm font-medium transition-all hover:scale-105"
    >
      <Globe size={16} />
      <span className="uppercase">{language === 'en' ? 'FR' : 'EN'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
