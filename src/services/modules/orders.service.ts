
import { apiClient } from '../core/apiClient';
import { Order } from '@/types/order';

export const ordersService = {
  getAll: () => apiClient.get<Order[]>('/orders'),
  getUserOrders: () => apiClient.get<Order[]>('/orders/user'),
  getById: (orderId: string) => apiClient.get<Order>(`/orders/${orderId}`),
  create: (orderData: any) => {
    console.log('Sending order data to server:', JSON.stringify(orderData));
    
    const validatedData = {
      items: Array.isArray(orderData.items) 
        ? orderData.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: Number(item.quantity),
            ...(item.price !== undefined && { price: Number(item.price) }),
            ...(item.originalPrice !== undefined && { originalPrice: Number(item.originalPrice) }),
            ...(item.subtotal !== undefined && { subtotal: Number(item.subtotal) }),
            ...(item.image !== undefined && { image: item.image }),
            ...(item.codePromoApplied !== undefined && { codePromoApplied: item.codePromoApplied }),
          })) 
        : [],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      codePromo: orderData.codePromo,
      // Informations de TVA
      subtotalHT: orderData.subtotalHT !== undefined ? Number(orderData.subtotalHT) : 0,
      taxRate: orderData.taxRate !== undefined ? Number(orderData.taxRate) : 0.20,
      taxAmount: orderData.taxAmount !== undefined ? Number(orderData.taxAmount) : 0,
      deliveryPrice: orderData.deliveryPrice !== undefined ? Number(orderData.deliveryPrice) : 0,
      orderTotal: orderData.orderTotal !== undefined ? Number(orderData.orderTotal) : 0
    };
    
    return apiClient.post<Order>('/orders', validatedData);
  },
  updateStatus: (orderId: string, status: string) => 
    apiClient.put(`/orders/${orderId}/status`, { status }),
  cancelOrder: (orderId: string, itemsToCancel: string[]) => 
    apiClient.post(`/orders/${orderId}/cancel`, { itemsToCancel }),
};
