
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders, OrderStatus } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addOrder, getOrderById, updateOrder } = useOrders();
  
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    phoneNumber: '',
    city: '',
    status: 'pending' as OrderStatus,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load order data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const orderData = getOrderById(id);
      if (orderData) {
        setFormData({
          orderId: orderData.orderId,
          customerName: orderData.customerName,
          phoneNumber: orderData.phoneNumber,
          city: orderData.city,
          status: orderData.status,
        });
      } else {
        toast.error('Order not found');
        navigate('/orders');
      }
    } else {
      // For new orders, generate a random order ID
      setFormData(prev => ({
        ...prev,
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      }));
    }
  }, [id, isEditMode, getOrderById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as OrderStatus }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEditMode && id) {
        await updateOrder(id, formData);
        toast.success('Order updated successfully');
      } else {
        await addOrder(formData);
        toast.success('Order created successfully');
      }
      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Order' : 'Create New Order'}
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    required
                    readOnly={isEditMode}
                    className={isEditMode ? "bg-muted cursor-not-allowed" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  type="tel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/orders')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Order' : 'Create Order'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderForm;
