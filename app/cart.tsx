import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCart, useOrders } from '@/context';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartScreen() {
  const router = useRouter();
  const { items, storeName, subtotal, deliveryFee, total, updateQuantity, removeItem, clearCart } =
    useCart();
  const { placeOrder } = useOrders();

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    const storeId = items[0].menuItem.storeId;
    const order = placeOrder(items, storeId, storeName ?? 'Store', subtotal, deliveryFee);
    clearCart();
    router.replace(`/order/${order.id}` as const);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="close" size={20} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={styles.iconButtonPlaceholder} />
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="shopping-cart" size={64} color={Colors.light.border} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add items from a store to get started</Text>
          <Pressable style={styles.browseButton} onPress={() => router.back()}>
            <Text style={styles.browseButtonText}>Browse Stores</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <MaterialIcons name="close" size={20} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Cart</Text>
        <Pressable onPress={clearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.storeInfo}>
          <MaterialIcons name="storefront" size={20} color={Colors.light.text} />
          <Text style={styles.storeName}>{storeName}</Text>
        </View>

        <View style={styles.itemsSection}>
          {items.map((cartItem) => (
            <View key={cartItem.menuItem.id} style={styles.cartItem}>
              <Image source={{ uri: cartItem.menuItem.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{cartItem.menuItem.name}</Text>
                <Text style={styles.itemUnit}>{cartItem.menuItem.unit}</Text>
                <Text style={styles.itemPrice}>{cartItem.menuItem.priceDisplay}</Text>
              </View>
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}>
                  <MaterialIcons
                    name={cartItem.quantity === 1 ? 'delete-outline' : 'remove'}
                    size={18}
                    color={Colors.light.text}
                  />
                </Pressable>
                <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}>
                  <MaterialIcons name="add" size={18} color={Colors.light.text} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <MaterialIcons name="location-on" size={20} color={Colors.light.text} />
            <View style={styles.addressDetails}>
              <Text style={styles.addressText}>123 Main St</Text>
              <Text style={styles.addressSubtext}>San Francisco, CA 94102</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.light.mutedText} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>{formatPrice(deliveryFee)}</Text>
          </View>
          <View style={styles.dividerSmall} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutBar}>
        <Pressable style={styles.checkoutButton} onPress={handlePlaceOrder}>
          <Text style={styles.checkoutButtonText}>Place Order</Text>
          <Text style={styles.checkoutButtonPrice}>{formatPrice(total)}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  iconButtonPlaceholder: {
    width: 36,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: Colors.light.mutedText,
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
    color: Colors.light.text,
  },
  itemsSection: {
    gap: Spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Shadows.card,
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
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
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
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    minWidth: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.lg,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.md,
  },
  deliverySection: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
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
    color: Colors.light.text,
  },
  addressSubtext: {
    fontSize: 12,
    color: Colors.light.mutedText,
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
    color: Colors.light.mutedText,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.light.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.text,
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
  checkoutButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButtonPrice: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '700',
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
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.light.mutedText,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  browseButton: {
    backgroundColor: Colors.light.text,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  browseButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
});
