
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  Home, Package, Users, Settings, CreditCard, BarChart3, 
  ChevronLeft, ShoppingCart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SubscriptionInfo from '@/components/subscription/SubscriptionInfo';

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ];
  
  // Add admin links if user is admin
  if (isAdmin) {
    links.push(
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/admin/orders', label: 'All Orders', icon: ShoppingCart },
      { href: '/admin/users', label: 'Manage Users', icon: Users }
    );
  }
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r shadow-sm transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
          {isOpen ? (
            <h1 className="text-lg font-bold text-sahla-700">Sahla-Track</h1>
          ) : (
            <span className="text-xl font-bold text-sahla-700">S</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hidden md:flex"
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !isOpen && "rotate-180")} />
        </Button>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                  isActive 
                    ? "bg-sahla-100 text-sahla-800 font-medium" 
                    : "text-slate-600 hover:bg-sahla-50 hover:text-sahla-700",
                  !isOpen && "justify-center"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-sahla-600" : "text-slate-400")} />
                {isOpen && <span className="ml-3">{link.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t">
          <SubscriptionInfo />
        </div>
      )}
      
      <div className="p-4 border-t">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center px-2 py-2 text-sm rounded-md text-slate-600 hover:bg-sahla-50 hover:text-sahla-700 transition-colors",
            !isOpen && "justify-center"
          )}
        >
          <Settings className="h-5 w-5 text-slate-400" />
          {isOpen && <span className="ml-3">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
