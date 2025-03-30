
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, AlertTriangle, BarChart2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatbotWidget from '@/components/chat/ChatbotWidget';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [showChatbot, setShowChatbot] = useState(false);
  const isMobile = useIsMobile();
  
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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-sahla-800">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sahla-600 to-sahla-800 animate-gradient">
              Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium">{user?.name || 'User'}!</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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
              AI Assistant
            </Button>
          )}
          <Button 
            asChild 
            className="bg-sahla-500 hover:bg-sahla-600 w-full sm:w-auto text-xs sm:text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <Link to="/orders/new" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Order
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
                You've used {user.ordersUsed} of {user.orderLimit} orders in your plan.
              </p>
              <Link to="/subscription" className="text-xs text-amber-600 hover:underline">
                Upgrade to Premium for unlimited orders
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex mt-2 gap-2 flex-wrap">
              <span className="sahla-badge-pending text-xs">{pendingOrders} pending</span>
              <span className="sahla-badge-shipped text-xs">{shippedOrders} shipped</span>
              <span className="sahla-badge-delivered text-xs">{deliveredOrders} delivered</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique phone numbers in your database
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.subscription === 'free' 
                ? `${user.ordersUsed}/${user.orderLimit} in your Free Plan` 
                : 'Unlimited with your Premium Plan'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-sahla-50 to-white border-sahla-100 shadow hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart2 className="h-4 w-4 text-sahla-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveredOrders > 0 
                ? Math.round((deliveredOrders / totalOrders) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Delivery success rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4 text-sahla-700">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border shadow">
            <div className="min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sahla-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">Order ID</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">Customer</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">City</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">Status</th>
                    <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-sahla-700 uppercase tracking-wider">Date</th>
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
                      <td className="hidden sm:table-cell px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No orders yet</p>
              <Button asChild className="mt-4 bg-sahla-500 hover:bg-sahla-600">
                <Link to="/orders/new">Create your first order</Link>
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
