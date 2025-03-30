
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, Package, Users, Settings, CreditCard, BarChart3, 
  ShoppingCart, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import SubscriptionInfo from '@/components/subscription/SubscriptionInfo';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarProvider
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
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
  
  const renderSidebarContent = () => (
    <>
      <SidebarHeader className="flex h-16 items-center px-4 border-b">
        <div className="flex items-center">
          <span className="text-lg font-bold text-sahla-700 transition-all duration-300 font-logo animate-text">
            Sahla-Track
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2">
        <SidebarMenu className="px-2 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={link.label}
                >
                  <NavLink
                    to={link.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                      isActive 
                        ? "bg-sahla-100 text-sahla-800 font-medium" 
                        : "text-slate-600 hover:bg-sahla-50 hover:text-sahla-700"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-sahla-600" : "text-slate-400")} />
                    {link.label}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t mt-auto">
        <div className="space-y-2">
          <SubscriptionInfo />
          <SidebarMenuButton asChild>
            <NavLink
              to="/settings"
              className={cn(
                "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                location.pathname === "/settings" 
                  ? "bg-sahla-100 text-sahla-800 font-medium" 
                  : "text-slate-600 hover:bg-sahla-50 hover:text-sahla-700"
              )}
            >
              <Settings className="h-5 w-5 mr-3 text-slate-400" />
              Settings
            </NavLink>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <ShadcnSidebar 
        variant="floating" 
        collapsible="offcanvas"
      >
        {renderSidebarContent()}
      </ShadcnSidebar>
    );
  }

  return (
    <ShadcnSidebar 
      variant="sidebar" 
      collapsible="icon"
    >
      {renderSidebarContent()}
    </ShadcnSidebar>
  );
};

export default Sidebar;
