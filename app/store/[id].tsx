import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCart, type MenuItem } from '@/context';
import { restaurants, storeSections } from '@/constants/mock-data';
import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';

function parsePrice(priceStr: string): number {
  // Convert "$0.27" to 27 cents
  const num = parseFloat(priceStr.replace('$', ''));
  return Math.round(num * 100);
}

export default function StoreScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = restaurants.find((item) => item.id === id) ?? restaurants[0];
  const { addItem, itemCount, items } = useCart();

  const handleAddItem = (item: {
    id: string;
    name: string;
    price: string;
    unit: string;
    image: string;
  }) => {
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      priceDisplay: item.price,
      unit: item.unit,
      image: item.image,
      storeId: store.id,
    };
    addItem(menuItem, store.id, store.name);
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((i) => i.menuItem.id === itemId);
    return cartItem?.quantity ?? 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.light.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{store?.name ?? 'Store'}</Text>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconButton}>
              <MaterialIcons name="person" size={20} color={Colors.light.text} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => router.push('/cart')}>
              <MaterialIcons name="shopping-cart" size={20} color={Colors.light.text} />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={18} color={Colors.light.mutedText} />
          <Text style={styles.searchText}>Search stores and products...</Text>
        </View>

        <View style={styles.deliveryRow}>
          <MaterialIcons name="schedule" size={18} color={Colors.light.text} />
          <Text style={styles.deliveryText}>In 60 minutes</Text>
        </View>

        <View style={styles.segmentRow}>
          {['Featured', 'Categories', 'Orders'].map((item, index) => (
            <View key={item} style={[styles.segment, index === 0 && styles.segmentActive]}>
              <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.promoCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1514516870926-205c91a79dbe?q=80&w=1200&auto=format&fit=crop',
            }}
            style={styles.promoImage}
          />
          <View style={styles.promoOverlay}>
            <Text style={styles.promoText}>$0 Delivery Fee with selected products</Text>
          </View>
        </View>

        {storeSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionLink}>see all</Text>
            </View>
            <View style={styles.itemRow}>
              {section.items.map((item) => {
                const qty = getItemQuantity(item.id);
                return (
                  <View key={item.id} style={styles.itemCard}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <Pressable
                      style={[styles.addButton, qty > 0 && styles.addButtonActive]}
                      onPress={() => handleAddItem(item)}>
                      <Text style={[styles.addButtonText, qty > 0 && styles.addButtonTextActive]}>
                        {qty > 0 ? qty : '+'}
                      </Text>
                    </Pressable>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemUnit}>{item.unit}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {itemCount > 0 && (
        <View style={styles.cartBar}>
          <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
            <View style={styles.cartButtonLeft}>
              <View style={styles.cartButtonBadge}>
                <Text style={styles.cartButtonBadgeText}>{itemCount}</Text>
              </View>
              <Text style={styles.cartButtonText}>View Cart</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.light.background} />
          </Pressable>
        </View>
      )}
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
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
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.success,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.light.background,
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.lg,
  },
  searchText: {
    color: Colors.light.mutedText,
    fontSize: 13,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  deliveryText: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '600',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.lg,
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surface,
  },
  segmentActive: {
    backgroundColor: Colors.light.text,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  segmentTextActive: {
    color: Colors.light.background,
  },
  promoCard: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  promoImage: {
    width: '100%',
    height: 140,
  },
  promoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
  },
  promoText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sectionLink: {
    fontSize: 12,
    color: Colors.light.mutedText,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemCard: {
    width: '31%',
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    position: 'relative',
    ...Shadows.card,
  },
  itemImage: {
    width: '100%',
    height: 80,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  addButtonActive: {
    backgroundColor: Colors.light.success,
    borderColor: Colors.light.success,
  },
  addButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '600',
  },
  addButtonTextActive: {
    color: Colors.light.background,
    fontSize: 12,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: 11,
    color: Colors.light.mutedText,
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.text,
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
  cartButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButtonBadge: {
    backgroundColor: Colors.light.success,
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartButtonBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '700',
  },
  cartButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
