import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { ORDER_STATUS_LABELS, ORDER_STATUS_ORDER, useOrders } from '@/context';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, orders } = useOrders();
  const [order, setOrder] = useState(getOrder(id ?? ''));
  const [isMapExpanded, setIsMapExpanded] = useState(false);

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
          <Text style={styles.headerTitle}>Request Not Found</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }

  const currentStatusIndex = ORDER_STATUS_ORDER.indexOf(order.status);

  // Calculate map region to show both store and delivery
  const storeLocation = order.storeLocation;
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
        <Text style={styles.headerTitle}>Seva Tracking</Text>
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
          
          {/* Expand Map Button */}
          <Pressable style={styles.expandButton} onPress={() => setIsMapExpanded(true)}>
            <MaterialIcons name="fullscreen" size={24} color={Colors.light.text} />
          </Pressable>
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
                <Text style={styles.orderItemPrice}>Seva-supported</Text>
              </View>
            ))}
          </View>

        </View>

        {/* Pickup Location */}
        <View style={styles.addressCard}>
          <MaterialIcons name="storefront" size={20} color={Colors.light.text} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>Pickup Location</Text>
            <Text style={styles.addressText}>{order.storeLocation.address}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <MaterialIcons name="location-on" size={20} color={Colors.light.text} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>Drop-off Address</Text>
            <Text style={styles.addressText}>{order.deliveryLocation.address}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Map Modal */}
      <Modal visible={isMapExpanded} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={styles.fullscreenMapContainer}>
          <MapView
            style={styles.fullscreenMap}
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

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={() => setIsMapExpanded(false)}>
            <MaterialIcons name="close" size={24} color={Colors.light.text} />
          </Pressable>
        </SafeAreaView>
      </Modal>
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
    position: 'relative',
    ...Shadows.card,
  },
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  fullscreenMapContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  fullscreenMap: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
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
    backgroundColor: Colors.light.accent,
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
    color: Colors.light.accent,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
  map: {
    flex: 1,
  },
  markerStore: {
    backgroundColor: Colors.light.accent,
    padding: 8,
    borderRadius: 20,
  },
  markerDelivery: {
    backgroundColor: Colors.light.success,
    padding: 8,
    borderRadius: 20,
  },
  markerDriver: {
    backgroundColor: Colors.light.accent,
    padding: 8,
    borderRadius: 20,
  },
});
