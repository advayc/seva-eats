import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { availableRequests } from '@/constants/mock-data';
import { Radii, Spacing } from '@/constants/theme';
import { useOrders, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

type FilterTab = 'available' | 'my_deliveries';

export default function DasherScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { orders, activeOrder } = useOrders();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<FilterTab>('available');

  if (user?.role !== 'dasher') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <MaterialIcons name="lock" size={48} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Volunteer access only</Text>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>
            Switch to the volunteer role to view delivery routes.
          </Text>
          <Pressable
            style={[styles.claimButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.claimButtonText}>Go to profile</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleViewDelivery = (requestId: string) => {
    router.push(`/dasher/delivery/${requestId}` as any);
  };

  const getDropOffTypeIcon = (type: string) => {
    switch (type) {
      case 'shelter': return 'night-shelter';
      case 'food_bank': return 'food-bank';
      case 'community_center': return 'groups';
      case 'family': return 'family-restroom';
      default: return 'place';
    }
  };

  const getDropOffTypeLabel = (type: string) => {
    switch (type) {
      case 'shelter': return 'Shelter';
      case 'food_bank': return 'Food Bank';
      case 'community_center': return 'Community Center';
      case 'family': return 'Family in Need';
      default: return type;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Volunteer deliveries</Text>
        <Text style={[styles.subtitle, { color: colors.mutedText }]}>Pick up langar and deliver to partner shelters</Text>

        {/* Filter Tabs */}
        <GlassCard style={styles.filterTabsCard}>
          <View style={styles.filterTabs}>
            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'available' && [
                  styles.filterTabActive,
                  { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }
                ]
              ]}
              onPress={() => setActiveTab('available')}
            >
              <Text style={[
                styles.filterTabText,
                { color: colors.mutedText },
                activeTab === 'available' && { color: colors.text, fontWeight: '600' }
              ]}>
                Available
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'my_deliveries' && [
                  styles.filterTabActive,
                  { backgroundColor: colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)' }
                ]
              ]}
              onPress={() => setActiveTab('my_deliveries')}
            >
              <Text style={[
                styles.filterTabText,
                { color: colors.mutedText },
                activeTab === 'my_deliveries' && { color: colors.text, fontWeight: '600' }
              ]}>
                My Deliveries
              </Text>
            </Pressable>
          </View>
        </GlassCard>

        {/* Active Order Banner */}
        {activeOrder && activeTab === 'available' && (
          <Pressable 
            style={styles.activeOrderPressable}
            onPress={() => router.push(`/order/${activeOrder.id}` as const)}
          >
            <GlassCard style={styles.activeOrderCard} variant="accent">
              <View style={[styles.activeOrderIcon, { backgroundColor: colors.isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)' }]}>
                <MaterialIcons name="local-shipping" size={24} color={colors.accent} />
              </View>
              <View style={styles.activeOrderContent}>
                <Text style={[styles.activeOrderTitle, { color: colors.text }]}>Delivery in Progress</Text>
                <Text style={[styles.activeOrderSubtitle, { color: colors.mutedText }]}>
                  {activeOrder.storeName} - Tap to track
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
            </GlassCard>
          </Pressable>
        )}

        {activeTab === 'available' && (
          <>
            {/* Available Deliveries */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {availableRequests.length} deliveries available
            </Text>

            {availableRequests.map((request) => (
              <GlassCard key={request.id} style={styles.deliveryCard} noBorder>
                <Image 
                  source={{ uri: request.pickupLocation.image }} 
                  style={styles.deliveryImage}
                />
                
                <View style={styles.deliveryBody}>
                  {/* Pickup Section */}
                  <View style={styles.locationSection}>
                    <View style={styles.locationHeader}>
                      <MaterialIcons name="place" size={18} color={colors.accent} />
                      <Text style={[styles.locationLabel, { color: colors.mutedText }]}>PICKUP</Text>
                    </View>
                    <Text style={[styles.locationName, { color: colors.text }]}>{request.pickupLocation.name}</Text>
                    <Text style={[styles.locationAddress, { color: colors.mutedText }]}>{request.pickupLocation.address}</Text>
                  </View>

                  <View style={styles.routeDivider}>
                    <View style={[styles.routeDot, { backgroundColor: colors.border }]} />
                    <View style={[styles.routeLine, { backgroundColor: colors.border }]} />
                    <View style={[styles.routeDot, { backgroundColor: colors.border }]} />
                  </View>

                  {/* Drop-off Section */}
                  <View style={styles.locationSection}>
                    <View style={styles.locationHeader}>
                      <MaterialIcons 
                        name={getDropOffTypeIcon(request.dropOffLocation.type) as never} 
                        size={18} 
                        color="#059669" 
                      />
                      <Text style={[styles.locationLabel, { color: colors.mutedText }]}>DROP-OFF</Text>
                    </View>
                    <Text style={[styles.locationName, { color: colors.text }]}>
                      {getDropOffTypeLabel(request.dropOffLocation.type)}
                    </Text>
                    <Text style={[styles.locationAddress, { color: colors.mutedText }]}>{request.dropOffLocation.address}</Text>
                    <Text style={[styles.partnerProgram, { color: colors.accent }]}>
                      Partner: {request.dropOffLocation.partnerProgram}
                    </Text>
                  </View>

                  {/* Meta Info */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={16} color={colors.mutedText} />
                      <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.estimatedTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="inventory-2" size={16} color={colors.mutedText} />
                      <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.boxCount} box{request.boxCount > 1 ? 'es' : ''}</Text>
                    </View>
                    <View style={[styles.distanceBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
                      <Text style={[styles.distanceText, { color: colors.success }]}>{request.distanceFromHome} from home</Text>
                    </View>
                  </View>

                  {/* Claim Button */}
                  <Pressable 
                    style={({ pressed }) => [
                      styles.claimButton,
                      { backgroundColor: colors.accent },
                      pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }
                    ]}
                onPress={() => handleViewDelivery(request.id)}
                  >
                    <Text style={styles.claimButtonText}>Claim Delivery</Text>
                  </Pressable>
                </View>
              </GlassCard>
            ))}

            {/* Info Card */}
            <GlassCard style={styles.infoCard}>
              <MaterialIcons name="info-outline" size={20} color={colors.mutedText} />
              <Text style={[styles.infoText, { color: colors.mutedText }]}>
                  Deliveries are matched to nearby partner locations. Update your address in settings to see more relevant options.
              </Text>
            </GlassCard>
          </>
        )}

        {activeTab === 'my_deliveries' && (
          <>
            {orders.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Your delivery history</Text>
                {orders.map((order) => (
                  <Pressable 
                    key={order.id}
                    style={({ pressed }) => [
                      styles.historyPressable,
                      pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                    ]}
                    onPress={() => router.push(`/order/${order.id}` as const)}
                  >
                    <GlassCard style={styles.historyCard}>
                      <View style={styles.historyLeft}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: order.status === 'delivered' ? colors.success : colors.accent }
                        ]} />
                        <View>
                          <Text style={[styles.historyTitle, { color: colors.text }]}>{order.storeName}</Text>
                          <Text style={[styles.historySubtitle, { color: colors.mutedText }]}>
                            {order.status === 'delivered' ? 'Completed' : 'In Progress'} - {
                              order.placedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            }
                          </Text>
                        </View>
                      </View>
                      <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
                    </GlassCard>
                  </Pressable>
                ))}
              </>
            ) : (
              <GlassCard style={styles.emptyState}>
                <MaterialIcons name="delivery-dining" size={48} color={colors.border} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No deliveries yet</Text>
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>
                  Claim a delivery from the Available tab to get started
                </Text>
              </GlassCard>
            )}
          </>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  filterTabsCard: {
    marginBottom: Spacing.lg,
    padding: 4,
  },
  filterTabs: {
    flexDirection: 'row',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radii.sm,
  },
  filterTabActive: {},
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeOrderPressable: {
    marginBottom: Spacing.lg,
  },
  activeOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  activeOrderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  activeOrderContent: {
    flex: 1,
  },
  activeOrderTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  activeOrderSubtitle: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  deliveryCard: {
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  deliveryImage: {
    width: '100%',
    height: 100,
  },
  deliveryBody: {
    padding: Spacing.md,
  },
  locationSection: {
    marginBottom: Spacing.sm,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
  },
  partnerProgram: {
    fontSize: 11,
    marginTop: 4,
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    paddingLeft: 8,
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  routeLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
  },
  distanceBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  claimButton: {
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  historyPressable: {
    marginBottom: Spacing.sm,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  historySubtitle: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
