
import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  
  // Add nice animation to the avatar fallback
  const getRandomHue = () => Math.floor(Math.random() * 360);
  const [hue] = React.useState(getRandomHue());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card px-4 shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="mr-2" />
        <span className="text-lg font-bold text-sahla-700 md:hidden">
          Sahla-Track
        </span>
      </div>
      
      <div className="ml-auto flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
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
              Profile
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <a href="/admin">Admin Panel</a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
