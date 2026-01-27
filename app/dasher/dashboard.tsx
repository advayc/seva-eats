import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { availableRequests } from '@/constants/mock-data';
import { Radii, Spacing } from '@/constants/theme';
import { useOrders, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function DasherDashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { orders, activeOrder } = useOrders();
  const { user, isLoading, setRole } = useUser();

  if (!isLoading && user?.role !== 'dasher') {
    return <Redirect href={'/(onboarding)/choose-role' as any} />;
  }

  const handleViewDelivery = (requestId: string) => {
    router.push(`/dasher/delivery/${requestId}` as any);
  };

  const handleSwitchToRecipient = async () => {
    await setRole('recipient');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Dasher Hub</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>Pick up and deliver meals nearby</Text>
          </View>
          <Pressable
            style={[styles.switchButton, { borderColor: colors.border }]}
            onPress={handleSwitchToRecipient}
          >
            <Text style={[styles.switchText, { color: colors.text }]}>Recipient mode</Text>
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
              <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />
              <View style={styles.activeOrderText}>
                <Text style={styles.activeOrderTitle}>Active Delivery</Text>
                <Text style={styles.activeOrderSubtitle}>Tap to see your route</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
          </Pressable>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Deliveries</Text>

        {availableRequests.map((request) => (
          <Pressable
            key={request.id}
            style={({ pressed }) => [
              pressed && styles.deliveryCardPressed,
            ]}
            onPress={() => handleViewDelivery(request.id)}
          >
            <GlassCard style={styles.deliveryCard} noBorder>
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
            </GlassCard>
          </Pressable>
        ))}

        {!orders.length && (
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>No deliveries claimed yet. Tap a delivery to begin.</Text>
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
    color: '#FFFFFF',
  },
  activeOrderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: Spacing.md,
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
});
