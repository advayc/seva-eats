import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { LiquidGlassButton } from '@/components/liquid-glass-button';
import {
  availableRequests,
  communityStats,
  pickupLocations,
} from '@/constants/mock-data';
import { Radii, Spacing } from '@/constants/theme';
import { useLocation, useOrders, useRequests } from '@/context';
import { REQUEST_STATUS_LABELS } from '@/context/RequestContext';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { placeOrder, activeOrder } = useOrders();
  const { userLocation, refreshLocation, isLoading } = useLocation();
  const { activeRequest } = useRequests();

  const locationLabel = userLocation?.address?.split(',')[0] ?? 'Set location';

  const handleStartDelivery = (requestId: string) => {
    const request = availableRequests.find(r => r.id === requestId);
    if (!request) return;

    const order = placeOrder(
      [
        {
          menuItem: {
            id: 'langar-box',
            name: 'Langar Meal Box',
            price: 0,
            priceDisplay: 'Free',
            unit: 'Serves 1 family',
            image: request.pickupLocation.image,
            storeId: request.pickupLocation.id,
          },
          quantity: request.boxCount,
        },
      ],
      request.pickupLocation.id,
      request.pickupLocation.name,
      0,
      0,
      {
        latitude: request.pickupLocation.location.latitude,
        longitude: request.pickupLocation.location.longitude,
        address: request.pickupLocation.location.address,
      },
      {
        latitude: request.dropOffLocation.location.latitude,
        longitude: request.dropOffLocation.location.longitude,
        address: request.dropOffLocation.address,
      }
    );

    router.push(`/order/${order.id}` as const);
  };

  const handleViewActiveOrder = () => {
    if (!activeOrder) return;
    router.push(`/order/${activeOrder.id}` as const);
  };

  const getDropOffTypeLabel = (type: string) => {
    switch (type) {
      case 'shelter': return 'Shelter';
      case 'food_bank': return 'Food Bank';
      case 'community_center': return 'Community Center';
      case 'family': return 'Family';
      default: return type;
    }
  };

  const handleViewActiveRequest = () => {
    if (!activeRequest) return;
    router.push(`/request/${activeRequest.id}` as any);
  };

  const getRequestIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'search';
      case 'matched': return 'person';
      case 'picked_up': return 'restaurant';
      case 'on_the_way': return 'directions-car';
      default: return 'restaurant';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appTitle, { color: colors.text }]}>Seva Eats</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.locationRow,
                pressed && { opacity: 0.6 }
              ]} 
              onPress={refreshLocation}
            >
              <MaterialIcons name="location-on" size={14} color={colors.mutedText} />
              <Text style={[styles.locationText, { color: colors.mutedText }]}>
                {isLoading ? 'Finding...' : locationLabel}
              </Text>
            </Pressable>
          </View>
          <Pressable 
            style={[styles.iconButton, { backgroundColor: colors.surface }]} 
            onPress={() => router.push('/profile')}
          >
            <MaterialIcons name="person-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {/* Active Delivery Banner */}
        {activeOrder && (
          <Pressable 
            style={({ pressed }) => [
              styles.activeOrderBanner,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }
            ]} 
            onPress={handleViewActiveOrder}
          >
            <View style={styles.activeOrderLeft}>
              <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
              <View style={styles.activeOrderText}>
                <Text style={styles.activeOrderTitle}>Delivery in Progress</Text>
                <Text style={styles.activeOrderSubtitle}>Tap to track your route</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Active Meal Request Banner */}
        {activeRequest && (
          <Pressable style={styles.activeRequestBanner} onPress={handleViewActiveRequest}>
            <View style={styles.activeOrderLeft}>
              <View style={styles.requestIconPulse}>
                <MaterialIcons 
                  name={getRequestIcon(activeRequest.status) as any} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.activeOrderText}>
                <Text style={styles.activeOrderTitle}>
                  {REQUEST_STATUS_LABELS[activeRequest.status]}
                </Text>
                <Text style={styles.activeOrderSubtitle}>
                  {activeRequest.status === 'pending' 
                    ? 'Looking for a volunteer nearby...'
                    : activeRequest.volunteerName 
                      ? `${activeRequest.volunteerName} is on it`
                      : 'Tap to view details'
                  }
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Impact Stats Card */}
        <GlassCard style={styles.statsCard}>
          <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Community Impact</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.mealsDelivered.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Meals</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.familiesServed.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Families</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.activeVolunteers}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Volunteers</Text>
            </View>
          </View>
        </GlassCard>

        {/* Main Action Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>What would you like to do?</Text>

        <LiquidGlassButton
          title="Volunteer to Deliver"
          description="Pick up Langar from a Gurdwara and deliver it to someone in need on your way home"
          icon="volunteer-activism"
          onPress={() => router.push('/(tabs)/explore')}
          variant="default"
        />

        <LiquidGlassButton
          title="Request a Meal"
          description="Need food? Request a free Langar meal to be delivered to your home"
          icon="restaurant"
          onPress={() => router.push('/request/new')}
          variant="default"
        />

        {/* Available Deliveries Preview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Deliveries</Text>
          <Pressable onPress={() => router.push('/(tabs)/explore')}>
            <Text style={[styles.seeAllLink, { color: colors.accent }]}>See all</Text>
          </Pressable>
        </View>

        {availableRequests.slice(0, 2).map((request) => (
          <Pressable 
            key={request.id} 
            style={({ pressed }) => [
              pressed && styles.deliveryCardPressed
            ]}
            onPress={() => handleStartDelivery(request.id)}
          >
            <GlassCard style={styles.deliveryCard} noBorder>
              <Image 
                source={{ uri: request.pickupLocation.image }} 
                style={styles.deliveryImage}
              />
              <View style={styles.deliveryContent}>
                <View style={styles.deliveryHeader}>
                  <Text style={[styles.deliveryTitle, { color: colors.text }]}>{request.pickupLocation.name}</Text>
                  <View style={[styles.distanceBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
                    <Text style={[styles.distanceText, { color: '#059669' }]}>{request.distanceFromHome}</Text>
                  </View>
                </View>
                <View style={styles.deliveryRoute}>
                  <View style={styles.routePoint}>
                    <MaterialIcons name="place" size={14} color={colors.accent} />
                    <Text style={[styles.routeText, { color: colors.mutedText }]}>Pickup: {request.pickupLocation.name}</Text>
                  </View>
                  <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
                  <View style={styles.routePoint}>
                    <MaterialIcons name="home" size={14} color="#059669" />
                    <Text style={[styles.routeText, { color: colors.mutedText }]}>
                      Drop-off: {getDropOffTypeLabel(request.dropOffLocation.type)}
                    </Text>
                  </View>
                </View>
                <View style={styles.deliveryMeta}>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="schedule" size={14} color={colors.mutedText} />
                    <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.estimatedTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MaterialIcons name="inventory-2" size={14} color={colors.mutedText} />
                    <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.boxCount} box{request.boxCount > 1 ? 'es' : ''}</Text>
                  </View>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        ))}

        {/* Nearby Gurdwaras */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Pickup Locations</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gurdwaraScroll}
        >
          {pickupLocations.map((location) => (
            <Pressable 
              key={location.id} 
              style={({ pressed }) => [
                pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }
              ]}
            >
              <GlassCard style={styles.gurdwaraCard} noBorder>
                <Image source={{ uri: location.image }} style={styles.gurdwaraImage} />
                <View style={styles.gurdwaraInfo}>
                  <Text style={[styles.gurdwaraName, { color: colors.text }]} numberOfLines={1}>{location.name}</Text>
                  <Text style={[styles.gurdwaraMeta, { color: colors.accent }]}>{location.boxesAvailable} boxes available</Text>
                  <Text style={[styles.gurdwaraDistance, { color: colors.mutedText }]}>{location.distance}</Text>
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </ScrollView>

        {/* How It Works */}
        <GlassCard style={styles.howItWorksCard}>
          <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How It Works</Text>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Pick Up</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Collect a meal box at your local Gurdwara</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Get Matched</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>We find a recipient 1-2 km from your route home</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Deliver</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Drop off the meal and complete your Seva</Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  activeRequestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#059669',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  requestIconPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  activeOrderText: {},
  activeOrderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeOrderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  deliveryCard: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  deliveryCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  deliveryImage: {
    width: '100%',
    height: 120,
  },
  deliveryContent: {
    padding: Spacing.md,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  distanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deliveryRoute: {
    marginBottom: Spacing.sm,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeLine: {
    width: 1,
    height: 12,
    marginLeft: 7,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 12,
  },
  deliveryMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  gurdwaraScroll: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  gurdwaraCard: {
    width: 160,
    overflow: 'hidden',
  },
  gurdwaraImage: {
    width: '100%',
    height: 90,
  },
  gurdwaraInfo: {
    padding: Spacing.sm,
  },
  gurdwaraName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  gurdwaraMeta: {
    fontSize: 11,
    fontWeight: '500',
  },
  gurdwaraDistance: {
    fontSize: 11,
    marginTop: 2,
  },
  howItWorksCard: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  howItWorksTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stepNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
