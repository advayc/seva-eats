import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useOrders, ORDER_STATUS_LABELS, ORDER_STATUS_ORDER, type Order } from '@/context';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const currentStatusIndex = ORDER_STATUS_ORDER.indexOf(order.status);
  const isActive = order.status !== 'delivered';
  const progressPercent = ((currentStatusIndex + 1) / ORDER_STATUS_ORDER.length) * 100;

  return (
    <Pressable style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <MaterialIcons name="storefront" size={18} color={Colors.light.text} />
          <Text style={styles.orderStoreName}>{order.storeName}</Text>
        </View>
        <Text style={styles.orderDate}>{formatDate(order.placedAt)}</Text>
      </View>

      {isActive && (
        <>
          <Text style={styles.orderStatus}>{ORDER_STATUS_LABELS[order.status]}</Text>
          <Text style={styles.orderEta}>
            Arriving at {formatTime(order.estimatedDelivery)}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </>
      )}

      <View style={styles.orderItemsList}>
        {order.items.slice(0, 2).map((item) => (
          <Text key={item.menuItem.id} style={styles.orderItemText}>
            {item.quantity}x {item.menuItem.name}
          </Text>
        ))}
        {order.items.length > 2 && (
          <Text style={styles.orderItemText}>+{order.items.length - 2} more items</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
        <View style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>{isActive ? 'Track Order' : 'View Details'}</Text>
          <MaterialIcons name="chevron-right" size={16} color={Colors.light.text} />
        </View>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, activeOrder } = useOrders();

  const pastOrders = orders.filter((order) => order.status === 'delivered');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Orders</Text>

        {activeOrder ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Order</Text>
            <OrderCard
              order={activeOrder}
              onPress={() => router.push(`/order/${activeOrder.id}` as const)}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="receipt-long" size={48} color={Colors.light.border} />
            <Text style={styles.emptyTitle}>No active orders</Text>
            <Text style={styles.emptyText}>
              Place an order to track it here
            </Text>
            <Pressable style={styles.browseButton} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.browseButtonText}>Browse Stores</Text>
            </Pressable>
          </View>
        )}

        {pastOrders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Past Orders</Text>
            {pastOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => router.push(`/order/${order.id}` as const)}
              />
            ))}
          </View>
        )}

        {orders.length === 0 && (
          <View style={styles.section}>
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderTitle}>No order history</Text>
              <Text style={styles.placeholderText}>
                Your completed orders will appear here.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  orderCard: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderStoreName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  orderEta: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginBottom: Spacing.sm,
  },
  progressTrack: {
    height: 4,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.light.success,
  },
  orderItemsList: {
    marginBottom: Spacing.md,
  },
  orderItemText: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: Spacing.md,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.mutedText,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  browseButton: {
    backgroundColor: Colors.light.text,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  browseButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
});
