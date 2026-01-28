import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { restaurants } from '@/constants/mock-data';
import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useCart, useLocation, useOrders } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function CartScreen() {
  const router = useRouter();
  const { items, storeName, subtotal, deliveryFee, updateQuantity, removeItem, clearCart } =
    useCart();
  const { placeOrder } = useOrders();
  const { userLocation, refreshLocation, isLoading } = useLocation();
  const colors = useThemeColors();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    if (!userLocation) {
      await refreshLocation();
    }

    const storeId = items[0].menuItem.storeId;
    const store = restaurants.find((item) => item.id === storeId) ?? restaurants[0];
    const order = placeOrder(
      items,
      storeId,
      storeName ?? store?.name ?? 'Distribution Hub',
      subtotal,
      deliveryFee,
      userLocation ?? {
        latitude: store?.location.latitude ?? 37.7749,
        longitude: store?.location.longitude ?? -122.4194,
        address: 'Current location',
      },
      {
        latitude: store?.location.latitude ?? 37.7749,
        longitude: store?.location.longitude ?? -122.4194,
        address: store?.location.address ?? 'Partner Distribution Hub',
      }
    );
    clearCart();
    router.replace(`/order/${order.id}` as const);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
            <MaterialIcons name="close" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No meal boxes yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedText }]}>Choose a distribution hub to begin</Text>
          <Pressable style={[styles.browseButton, { backgroundColor: colors.accent }]} onPress={() => router.back()}>
            <Text style={styles.browseButtonText}>Explore Hubs</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
          <MaterialIcons name="close" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
        <Pressable onPress={clearCart} style={styles.clearButton}>
          <Text style={[styles.clearButtonText, { color: colors.mutedText }]}>Clear</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.storeInfo}>
          <MaterialIcons name="storefront" size={20} color={colors.text} />
          <Text style={[styles.storeName, { color: colors.text }]}>{storeName}</Text>
        </View>

        <View style={styles.itemsSection}>
          {items.map((cartItem) => (
            <View key={cartItem.menuItem.id} style={[styles.cartItem, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
              <Image source={{ uri: cartItem.menuItem.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.text }]}>{cartItem.menuItem.name}</Text>
                <Text style={[styles.itemUnit, { color: colors.mutedText }]}>{cartItem.menuItem.unit}</Text>
                <Text style={[styles.itemSeva, { color: colors.accent }]}>Seva-supported</Text>
              </View>
              <View style={styles.quantityControls}>
                <Pressable
                  style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                  onPress={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}>
                  <MaterialIcons
                    name={cartItem.quantity === 1 ? 'delete-outline' : 'remove'}
                    size={18}
                    color={colors.text}
                  />
                </Pressable>
                <Text style={[styles.quantityText, { color: colors.text }]}>{cartItem.quantity}</Text>
                <Pressable
                  style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                  onPress={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}>
                  <MaterialIcons name="add" size={18} color={colors.text} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.deliverySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
          <View style={[styles.addressCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="location-on" size={20} color={colors.text} />
            <View style={styles.addressDetails}>
              <Text style={[styles.addressText, { color: colors.text }]}>
                {userLocation?.address ?? 'Enable location to set your drop-off'}
              </Text>
              <Text style={[styles.addressSubtext, { color: colors.mutedText }]}>Gurdwara to community partner drop-off</Text>
            </View>
            <Pressable onPress={refreshLocation} style={[styles.locationButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.locationButtonText, { color: colors.text }]}>
                {isLoading ? 'Updating...' : 'Update'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.summarySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Seva Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>Meal boxes</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.mutedText }]}>Delivery</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>Community drop-off</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.checkoutBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable style={[styles.checkoutButton, { backgroundColor: colors.accent }]} onPress={handlePlaceOrder}>
          <Text style={styles.checkoutButtonText}>Send Seva Request</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 120,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: Spacing.lg,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemsSection: {
    gap: Spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    padding: Spacing.md,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: Radii.sm,
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemSeva: {
    fontSize: 12,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  deliverySection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressSubtext: {
    fontSize: 12,
  },
  locationButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  locationButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summarySection: {
    gap: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
