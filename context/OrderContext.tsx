import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { CartItem, DeliveryLocation, Order, OrderStatus, StoreLocation } from './types';

type OrderContextType = {
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (
    items: CartItem[],
    storeId: string,
    storeName: string,
    subtotal: number,
    deliveryFee: number,
    deliveryLocation: DeliveryLocation,
    storeLocation: StoreLocation
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
};

const OrderContext = createContext<OrderContextType | null>(null);

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = useCallback(
    (
      items: CartItem[],
      storeId: string,
      storeName: string,
      subtotal: number,
      deliveryFee: number,
      deliveryLocation: DeliveryLocation,
      storeLocation: StoreLocation
    ): Order => {
      const now = new Date();
      const estimatedDelivery = new Date(now.getTime() + 45 * 60 * 1000); // 45 mins

      const newOrder: Order = {
        id: generateOrderId(),
        storeId,
        storeName,
        storeLocation,
        items: [...items],
        status: 'placed',
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        placedAt: now,
        estimatedDelivery,
        deliveryLocation,
        driverLocation: {
          latitude: storeLocation.latitude,
          longitude: storeLocation.longitude,
        },
        statusHistory: [{ status: 'placed', timestamp: now }],
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Simulate order progression
      simulateOrderProgression(newOrder.id);

      return newOrder;
    },
    []
  );

  const simulateOrderProgression = useCallback((orderId: string) => {
    const statusProgression: { status: OrderStatus; delay: number }[] = [
      { status: 'confirmed', delay: 3000 },
      { status: 'preparing', delay: 8000 },
      { status: 'ready_for_pickup', delay: 15000 },
      { status: 'picked_up', delay: 20000 },
      { status: 'on_the_way', delay: 25000 },
      { status: 'delivered', delay: 40000 },
    ];

    statusProgression.forEach(({ status, delay }) => {
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((order) => {
            if (order.id !== orderId) return order;
            if (order.status === 'delivered') return order; // Already delivered
            
            const now = new Date();
            return {
              ...order,
              status,
              statusHistory: [...order.statusHistory, { status, timestamp: now }],
              // Simulate driver movement
              driverLocation:
                status === 'on_the_way'
                  ? {
                      latitude: (order.storeLocation.latitude + order.deliveryLocation.latitude) / 2,
                      longitude: (order.storeLocation.longitude + order.deliveryLocation.longitude) / 2,
                    }
                  : status === 'delivered'
                  ? {
                      latitude: order.deliveryLocation.latitude,
                      longitude: order.deliveryLocation.longitude,
                    }
                  : order.driverLocation,
            };
          })
        );
      }, delay);
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const now = new Date();
        return {
          ...order,
          status,
          statusHistory: [...order.statusHistory, { status, timestamp: now }],
        };
      })
    );
  }, []);

  const getOrder = useCallback(
    (orderId: string) => orders.find((order) => order.id === orderId),
    [orders]
  );

  const activeOrder = useMemo(
    () => orders.find((order) => order.status !== 'delivered') ?? null,
    [orders]
  );

  const value = useMemo(
    () => ({
      orders,
      activeOrder,
      placeOrder,
      updateOrderStatus,
      getOrder,
    }),
    [orders, activeOrder, placeOrder, updateOrderStatus, getOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
