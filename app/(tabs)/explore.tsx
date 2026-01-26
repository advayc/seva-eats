import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { availableRequests } from '@/constants/mock-data';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { useOrders } from '@/context';

type FilterTab = 'available' | 'my_deliveries';

export default function VolunteerScreen() {
  const router = useRouter();
  const { orders, activeOrder, placeOrder } = useOrders();
  const [activeTab, setActiveTab] = useState<FilterTab>('available');

  const handleClaimDelivery = (requestId: string) => {
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Volunteer</Text>
        <Text style={styles.subtitle}>Find deliveries near your route home</Text>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <Pressable
            style={[styles.filterTab, activeTab === 'available' && styles.filterTabActive]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.filterTabText, activeTab === 'available' && styles.filterTabTextActive]}>
              Available
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterTab, activeTab === 'my_deliveries' && styles.filterTabActive]}
            onPress={() => setActiveTab('my_deliveries')}
          >
            <Text style={[styles.filterTabText, activeTab === 'my_deliveries' && styles.filterTabTextActive]}>
              My Deliveries
            </Text>
          </Pressable>
        </View>

        {/* Active Order Banner */}
        {activeOrder && activeTab === 'available' && (
          <Pressable 
            style={styles.activeOrderCard}
            onPress={() => router.push(`/order/${activeOrder.id}` as const)}
          >
            <View style={styles.activeOrderIcon}>
              <MaterialIcons name="local-shipping" size={24} color={Colors.light.accent} />
            </View>
            <View style={styles.activeOrderContent}>
              <Text style={styles.activeOrderTitle}>Delivery in Progress</Text>
              <Text style={styles.activeOrderSubtitle}>
                {activeOrder.storeName} - Tap to track
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.mutedText} />
          </Pressable>
        )}

        {activeTab === 'available' && (
          <>
            {/* Available Deliveries */}
            <Text style={styles.sectionTitle}>
              {availableRequests.length} deliveries available
            </Text>

            {availableRequests.map((request) => (
              <View key={request.id} style={styles.deliveryCard}>
                <Image 
                  source={{ uri: request.pickupLocation.image }} 
                  style={styles.deliveryImage}
                />
                
                <View style={styles.deliveryBody}>
                  {/* Pickup Section */}
                  <View style={styles.locationSection}>
                    <View style={styles.locationHeader}>
                      <MaterialIcons name="place" size={18} color={Colors.light.accent} />
                      <Text style={styles.locationLabel}>PICKUP</Text>
                    </View>
                    <Text style={styles.locationName}>{request.pickupLocation.name}</Text>
                    <Text style={styles.locationAddress}>{request.pickupLocation.address}</Text>
                  </View>

                  <View style={styles.routeDivider}>
                    <View style={styles.routeDot} />
                    <View style={styles.routeLine} />
                    <View style={styles.routeDot} />
                  </View>

                  {/* Drop-off Section */}
                  <View style={styles.locationSection}>
                    <View style={styles.locationHeader}>
                      <MaterialIcons 
                        name={getDropOffTypeIcon(request.dropOffLocation.type) as never} 
                        size={18} 
                        color="#059669" 
                      />
                      <Text style={styles.locationLabel}>DROP-OFF</Text>
                    </View>
                    <Text style={styles.locationName}>
                      {getDropOffTypeLabel(request.dropOffLocation.type)}
                    </Text>
                    <Text style={styles.locationAddress}>{request.dropOffLocation.address}</Text>
                    <Text style={styles.partnerProgram}>
                      Partner: {request.dropOffLocation.partnerProgram}
                    </Text>
                  </View>

                  {/* Meta Info */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={16} color={Colors.light.mutedText} />
                      <Text style={styles.metaText}>{request.estimatedTime}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="inventory-2" size={16} color={Colors.light.mutedText} />
                      <Text style={styles.metaText}>{request.boxCount} box{request.boxCount > 1 ? 'es' : ''}</Text>
                    </View>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{request.distanceFromHome} from home</Text>
                    </View>
                  </View>

                  {/* Claim Button */}
                  <Pressable 
                    style={styles.claimButton}
                    onPress={() => handleClaimDelivery(request.id)}
                  >
                    <Text style={styles.claimButtonText}>Claim Delivery</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Info Card */}
            <View style={styles.infoCard}>
              <MaterialIcons name="info-outline" size={20} color={Colors.light.mutedText} />
              <Text style={styles.infoText}>
                Deliveries are matched to locations near your home address. Update your address in settings to see more relevant options.
              </Text>
            </View>
          </>
        )}

        {activeTab === 'my_deliveries' && (
          <>
            {orders.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Your delivery history</Text>
                {orders.map((order) => (
                  <Pressable 
                    key={order.id}
                    style={styles.historyCard}
                    onPress={() => router.push(`/order/${order.id}` as const)}
                  >
                    <View style={styles.historyLeft}>
                      <View style={[
                        styles.statusDot,
                        order.status === 'delivered' ? styles.statusDotComplete : styles.statusDotActive
                      ]} />
                      <View>
                        <Text style={styles.historyTitle}>{order.storeName}</Text>
                        <Text style={styles.historySubtitle}>
                          {order.status === 'delivered' ? 'Completed' : 'In Progress'} - {
                            order.placedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          }
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={Colors.light.mutedText} />
                  </Pressable>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="volunteer-activism" size={48} color="#E5E7EB" />
                <Text style={styles.emptyTitle}>No deliveries yet</Text>
                <Text style={styles.emptyText}>
                  Claim a delivery from the Available tab to start your Seva journey
                </Text>
              </View>
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.mutedText,
    marginBottom: Spacing.lg,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: Radii.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radii.sm,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.mutedText,
  },
  filterTabTextActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  activeOrderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#FDBA74',
  },
  activeOrderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
  },
  activeOrderSubtitle: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: Spacing.md,
  },
  deliveryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    color: Colors.light.mutedText,
    letterSpacing: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
  partnerProgram: {
    fontSize: 11,
    color: Colors.light.accent,
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
    backgroundColor: '#E5E7EB',
  },
  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
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
    color: Colors.light.mutedText,
  },
  distanceBadge: {
    marginLeft: 'auto',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  claimButton: {
    backgroundColor: Colors.light.accent,
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
    backgroundColor: '#F9FAFB',
    borderRadius: Radii.lg,
    padding: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.mutedText,
    lineHeight: 18,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  statusDotComplete: {
    backgroundColor: '#059669',
  },
  statusDotActive: {
    backgroundColor: Colors.light.accent,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  historySubtitle: {
    fontSize: 13,
    color: Colors.light.mutedText,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.mutedText,
    textAlign: 'center',
    lineHeight: 20,
  },
});
