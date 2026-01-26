import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

import { useOrders, ORDER_STATUS_LABELS, ORDER_STATUS_ORDER, type OrderStatus } from '@/context';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, orders } = useOrders();
  const [order, setOrder] = useState(getOrder(id ?? ''));

  // Re-fetch order when orders change (for status updates)
  useEffect(() => {
    if (id) {
      setOrder(getOrder(id));
    }
  }, [id, orders, getOrder]);

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Order Not Found</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStatusIndex = ORDER_STATUS_ORDER.indexOf(order.status);

  // Calculate map region to show both store and delivery
  const storeLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
  };
  const deliveryLocation = order.deliveryLocation;
  const driverLocation = order.driverLocation;

  const midLat = (storeLocation.latitude + deliveryLocation.latitude) / 2;
  const midLng = (storeLocation.longitude + deliveryLocation.longitude) / 2;
  const latDelta = Math.abs(storeLocation.latitude - deliveryLocation.latitude) * 1.5;
  const lngDelta = Math.abs(storeLocation.longitude - deliveryLocation.longitude) * 1.5;

  const routeCoordinates = [
    storeLocation,
    ...(driverLocation ? [driverLocation] : []),
    { latitude: deliveryLocation.latitude, longitude: deliveryLocation.longitude },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: midLat,
              longitude: midLng,
              latitudeDelta: Math.max(latDelta, 0.02),
              longitudeDelta: Math.max(lngDelta, 0.02),
            }}>
            {/* Store Marker */}
            <Marker coordinate={storeLocation} title={order.storeName}>
              <View style={styles.markerStore}>
                <MaterialIcons name="storefront" size={16} color={Colors.light.background} />
              </View>
            </Marker>

            {/* Delivery Location Marker */}
            <Marker
              coordinate={{
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
              }}
              title="Delivery Address">
              <View style={styles.markerDelivery}>
                <MaterialIcons name="home" size={16} color={Colors.light.background} />
              </View>
            </Marker>

            {/* Driver Marker (if on the way) */}
            {driverLocation && order.status === 'on_the_way' && (
              <Marker coordinate={driverLocation} title="Driver">
                <View style={styles.markerDriver}>
                  <MaterialIcons name="delivery-dining" size={16} color={Colors.light.background} />
                </View>
              </Marker>
            )}

            {/* Route Line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={Colors.light.text}
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
          </MapView>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{ORDER_STATUS_LABELS[order.status]}</Text>
          <Text style={styles.statusSubtitle}>
            Estimated arrival: {formatTime(order.estimatedDelivery)}
          </Text>

          {/* Progress Steps */}
          <View style={styles.progressSteps}>
            {ORDER_STATUS_ORDER.slice(0, 5).map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <View key={status} style={styles.progressStep}>
                  <View
                    style={[
                      styles.progressDot,
                      isCompleted && styles.progressDotCompleted,
                      isCurrent && styles.progressDotCurrent,
                    ]}>
                    {isCompleted && (
                      <MaterialIcons name="check" size={12} color={Colors.light.background} />
                    )}
                  </View>
                  {index < 4 && (
                    <View
                      style={[styles.progressLine, isCompleted && styles.progressLineCompleted]}
                    />
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Placed</Text>
            <Text style={styles.progressLabel}>Prep</Text>
            <Text style={styles.progressLabel}>Ready</Text>
            <Text style={styles.progressLabel}>Picked</Text>
            <Text style={styles.progressLabel}>Delivered</Text>
          </View>
        </View>

        {/* Order Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <MaterialIcons name="storefront" size={20} color={Colors.light.text} />
            <Text style={styles.detailsStoreName}>{order.storeName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsList}>
            {order.items.map((item) => (
              <View key={item.menuItem.id} style={styles.orderItem}>
                <Text style={styles.orderItemQty}>{item.quantity}x</Text>
                <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
                <Text style={styles.orderItemPrice}>{item.menuItem.priceDisplay}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(order.deliveryFee)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <MaterialIcons name="location-on" size={20} color={Colors.light.text} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <Text style={styles.addressText}>{order.deliveryLocation.address}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surfaceElevated,
  },
  iconButtonPlaceholder: {
    width: 36,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: 40,
  },
  mapContainer: {
    height: 200,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  map: {
    flex: 1,
  },
  markerStore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDelivery: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDriver: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: Spacing.lg,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotCompleted: {
    backgroundColor: Colors.light.success,
  },
  progressDotCurrent: {
    backgroundColor: Colors.light.text,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.light.border,
  },
  progressLineCompleted: {
    backgroundColor: Colors.light.success,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: Colors.light.mutedText,
    width: 50,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailsStoreName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.md,
  },
  itemsList: {
    gap: Spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemQty: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    width: 30,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  orderItemPrice: {
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
});
