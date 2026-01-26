import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';

import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { useRequests, REQUEST_STATUS_LABELS, type MealRequestStatus } from '@/context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Progress steps configuration
const PROGRESS_STEPS: { status: MealRequestStatus; icon: string; label: string }[] = [
  { status: 'pending', icon: 'search', label: 'Finding Volunteer' },
  { status: 'matched', icon: 'person-pin', label: 'Volunteer Matched' },
  { status: 'picked_up', icon: 'takeout-dining', label: 'Meal Picked Up' },
  { status: 'on_the_way', icon: 'directions-car', label: 'On the Way' },
  { status: 'delivered', icon: 'check-circle', label: 'Delivered' },
];

function getStepIndex(status: MealRequestStatus): number {
  const index = PROGRESS_STEPS.findIndex((s) => s.status === status);
  return index >= 0 ? index : 0;
}

// Animated pulsing dot for active step
function PulsingDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.pulsingDot, animatedStyle]} />
  );
}

// Progress Step Component
function ProgressStep({
  step,
  index,
  currentIndex,
  isLast,
}: {
  step: typeof PROGRESS_STEPS[0];
  index: number;
  currentIndex: number;
  isLast: boolean;
}) {
  const isCompleted = index < currentIndex;
  const isActive = index === currentIndex;
  const isPending = index > currentIndex;

  return (
    <View style={styles.progressStep}>
      {/* Step Circle */}
      <View style={styles.stepCircleContainer}>
        {isActive && <PulsingDot />}
        <View
          style={[
            styles.stepCircle,
            isCompleted && styles.stepCircleCompleted,
            isActive && styles.stepCircleActive,
          ]}
        >
          <MaterialIcons
            name={isCompleted ? 'check' : (step.icon as any)}
            size={isCompleted ? 16 : 20}
            color={isCompleted || isActive ? '#FFFFFF' : Colors.light.mutedText}
          />
        </View>
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        <Text
          style={[
            styles.stepLabel,
            isCompleted && styles.stepLabelCompleted,
            isActive && styles.stepLabelActive,
          ]}
        >
          {step.label}
        </Text>
        {isActive && (
          <Text style={styles.stepActiveHint}>In progress...</Text>
        )}
      </View>

      {/* Connecting Line */}
      {!isLast && (
        <View style={styles.stepLine}>
          <View
            style={[
              styles.stepLineInner,
              isCompleted && styles.stepLineCompleted,
            ]}
          />
        </View>
      )}
    </View>
  );
}

// Static Map Component
function StaticMapPreview({
  pickupAddress,
  deliveryAddress,
}: {
  pickupAddress?: string;
  deliveryAddress: string;
}) {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={48} color="#E5E7EB" />
        <Text style={styles.mapPlaceholderText}>Route Preview</Text>
      </View>
      <View style={styles.mapOverlay}>
        <View style={styles.mapRoute}>
          <View style={styles.mapRoutePoint}>
            <MaterialIcons name="place" size={16} color={Colors.light.accent} />
            <Text style={styles.mapRouteText} numberOfLines={1}>
              {pickupAddress ?? 'Gurdwara'}
            </Text>
          </View>
          <View style={styles.mapRouteLine} />
          <View style={styles.mapRoutePoint}>
            <MaterialIcons name="home" size={16} color="#059669" />
            <Text style={styles.mapRouteText} numberOfLines={1}>
              {deliveryAddress}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function RequestTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRequest, cancelRequest, requests } = useRequests();

  // Get fresh request data on each render
  const request = requests.find((r) => r.id === id);

  useEffect(() => {
    if (!request) {
      // Request not found - go back
      router.back();
    }
  }, [request, router]);

  if (!request) {
    return null;
  }

  const currentStepIndex = getStepIndex(request.status);
  const isDelivered = request.status === 'delivered';
  const isCancelled = request.status === 'cancelled';

  const handleCancel = () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this meal request?',
      [
        { text: 'No, Keep It', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelRequest(request.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  // Calculate ETA
  const etaText = request.estimatedDelivery
    ? `${request.estimatedDelivery.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`
    : 'Calculating...';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isDelivered ? 'Delivered!' : isCancelled ? 'Cancelled' : 'Tracking'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.statusCard}>
          {isDelivered ? (
            <>
              <View style={styles.deliveredIcon}>
                <MaterialIcons name="check-circle" size={64} color="#059669" />
              </View>
              <Text style={styles.deliveredTitle}>Meal Delivered!</Text>
              <Text style={styles.deliveredSubtitle}>
                Thank you for using Seva Eats. We hope you enjoy your meal!
              </Text>
            </>
          ) : isCancelled ? (
            <>
              <View style={styles.cancelledIcon}>
                <MaterialIcons name="cancel" size={64} color="#DC2626" />
              </View>
              <Text style={styles.cancelledTitle}>Request Cancelled</Text>
              <Text style={styles.cancelledSubtitle}>
                Your meal request has been cancelled.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.statusLabel}>
                {REQUEST_STATUS_LABELS[request.status]}
              </Text>
              <View style={styles.etaRow}>
                <MaterialIcons name="schedule" size={20} color={Colors.light.accent} />
                <Text style={styles.etaText}>
                  Estimated arrival: <Text style={styles.etaBold}>{etaText}</Text>
                </Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Progress Tracker */}
        {!isCancelled && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.progressCard}>
            <Text style={styles.progressTitle}>Delivery Progress</Text>
            {PROGRESS_STEPS.map((step, index) => (
              <ProgressStep
                key={step.status}
                step={step}
                index={index}
                currentIndex={currentStepIndex}
                isLast={index === PROGRESS_STEPS.length - 1}
              />
            ))}
          </Animated.View>
        )}

        {/* Map Preview */}
        {!isDelivered && !isCancelled && (
          <Animated.View entering={FadeInDown.delay(300)}>
            <StaticMapPreview
              pickupAddress={request.gurdwaraName}
              deliveryAddress={request.deliveryAddress.address}
            />
          </Animated.View>
        )}

        {/* Volunteer Info (when matched) */}
        {request.volunteerName && !isDelivered && !isCancelled && (
          <Animated.View entering={FadeInDown.delay(400)} style={styles.volunteerCard}>
            <View style={styles.volunteerAvatar}>
              <MaterialIcons name="person" size={24} color={Colors.light.accent} />
            </View>
            <View style={styles.volunteerInfo}>
              <Text style={styles.volunteerLabel}>Your Volunteer</Text>
              <Text style={styles.volunteerName}>{request.volunteerName}</Text>
            </View>
            <Pressable style={styles.callButton}>
              <MaterialIcons name="phone" size={20} color="#FFFFFF" />
            </Pressable>
          </Animated.View>
        )}

        {/* Request Details */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Request Details</Text>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={18} color={Colors.light.mutedText} />
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{request.recipientName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={18} color={Colors.light.mutedText} />
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{request.recipientPhone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={18} color={Colors.light.mutedText} />
            <Text style={styles.detailLabel}>Delivery to</Text>
            <Text style={styles.detailValue} numberOfLines={2}>
              {request.deliveryAddress.address}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialIcons name="group" size={18} color={Colors.light.mutedText} />
            <Text style={styles.detailLabel}>Family size</Text>
            <Text style={styles.detailValue}>{request.familySize} people</Text>
          </View>
        </Animated.View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        {isDelivered || isCancelled ? (
          <Pressable style={styles.homeButton} onPress={handleGoHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  statusCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: Spacing.sm,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  etaText: {
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  etaBold: {
    fontWeight: '600',
    color: '#1F2937',
  },
  deliveredIcon: {
    marginBottom: Spacing.md,
  },
  deliveredTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: Spacing.sm,
  },
  deliveredSubtitle: {
    fontSize: 14,
    color: Colors.light.mutedText,
    textAlign: 'center',
    lineHeight: 20,
  },
  cancelledIcon: {
    marginBottom: Spacing.md,
  },
  cancelledTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: Spacing.sm,
  },
  cancelledSubtitle: {
    fontSize: 14,
    color: Colors.light.mutedText,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: Spacing.lg,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 60,
  },
  stepCircleContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulsingDot: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.accent,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepCircleCompleted: {
    backgroundColor: '#059669',
  },
  stepCircleActive: {
    backgroundColor: Colors.light.accent,
  },
  stepContent: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingTop: 8,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.mutedText,
  },
  stepLabelCompleted: {
    color: '#059669',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  stepActiveHint: {
    fontSize: 12,
    color: Colors.light.accent,
    marginTop: 2,
  },
  stepLine: {
    position: 'absolute',
    left: 21,
    top: 44,
    bottom: -8,
    width: 2,
  },
  stepLineInner: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
  stepLineCompleted: {
    backgroundColor: '#059669',
  },
  mapContainer: {
    height: 160,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginTop: Spacing.sm,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: Spacing.md,
  },
  mapRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapRoutePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  mapRouteLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: Spacing.sm,
  },
  mapRouteText: {
    fontSize: 11,
    color: Colors.light.mutedText,
    flex: 1,
  },
  volunteerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Shadows.card,
  },
  volunteerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volunteerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  volunteerLabel: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  volunteerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  detailLabel: {
    width: 80,
    fontSize: 13,
    color: Colors.light.mutedText,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  homeButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.light.accent,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
