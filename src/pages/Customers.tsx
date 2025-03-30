
import React, { useMemo } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
  lastOrderDate: string;
};

const Customers = () => {
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  // Process orders to get unique customers
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();
    
    orders.forEach(order => {
      const phone = order.phoneNumber;
      
      if (customerMap.has(phone)) {
        const customer = customerMap.get(phone)!;
        const orderDate = new Date(order.createdAt);
        const lastOrderDate = new Date(customer.lastOrderDate);
        
        customerMap.set(phone, {
          ...customer,
          totalOrders: customer.totalOrders + 1,
          lastOrderDate: orderDate > lastOrderDate ? order.createdAt : customer.lastOrderDate
        });
      } else {
        customerMap.set(phone, {
          id: `customer-${phone}`,
          name: order.customerName,
          phone: order.phoneNumber,
          city: order.city,
          totalOrders: 1,
          lastOrderDate: order.createdAt
        });
      }
    });
    
    return Array.from(customerMap.values());
  }, [orders]);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          View and manage your customer information
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                {searchTerm ? 'No customers match your search' : 'No customers found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
