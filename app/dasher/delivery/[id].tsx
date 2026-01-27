import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { availableRequests } from '@/constants/mock-data';
import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useOrders, useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function DasherDeliveryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const colors = useThemeColors();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;
  const { placeOrder } = useOrders();
  const { user, isLoading } = useUser();

  const requestId = Array.isArray(id) ? id[0] : id;

  if (!isLoading && user?.role !== 'dasher') {
    return <Redirect href={'/(onboarding)/choose-role' as any} />;
  }

  const request = requestId
    ? availableRequests.find((item) => item.id === requestId)
    : undefined;

  const handleClaimDelivery = () => {
    if (!request) return;

    const order = placeOrder(
      [
        {
          menuItem: {
            id: 'langar-box',
            name: 'Langar Meal Box',
            price: 0,
            priceDisplay: 'Free',
            unit: 'Serves 1 person',
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

    router.replace(`/order/${order.id}` as const);
  };

  if (!request) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Delivery not found</Text>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>We could not load this delivery request.</Text>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={() => router.back()}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Delivery Details</Text>
          <View style={styles.backButton} />
        </View>

        <GlassCard style={[styles.card, shadows.card]}>
          <Image source={{ uri: request.pickupLocation.image }} style={styles.cardImage} />
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{request.pickupLocation.name}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>{request.pickupLocation.location.address}</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons name="schedule" size={16} color={colors.mutedText} />
                <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.estimatedTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialIcons name="inventory-2" size={16} color={colors.mutedText} />
                <Text style={[styles.metaText, { color: colors.mutedText }]}>{request.boxCount} boxes</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={[styles.card, shadows.card]}>
          <View style={styles.cardBody}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Drop-off</Text>
            <View style={styles.detailRow}>
              <MaterialIcons name="place" size={18} color={colors.accent} />
              <Text style={[styles.detailText, { color: colors.text }]}>{request.dropOffLocation.address}</Text>
            </View>
            <Text style={[styles.helperText, { color: colors.mutedText }]}>Be respectful. Notes are shared with drivers.</Text>
          </View>
        </GlassCard>

        <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={handleClaimDelivery}>
          <Text style={styles.primaryText}>Claim this delivery</Text>
        </Pressable>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginTop: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    marginTop: Spacing.sm,
  },
  primaryButton: {
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  secondaryButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: Spacing.sm,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
