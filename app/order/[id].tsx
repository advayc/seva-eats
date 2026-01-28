import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

import { ProofOfDelivery } from '@/components/proof-of-delivery';
import { Radii, Shadows, Spacing } from '@/constants/theme';
import { ORDER_STATUS_LABELS, useOrders } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, orders } = useOrders();
  const [order, setOrder] = useState(getOrder(id ?? ''));
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [proofPhotoUri, setProofPhotoUri] = useState<string | null>(null);
  const [animatedDriverLocation, setAnimatedDriverLocation] = useState(order?.driverLocation || order?.storeLocation);
  const colors = useThemeColors();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Re-fetch order when orders change (for status updates)
  useEffect(() => {
    if (id) {
      setOrder(getOrder(id));
    }
  }, [id, orders, getOrder]);

  // Animate driver movement when on the way
  useEffect(() => {
    if (!order || order.status !== 'on_the_way' || !order.driverLocation) return;

    // Clear any existing animation
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    // Animate movement from current position towards delivery location
    let step = 0;
    const totalSteps = 60; // 60 steps for smooth animation

    animationIntervalRef.current = setInterval(() => {
      step++;
      const progress = Math.min(step / totalSteps, 1);

      const newLat =
        order.storeLocation.latitude +
        (order.deliveryLocation.latitude - order.storeLocation.latitude) * progress;
      const newLng =
        order.storeLocation.longitude +
        (order.deliveryLocation.longitude - order.storeLocation.longitude) * progress;

      setAnimatedDriverLocation({
        latitude: newLat,
        longitude: newLng,
      });

      if (progress >= 1) {
        clearInterval(animationIntervalRef.current!);
      }
    }, 200); // Update every 200ms

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [order?.status, order?.driverLocation, order?.storeLocation, order?.deliveryLocation]);

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Request Not Found</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }

  const progressSteps = [
    { status: 'supply_confirmed', label: 'Supply' },
    { status: 'batch_assigned', label: 'Batch' },
    { status: 'prep_ops', label: 'Prep Ops' },
    { status: 'ready_for_pickup', label: 'Ready' },
    { status: 'picked_up', label: 'Picked' },
    { status: 'delivered', label: 'Delivered' },
  ] as const;

  const progressIndexByStatus: Record<string, number> = {
    placed: 0,
    confirmed: 0,
    preparing: 2,
    on_the_way: 4,
  };

  const currentStatusIndex =
    progressSteps.findIndex((step) => step.status === order.status) >= 0
      ? progressSteps.findIndex((step) => step.status === order.status)
      : progressIndexByStatus[order.status] ?? 0;

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
    ...(animatedDriverLocation ? [animatedDriverLocation] : []),
    { latitude: deliveryLocation.latitude, longitude: deliveryLocation.longitude },
  ];

  const mapStyle = colors.isDark ? darkMapStyle : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.replace('/(tabs)')} style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
          <MaterialIcons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Seva Tracking</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={[styles.mapContainer, shadows.card]}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: midLat,
              longitude: midLng,
              latitudeDelta: Math.max(latDelta, 0.02),
              longitudeDelta: Math.max(lngDelta, 0.02),
            }}>
            {/* Store Marker */}
            <Marker coordinate={storeLocation} title={order.storeName}>
              <View style={[styles.markerStore, { backgroundColor: colors.accent }]}>
                <MaterialIcons name="storefront" size={16} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Delivery Location Marker */}
            <Marker
              coordinate={{
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
              }}
              title="Delivery Address">
              <View style={[styles.markerDelivery, { backgroundColor: colors.success }]}>
                <MaterialIcons name="home" size={16} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Driver Marker (if on the way) */}
            {driverLocation && order.status === 'on_the_way' && (
              <Marker coordinate={driverLocation} title="Driver">
                <View style={[styles.markerDriver, { backgroundColor: colors.accent }]}>
                  <MaterialIcons name="delivery-dining" size={16} color="#FFFFFF" />
                </View>
              </Marker>
            )}

            {/* Route Line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={colors.text}
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
          </MapView>
          
          {/* Expand Map Button */}
          <Pressable style={[styles.expandButton, { backgroundColor: colors.background }, shadows.card]} onPress={() => setIsMapExpanded(true)}>
            <MaterialIcons name="fullscreen" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
          <Text style={[styles.statusTitle, { color: colors.text }]}>{ORDER_STATUS_LABELS[order.status]}</Text>
          <Text style={[styles.statusSubtitle, { color: colors.mutedText }]}>
            Estimated arrival: {formatTime(order.estimatedDelivery)}
          </Text>

          {/* Progress Steps */}
          <View style={styles.progressSteps}>
            {progressSteps.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <View key={step.status} style={styles.progressStep}>
                  <View
                    style={[
                      styles.progressDot,
                      { backgroundColor: colors.border },
                      isCompleted && { backgroundColor: colors.success },
                      isCurrent && { backgroundColor: colors.accent },
                    ]}>
                    {isCompleted && (
                      <MaterialIcons name="check" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  {index < progressSteps.length - 1 && (
                    <View
                      style={[
                        styles.progressLine, 
                        { backgroundColor: colors.border },
                        isCompleted && { backgroundColor: colors.success }
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>

          <View style={styles.progressLabels}>
            {progressSteps.map((step) => (
              <Text key={step.status} style={[styles.progressLabel, { color: colors.mutedText }]}>
                {step.label}
              </Text>
            ))}
          </View>
        </View>

        <View style={[styles.actionCard, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
          <View style={styles.actionHeader}>
            <MaterialIcons name="qr-code" size={20} color={colors.text} />
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Pickup confirmation</Text>
              <Text style={[styles.actionSubtitle, { color: colors.mutedText }]}>Scan the gurdwara QR code to confirm pickup.</Text>
            </View>
          </View>
          <Pressable
            style={[styles.actionButton, { backgroundColor: pickupConfirmed ? colors.success : colors.accent }]}
            onPress={() => setPickupConfirmed(true)}
          >
            <Text style={styles.actionButtonText}>{pickupConfirmed ? 'Pickup confirmed' : 'Confirm pickup (mock scan)'}</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryActionButton, { borderColor: colors.border }]}
            onPress={() => Alert.alert('Reassign requested', 'Dispatch has been notified (mock). Another Sevadar will be rerouted.')}
          >
            <Text style={[styles.secondaryActionText, { color: colors.text }]}>Report no-show / request reroute</Text>
          </Pressable>
        </View>

        <View style={[styles.actionCard, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
          <View style={styles.actionHeader}>
            <MaterialIcons name="photo-camera" size={20} color={colors.text} />
            <View style={styles.actionText}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Proof of delivery</Text>
              <Text style={[styles.actionSubtitle, { color: colors.mutedText }]}>Take a photo when leaving the meal at the door.</Text>
            </View>
          </View>
          <ProofOfDelivery 
            onPhotoCapture={setProofPhotoUri}
            initialPhoto={proofPhotoUri ?? undefined}
          />
          <Text style={[styles.actionHint, { color: colors.mutedText }]}>We can’t promise restaurant-heat, but every meal is made with love.</Text>
        </View>

        {/* Order Details */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
          <View style={styles.detailsHeader}>
            <MaterialIcons name="storefront" size={20} color={colors.text} />
            <Text style={[styles.detailsStoreName, { color: colors.text }]}>{order.storeName}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.itemsList}>
            {order.items.map((item) => (
              <View key={item.menuItem.id} style={styles.orderItem}>
                <Text style={[styles.orderItemQty, { color: colors.text }]}>{item.quantity}x</Text>
                <Text style={[styles.orderItemName, { color: colors.text }]}>{item.menuItem.name}</Text>
                <Text style={[styles.orderItemPrice, { color: colors.accent }]}>Seva-supported</Text>
              </View>
            ))}
          </View>

        </View>

        {/* Pickup Location */}
        <View style={[styles.addressCard, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="storefront" size={20} color={colors.text} />
          <View style={styles.addressDetails}>
            <Text style={[styles.addressTitle, { color: colors.text }]}>Pickup Location</Text>
            <Text style={[styles.addressText, { color: colors.mutedText }]}>{order.storeLocation.address}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={[styles.addressCard, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="location-on" size={20} color={colors.text} />
          <View style={styles.addressDetails}>
            <Text style={[styles.addressTitle, { color: colors.text }]}>Drop-off Address</Text>
            <Text style={[styles.addressText, { color: colors.mutedText }]}>{order.deliveryLocation.address}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Map Modal */}
      <Modal visible={isMapExpanded} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={[styles.fullscreenMapContainer, { backgroundColor: colors.background }]}>
          <MapView
            style={styles.fullscreenMap}
            provider={PROVIDER_DEFAULT}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: midLat,
              longitude: midLng,
              latitudeDelta: Math.max(latDelta, 0.02),
              longitudeDelta: Math.max(lngDelta, 0.02),
            }}>
            {/* Store Marker */}
            <Marker coordinate={storeLocation} title={order.storeName}>
              <View style={[styles.markerStore, { backgroundColor: colors.accent }]}>
                <MaterialIcons name="storefront" size={16} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Delivery Location Marker */}
            <Marker
              coordinate={{
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
              }}
              title="Delivery Address">
              <View style={[styles.markerDelivery, { backgroundColor: colors.success }]}>
                <MaterialIcons name="home" size={16} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Driver Marker (if on the way) */}
            {driverLocation && order.status === 'on_the_way' && (
              <Marker coordinate={driverLocation} title="Driver">
                <View style={[styles.markerDriver, { backgroundColor: colors.accent }]}>
                  <MaterialIcons name="delivery-dining" size={16} color="#FFFFFF" />
                </View>
              </Marker>
            )}

            {/* Route Line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={colors.text}
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
          </MapView>

          {/* Close Button */}
          <Pressable style={[styles.closeButton, { backgroundColor: colors.background }, shadows.card]} onPress={() => setIsMapExpanded(false)}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </Pressable>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Dark mode map style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0F141A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9CA3AF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#111827' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1F2937' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111827' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B0F14' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1A2330' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1F2937' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  expandButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenMapContainer: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLine: {
    width: 40,
    height: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    width: 50,
    textAlign: 'center',
  },
  actionCard: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    borderRadius: Radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryActionButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionHint: {
    fontSize: 12,
  },
  detailsCard: {
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailsStoreName: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
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
    width: 30,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
  },
  map: {
    flex: 1,
  },
  markerStore: {
    padding: 8,
    borderRadius: 20,
  },
  markerDelivery: {
    padding: 8,
    borderRadius: 20,
  },
  markerDriver: {
    padding: 8,
    borderRadius: 20,
  },
});
