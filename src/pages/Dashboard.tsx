
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, AlertTriangle, BarChart2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatbotWidget from '@/components/chat/ChatbotWidget';
import { useIsMobile } from '@/hooks/use-mobile';

// Add dashboard translations
const dashboardTranslations = {
  en: {
    dashboard: "Dashboard",
    welcomeBack: "Welcome back",
    newOrder: "New Order",
    aiAssistant: "AI Assistant",
    totalOrders: "Total Orders",
    pending: "pending",
    shipped: "shipped",
    delivered: "delivered",
    customers: "Customers",
    uniquePhoneNumbers: "Unique phone numbers in your database",
    ordersThisMonth: "Orders This Month",
    inYourFreePlan: "in your Free Plan",
    withYourPremiumPlan: "with your Premium Plan",
    performance: "Performance",
    deliverySuccessRate: "Delivery success rate",
    recentOrders: "Recent Orders",
    noOrdersYet: "No orders yet",
    createFirstOrder: "Create your first order",
    orderId: "Order ID",
    customer: "Customer",
    city: "City",
    status: "Status",
    date: "Date",
    limitWarning: "You've used {used} of {limit} orders in your plan.",
    upgradeMessage: "Upgrade to Premium for unlimited orders"
  },
  fr: {
    dashboard: "Tableau de Bord",
    welcomeBack: "Bienvenue",
    newOrder: "Nouvelle Commande",
    aiAssistant: "Assistant IA",
    totalOrders: "Total des Commandes",
    pending: "en attente",
    shipped: "expédiée",
    delivered: "livrée",
    customers: "Clients",
    uniquePhoneNumbers: "Numéros de téléphone uniques dans votre base de données",
    ordersThisMonth: "Commandes ce Mois",
    inYourFreePlan: "dans votre Plan Gratuit",
    withYourPremiumPlan: "avec votre Plan Premium",
    performance: "Performance",
    deliverySuccessRate: "Taux de réussite de livraison",
    recentOrders: "Commandes Récentes",
    noOrdersYet: "Pas encore de commandes",
    createFirstOrder: "Créez votre première commande",
    orderId: "ID Commande",
    customer: "Client",
    city: "Ville",
    status: "Statut",
    date: "Date",
    limitWarning: "Vous avez utilisé {used} sur {limit} commandes de votre forfait.",
    upgradeMessage: "Passez à Premium pour des commandes illimitées"
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [showChatbot, setShowChatbot] = useState(false);
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  
  // Get dashboard translations based on language
  const dt = dashboardTranslations[language];
  
  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  
  // Calculate unique customers
  const uniqueCustomers = new Set(orders.map(order => order.phoneNumber)).size;
  
  // Get recent orders
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  // Check if user is close to order limit
  const isNearLimit = user && user.subscription === 'free' && 
    user.ordersUsed >= (user.orderLimit * 0.8);

  // Check if user has premium features
  const hasPremiumAccess = user && (user.subscription === 'premium' || user.subscription === 'unlimited');

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 sm:pb-10 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-sahla-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sahla-600 to-sahla-800 animate-gradient">
              {dt.dashboard}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {dt.welcomeBack}, <span className="font-medium">{user?.name || 'User'}!</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {hasPremiumAccess && (
            <Button 
              variant="outline" 
              onClick={() => setShowChatbot(!showChatbot)}
              className="flex items-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
              size={isMobile ? "sm" : "default"}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sahla-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sahla-500"></span>
              </span>
              {dt.aiAssistant}
            </Button>
          )}
          <Button 
            asChild 
            className="bg-sahla-500 hover:bg-sahla-600 w-full sm:w-auto text-xs sm:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <Link to="/orders/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              {dt.newOrder}
            </Link>
          </Button>
        </div>
      </div>
      
      {isNearLimit && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                {dt.limitWarning.replace('{used}', String(user.ordersUsed)).replace('{limit}', String(user.orderLimit))}
              </p>
              <Link to="/subscription" className="text-xs text-amber-600 hover:underline">
                {dt.upgradeMessage}
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
            <CardTitle className="text-sm font-medium">{dt.totalOrders}</CardTitle>
            <Package className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex mt-2 gap-2 flex-wrap">
              <span className="sahla-badge-pending text-xs">{pendingOrders} {dt.pending}</span>
              <span className="sahla-badge-shipped text-xs">{shippedOrders} {dt.shipped}</span>
              <span className="sahla-badge-delivered text-xs">{deliveredOrders} {dt.delivered}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
            <CardTitle className="text-sm font-medium">{dt.customers}</CardTitle>
            <Users className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dt.uniquePhoneNumbers}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
            <CardTitle className="text-sm font-medium">{dt.ordersThisMonth}</CardTitle>
            <TrendingUp className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.subscription === 'free' 
                ? `${user.ordersUsed}/${user.orderLimit} ${dt.inYourFreePlan}` 
                : dt.withYourPremiumPlan}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
            <CardTitle className="text-sm font-medium">{dt.performance}</CardTitle>
            <BarChart2 className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-2xl font-bold">
              {deliveredOrders > 0 
                ? Math.round((deliveredOrders / totalOrders) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dt.deliverySuccessRate}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-3 sm:mb-4 text-sahla-700">{dt.recentOrders}</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border shadow">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sahla-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">{dt.orderId}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">{dt.customer}</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">{dt.city}</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">{dt.status}</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">{dt.date}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-sahla-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm font-medium text-sahla-700">{order.orderId}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{order.customerName}</td>
                      <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{order.city}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`sahla-badge-${order.status} text-xs`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="p-6 sm:p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">{dt.noOrdersYet}</p>
              <Button asChild className="mt-4 bg-sahla-500 hover:bg-sahla-600">
                <Link to="/orders/new">{dt.createFirstOrder}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {showChatbot && hasPremiumAccess && (
        <ChatbotWidget onClose={() => setShowChatbot(false)} />
      )}
    </div>
  );
};

export default Dashboard;
