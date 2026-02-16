import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { availableRequests, distributionLeaderboard, sevadarBadges, sevadarStats } from '@/constants/mock-data';
import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useOrders, useRequests, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function DasherDashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { orders, activeOrder } = useOrders();
  const { user } = useUser();
  const { setVolunteerNameVisibility, activeRequest } = useRequests();
  const [showNameToRecipients, setShowNameToRecipients] = useState(false);

  useEffect(() => {
    if (user?.role !== 'dasher') {
      router.replace('/(onboarding)/choose-role' as any);
    }
  }, [user?.role, router]);

  const handleViewDelivery = (requestId: string) => {
    router.push(`/dasher/delivery/${requestId}` as any);
  };

  const handleToggleNameVisibility = () => {
    const nextValue = !showNameToRecipients;
    setShowNameToRecipients(nextValue);
    if (activeRequest) {
      setVolunteerNameVisibility(activeRequest.id, nextValue);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Sevadar Delivery</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>Pick up and deliver meals with seva</Text>
          </View>
          <Pressable
            style={[styles.switchButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(onboarding)/choose-role' as any)}
          >
            <Text style={[styles.switchText, { color: colors.text }]}>Switch role</Text>
          </Pressable>
        </View>

        {activeOrder && (
          <Pressable
            style={({ pressed }) => [
              styles.activeOrderBanner,
              { backgroundColor: colors.accent },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push(`/order/${activeOrder.id}` as const)}
          >
            <View style={styles.activeOrderLeft}>
              <MaterialIcons name="local-shipping" size={20} color="#FFF8F0" />
              <View style={styles.activeOrderText}>
                <Text style={styles.activeOrderTitle}>Active Delivery</Text>
                <Text style={styles.activeOrderSubtitle}>Tap to see your route</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FFF8F0" />
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Deliveries</Text>
          <Pressable
            style={[styles.nameToggle, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={handleToggleNameVisibility}
          >
            <MaterialIcons name={showNameToRecipients ? 'visibility' : 'visibility-off'} size={16} color={colors.accent} />
            <Text style={[styles.nameToggleText, { color: colors.text }]}>Show name</Text>
          </Pressable>
        </View>

        {availableRequests.map((request) => (
          <Pressable
            key={request.id}
            style={({ pressed }) => [
              pressed && styles.deliveryCardPressed,
            ]}
            onPress={() => handleViewDelivery(request.id)}
          >
            <View style={[styles.deliveryCard, { backgroundColor: colors.surface, borderRadius: Radii.lg }, colors.isDark ? Shadows.dark.card : Shadows.light.card]}>
              <Image source={{ uri: request.pickupLocation.image }} style={styles.deliveryImage} />
              <View style={styles.deliveryContent}>
                <View style={styles.deliveryHeader}>
                  <Text style={[styles.deliveryTitle, { color: colors.text }]}>{request.pickupLocation.name}</Text>
                  <View style={[styles.distanceBadge, { backgroundColor: colors.isDark ? '#064E3B' : '#ECFDF5' }]}>
                    <Text style={[styles.distanceText, { color: '#059669' }]}>{request.distanceFromHome}</Text>
                  </View>
                </View>
                <Text style={[styles.deliveryMeta, { color: colors.mutedText }]}>Drop-off: {request.dropOffLocation.address}</Text>
                <View style={styles.deliveryRow}>
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
            </View>
          </Pressable>
        ))}

        {!orders.length && (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>No deliveries claimed yet. Tap a delivery to begin.</Text>
        )}

        {/* Sevadar Impact */}
        <View style={[styles.impactCard, { backgroundColor: colors.surface, borderRadius: Radii.lg }, colors.isDark ? Shadows.dark.card : Shadows.light.card]}>
          <View style={styles.impactHeader}>
            <View style={[styles.impactIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF4DD' }]}> 
              <MaterialIcons name="workspace-premium" size={22} color={colors.accent} />
            </View>
            <View>
              <Text style={[styles.impactTitle, { color: colors.text }]}>Seva Impact</Text>
              <Text style={[styles.impactSubtitle, { color: colors.mutedText }]}>Families served and food saved</Text>
            </View>
          </View>
          <View style={styles.impactRow}>
            <View style={styles.impactItem}>
              <Text style={[styles.impactValue, { color: colors.text }]}>{sevadarStats.sevaHours} hrs</Text>
              <Text style={[styles.impactLabel, { color: colors.mutedText }]}>Seva Hours</Text>
            </View>
            <View style={[styles.impactDivider, { backgroundColor: colors.border }]} />
            <View style={styles.impactItem}>
              <Text style={[styles.impactValue, { color: colors.text }]}>{sevadarStats.familiesServed}</Text>
              <Text style={[styles.impactLabel, { color: colors.mutedText }]}>Families Served</Text>
            </View>
            <View style={[styles.impactDivider, { backgroundColor: colors.border }]} />
            <View style={styles.impactItem}>
              <Text style={[styles.impactValue, { color: colors.text }]}>{sevadarStats.foodSavedKg} kg</Text>
              <Text style={[styles.impactLabel, { color: colors.mutedText }]}>Food Saved</Text>
            </View>
          </View>
        </View>

        <View style={[styles.badgesCard, { backgroundColor: colors.surface, borderRadius: Radii.lg }, colors.isDark ? Shadows.dark.card : Shadows.light.card]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
          <View style={styles.badgeList}>
            {sevadarBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeRow}>
                <View style={[styles.badgeIconBubble, { backgroundColor: badge.color || colors.accent }]}> 
                  <MaterialIcons name={badge.icon as never} size={20} color="#FFF8F0" />
                </View>
                <View style={styles.badgeContent}>
                  <Text style={[styles.badgeTitle, { color: colors.text }]}>{badge.title}</Text>
                </View>
                <View style={[styles.badgeStatus, { backgroundColor: badge.achieved ? '#DCFCE7' : '#F3F4F6' }]}>
                  <Text style={[styles.badgeStatusText, { color: badge.achieved ? '#166534' : '#6B7280' }]}>
                    {badge.achieved ? 'Achieved' : 'Locked'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.leaderboardCard, { backgroundColor: colors.surface, borderRadius: Radii.lg }, colors.isDark ? Shadows.dark.card : Shadows.light.card]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Leaderboard</Text>
          <View style={styles.leaderboardList}>
            {distributionLeaderboard.map((entry, index) => (
              <View key={entry.id} style={styles.leaderRow}>
                <View style={[styles.leaderRankBubble, { backgroundColor: index < 3 ? '#FEF3C7' : '#F3F4F6' }]}>
                   {index < 3 ? (
                      <MaterialIcons name="emoji-events" size={20} color={index === 0 ? '#D97706' : '#B45309'} />
                   ) : (
                      <Text style={[styles.leaderRankText, { color: colors.mutedText }]}>{index + 1}</Text>
                   )}
                </View>
                
                <View style={styles.leaderInfo}>
                  <Text style={[styles.leaderName, { color: colors.text }]}>{entry.name}</Text>
                  <Text style={[styles.leaderSubtext, { color: colors.mutedText }]}>{entry.drops} drops</Text>
                </View>

                <View style={[styles.leaderStatBadge, { backgroundColor: '#ECFDF5' }]}>
                   <Text style={[styles.leaderStatValue, { color: '#059669' }]}>{entry.sevaHours} hrs</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  switchButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '600',
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
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  activeOrderText: {},
  activeOrderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF8F0',
  },
  activeOrderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,248,240,0.8)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  nameToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  nameToggleText: {
    fontSize: 12,
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
    gap: Spacing.xs,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  deliveryMeta: {
    fontSize: 12,
  },
  deliveryRow: {
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
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    fontSize: 12,
  },
  impactCard: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  impactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  impactSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  impactDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  impactValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  impactLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  badgesCard: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
  },
  badgeList: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  badgeIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContent: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  badgeStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  leaderboardCard: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  leaderboardList: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  leaderRankBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderRankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  leaderInfo: {
    flex: 1,
    gap: 2,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  leaderSubtext: {
    fontSize: 12,
  },
  leaderStatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  leaderStatValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});
