
import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

// Header translations
const headerTranslations = {
  en: {
    profile: "Profile",
    adminPanel: "Admin Panel",
    logout: "Log out",
    home: "Home",
    features: "Features",
    pricing: "Pricing",
    contact: "Contact"
  },
  fr: {
    profile: "Profil",
    adminPanel: "Panneau d'Administration",
    logout: "Déconnexion",
    home: "Accueil",
    features: "Fonctionnalités",
    pricing: "Tarifs",
    contact: "Contact"
  }
};

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { language } = useLanguage();
  
  // Get translations
  const t = headerTranslations[language];
  
  // Add nice animation to the avatar fallback
  const getRandomHue = () => Math.floor(Math.random() * 360);
  const [hue] = React.useState(getRandomHue());

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center border-b bg-card px-2 sm:px-4 shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2" />
        <span className="text-lg font-bold text-sahla-700 md:hidden">
          Sahla-Track
        </span>
      </div>
      
      {/* Navigation Menu */}
      <div className="hidden md:flex ml-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t.home}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/#features">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t.features}
                </NavigationMenuLink>
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/#pricing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t.pricing}
                </NavigationMenuLink>
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="/#contact">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t.contact}
                </NavigationMenuLink>
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
        <LanguageSwitcher />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback 
                  className={cn(
                    "bg-sahla-500 text-white",
                    "transition-all hover:scale-105"
                  )}
                  style={{ 
                    background: `linear-gradient(135deg, hsl(${hue}, 80%, 60%), hsl(${hue + 60}, 80%, 60%))` 
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {t.profile}
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <a href="/admin">{t.adminPanel}</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
