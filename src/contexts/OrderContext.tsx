
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export type Order = {
  id: string;
  orderId: string;
  customerName: string;
  phoneNumber: string;
  city: string;
  status: OrderStatus;
  createdAt: string;
  userId: string;
};

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType>({
  orders: [],
  loading: true,
  addOrder: async () => {},
  updateOrder: async () => {},
  deleteOrder: async () => {},
  getOrderById: () => undefined,
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage on mount
  useEffect(() => {
    if (user) {
      try {
        const storedOrders = localStorage.getItem(`sahlaOrders-${user.id}`);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Save orders to localStorage when they change
  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(`sahlaOrders-${user.id}`, JSON.stringify(orders));
    }
  }, [orders, user]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) {
      toast.error('You must be logged in to add orders');
      return;
    }

    // Check if user is on free plan and has reached limit
    if (user.subscription === 'free' && user.ordersUsed >= user.orderLimit) {
      toast.error('You have reached your order limit. Please upgrade to Premium.');
      return;
    }

    try {
      // Create new order
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userId: user.id,
        ...orderData,
      };

      // Add to state
      setOrders(prevOrders => [newOrder, ...prevOrders]);

      // Update user's order count
      const updatedUser = {
        ...user,
        ordersUsed: user.ordersUsed + 1
      };
      localStorage.setItem('sahlaUser', JSON.stringify(updatedUser));

      toast.success('Order added successfully');
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, ...updates } : order
        )
      );
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      toast.success('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
