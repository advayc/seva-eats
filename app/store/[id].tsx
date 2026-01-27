import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { restaurants, storeSections } from '@/constants/mock-data';
import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useCart, type MenuItem } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

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
  const colors = useThemeColors();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{store?.name ?? 'Store'}</Text>
          <View style={styles.headerRight}>
            <Pressable style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
              <MaterialIcons name="person" size={20} color={colors.text} />
            </Pressable>
            <Pressable style={[styles.iconButton, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]} onPress={() => router.push('/cart')}>
              <MaterialIcons name="shopping-cart" size={20} color={colors.text} />
              {itemCount > 0 && (
                <View style={[styles.cartBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={18} color={colors.mutedText} />
          <Text style={[styles.searchText, { color: colors.mutedText }]}>Search meal boxes and seva items...</Text>
        </View>

        <View style={styles.deliveryRow}>
          <MaterialIcons name="schedule" size={18} color={colors.text} />
          <Text style={[styles.deliveryText, { color: colors.text }]}>Estimated 60 minutes</Text>
        </View>

        <View style={styles.segmentRow}>
          {['Featured', 'Categories', 'Orders'].map((item, index) => (
            <View 
              key={item} 
              style={[
                styles.segment, 
                { backgroundColor: colors.surface },
                index === 0 && { backgroundColor: colors.text }
              ]}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  { color: colors.text },
                  index === 0 && { color: colors.background }
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.promoCard, shadows.card]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1514516870926-205c91a79dbe?q=80&w=1200&auto=format&fit=crop',
            }}
            style={styles.promoImage}
          />
          <View style={[styles.promoOverlay, { backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(17, 24, 39, 0.7)' }]}>
            <Text style={styles.promoText}>Community delivery powered by seva</Text>
          </View>
        </View>

        {storeSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
              <Text style={[styles.sectionLink, { color: colors.mutedText }]}>see all</Text>
            </View>
            <View style={styles.itemRow}>
              {section.items.map((item) => {
                const qty = getItemQuantity(item.id);
                return (
                  <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surfaceElevated }, shadows.card]}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <Pressable
                      style={[
                        styles.addButton, 
                        { backgroundColor: colors.background, borderColor: colors.border },
                        qty > 0 && { backgroundColor: colors.success, borderColor: colors.success }
                      ]}
                      onPress={() => handleAddItem(item)}>
                      <Text 
                        style={[
                          styles.addButtonText, 
                          { color: colors.text },
                          qty > 0 && styles.addButtonTextActive
                        ]}
                      >
                        {qty > 0 ? qty : '+'}
                      </Text>
                    </Pressable>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.itemUnit, { color: colors.mutedText }]}>{item.unit}</Text>
                    <Text style={[styles.itemSeva, { color: colors.accent }]}>Seva-supported</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {itemCount > 0 && (
        <View style={[styles.cartBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <Pressable style={[styles.cartButton, { backgroundColor: colors.text }]} onPress={() => router.push('/cart')}>
            <View style={styles.cartButtonLeft}>
              <View style={[styles.cartButtonBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.cartButtonBadgeText}>{itemCount}</Text>
              </View>
              <Text style={[styles.cartButtonText, { color: colors.background }]}>View Cart</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.background} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.lg,
  },
  searchText: {
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
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  promoCard: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
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
  },
  promoText: {
    color: '#FFFFFF',
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
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemCard: {
    width: '31%',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    position: 'relative',
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemUnit: {
    fontSize: 10,
    marginBottom: 4,
  },
  itemSeva: {
    fontSize: 11,
    fontWeight: '600',
  },
  cartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Radii.md,
    padding: Spacing.lg,
  },
  cartButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButtonBadge: {
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartButtonBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
