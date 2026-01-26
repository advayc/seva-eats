import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { categories, restaurants, storeSections } from '@/constants/mock-data';
import { useOrders } from '@/context';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

type DeliveryMode = 'Delivery' | 'Pickup' | 'Dine-in';

export default function HomeScreen() {
  const [mode, setMode] = useState<DeliveryMode>('Delivery');
  const visibleCategories = useMemo(() => categories.slice(0, 8), []);
  const router = useRouter();
  const { placeOrder, activeOrder } = useOrders();

  const handleDemoOrder = () => {
    const store = restaurants[0];
    const item = storeSections[0]?.items?.[0];
    if (!store || !item) return;

    const priceCents = Math.round(parseFloat(item.price.replace('$', '')) * 100);
    const order = placeOrder(
      [
        {
          menuItem: {
            id: item.id,
            name: item.name,
            price: priceCents,
            priceDisplay: item.price,
            unit: item.unit,
            image: item.image,
            storeId: store.id,
          },
          quantity: 1,
        },
      ],
      store.id,
      store.name,
      priceCents,
      299
    );

    router.push(`/order/${order.id}` as const);
  };

  const handleViewActiveOrder = () => {
    if (!activeOrder) return;
    router.push(`/order/${activeOrder.id}` as const);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmented}>
          {(['Delivery', 'Pickup', 'Dine-in'] as DeliveryMode[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[styles.segment, mode === item && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === item && styles.segmentTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <Text style={styles.locationText}>Now • London Hall</Text>
            <IconSymbol name="chevron.down" size={18} color={Colors.light.text} />
          </View>
          <View style={styles.iconButton}>
            <IconSymbol name="slider.horizontal.3" size={20} color={Colors.light.text} />
          </View>
        </View>

        <View style={styles.orderCard}>
          <Text style={styles.orderTitle}>
            {activeOrder ? 'Order in progress' : 'Try a demo order'}
          </Text>
          <Text style={styles.orderSubtitle}>
            {activeOrder ? 'Track your delivery in real time' : 'See the map tracking experience'}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, activeOrder ? styles.progressFillActive : null]} />
          </View>
          <Pressable
            style={styles.orderButton}
            onPress={activeOrder ? handleViewActiveOrder : handleDemoOrder}>
            <Text style={styles.orderButtonText}>
              {activeOrder ? 'View order' : 'Start demo order'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Link href="/modal" style={styles.sectionLink}>See all</Link>
        </View>

        <View style={styles.categoryGrid}>
          {visibleCategories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryIconWrap}>
                <MaterialIcons name={category.icon as never} size={26} color={Colors.light.text} />
              </View>
              <Text style={styles.categoryLabel}>{category.name}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Recommended</Text>

        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={{ pathname: '/store/[id]', params: { id: restaurant.id } }}
            asChild>
            <Pressable style={styles.restaurantCard}>
              <View style={styles.restaurantImageWrap}>
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                {restaurant.promo ? (
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoText}>{restaurant.promo}</Text>
                  </View>
                ) : null}
                <View style={styles.favoriteButton}>
                  <IconSymbol name="heart" size={18} color={Colors.light.text} />
                </View>
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantMetaRow}>
                  <Text style={styles.restaurantMeta}>{restaurant.deliveryFee}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.restaurantMeta}>{restaurant.eta}</Text>
                </View>
              </View>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingText}>{restaurant.rating}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 40,
  },
  segmented: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.pill,
    padding: 4,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: Radii.pill,
  },
  segmentActive: {
    backgroundColor: Colors.light.text,
  },
  segmentText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.light.background,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
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
  orderCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  orderSubtitle: {
    fontSize: 13,
    color: Colors.light.mutedText,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 6,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: 6,
    width: '20%',
    backgroundColor: Colors.light.border,
  },
  progressFillActive: {
    width: '45%',
    backgroundColor: Colors.light.success,
  },
  orderButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surfaceElevated,
  },
  orderButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sectionLink: {
    fontSize: 13,
    color: Colors.light.mutedText,
    fontWeight: '600',
  },
  sectionSpacing: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.md,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    gap: 6,
  },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    color: Colors.light.text,
    textAlign: 'center',
  },
  restaurantCard: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...Shadows.card,
  },
  restaurantImageWrap: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 170,
  },
  promoBadge: {
    position: 'absolute',
    left: Spacing.md,
    top: Spacing.md,
    backgroundColor: Colors.light.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  promoText: {
    color: Colors.light.background,
    fontSize: 11,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    backgroundColor: Colors.light.surfaceElevated,
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  restaurantInfo: {
    padding: Spacing.lg,
    paddingRight: 70,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  restaurantMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restaurantMeta: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  dot: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  ratingPill: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.text,
  },
});
