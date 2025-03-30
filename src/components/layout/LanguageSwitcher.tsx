
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = {
  en: {
    name: 'English',
    flag: '🇬🇧'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷'
  }
};

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-all hover:scale-105 h-8 px-2"
        >
          <Globe size={16} className="mr-1" />
          <span className="uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, details]) => (
          <DropdownMenuItem 
            key={code} 
            onClick={() => setLanguage(code as 'en' | 'fr')}
            className={language === code ? "bg-muted font-medium" : ""}
          >
            <span className="mr-2">{details.flag}</span>
            {details.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
