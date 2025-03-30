
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/orders/new">New Order</Link>
        </Button>
      </div>
      
      {isNearLimit && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex mt-2 justify-between">
              <span className="sahla-badge-pending">{pendingOrders} pending</span>
              <span className="sahla-badge-shipped">{shippedOrders} shipped</span>
              <span className="sahla-badge-delivered">{deliveredOrders} delivered</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique phone numbers in your order database
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
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
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="sahla-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.orderId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.city}</td>
                    <td>
                      <span className={`sahla-badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No orders yet</p>
              <Button asChild className="mt-4">
                <Link to="/orders/new">Create your first order</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
