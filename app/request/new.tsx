import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

import { Colors, Radii, Shadows, Spacing } from '@/constants/theme';
import { mealOptions, type MealOption } from '@/constants/meals';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SelectedMeal = {
  meal: MealOption;
  quantity: number;
};

function MealCard({
  meal,
  selected,
  quantity,
  onPress,
  onIncrement,
  onDecrement,
  index,
}: {
  meal: MealOption;
  selected: boolean;
  quantity: number;
  onPress: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  index: number;
}) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={styles.mealCardWrapper}
    >
      <AnimatedPressable
        style={[
          styles.mealCard,
          selected && styles.mealCardSelected,
          animatedStyle,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: meal.backgroundColor }]}>
          <MaterialIcons
            name={meal.icon as keyof typeof MaterialIcons.glyphMap}
            size={32}
            color={meal.iconColor}
          />
        </View>

        {/* Meal Info */}
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealDescription} numberOfLines={2}>
          {meal.description}
        </Text>
        <Text style={styles.mealServings}>{meal.servings}</Text>

        {/* Selection Badge / Quantity Controls */}
        {selected ? (
          <View style={styles.quantityRow}>
            <Pressable
              style={styles.quantityButton}
              onPress={onDecrement}
              hitSlop={8}
            >
              <MaterialIcons
                name={quantity === 1 ? 'close' : 'remove'}
                size={16}
                color="#FFFFFF"
              />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              style={styles.quantityButton}
              onPress={onIncrement}
              hitSlop={8}
            >
              <MaterialIcons name="add" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.addBadge}>
            <MaterialIcons name="add" size={18} color={Colors.light.accent} />
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function MealSelectionScreen() {
  const router = useRouter();
  const [selectedMeals, setSelectedMeals] = useState<Map<string, SelectedMeal>>(
    new Map()
  );

  const totalMeals = Array.from(selectedMeals.values()).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleSelectMeal = useCallback((meal: MealOption) => {
    setSelectedMeals((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(meal.id)) {
        // Already selected - increment quantity
        const existing = newMap.get(meal.id)!;
        newMap.set(meal.id, { ...existing, quantity: existing.quantity + 1 });
      } else {
        // New selection
        newMap.set(meal.id, { meal, quantity: 1 });
      }
      return newMap;
    });
  }, []);

  const handleIncrement = useCallback((mealId: string) => {
    setSelectedMeals((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(mealId);
      if (existing) {
        newMap.set(mealId, { ...existing, quantity: existing.quantity + 1 });
      }
      return newMap;
    });
  }, []);

  const handleDecrement = useCallback((mealId: string) => {
    setSelectedMeals((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(mealId);
      if (existing) {
        if (existing.quantity <= 1) {
          newMap.delete(mealId);
        } else {
          newMap.set(mealId, { ...existing, quantity: existing.quantity - 1 });
        }
      }
      return newMap;
    });
  }, []);

  const handleContinue = () => {
    // Pass selected meals to next screen via search params
    const mealsParam = Array.from(selectedMeals.entries())
      .map(([id, item]) => `${id}:${item.quantity}`)
      .join(',');
    router.push(`/request/details?meals=${mealsParam}` as any);
  };

  const mainMeals = mealOptions.filter((m) => m.category === 'main');
  const desserts = mealOptions.filter((m) => m.category === 'dessert');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Choose Your Meals</Text>
          <Text style={styles.headerSubtitle}>All meals are 100% free</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Banner */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.infoBanner}>
          <MaterialIcons name="volunteer-activism" size={24} color={Colors.light.accent} />
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>Langar is free for everyone</Text>
            <Text style={styles.infoBannerDesc}>
              A volunteer will pick up your meal from a nearby Gurdwara and deliver it to you
            </Text>
          </View>
        </Animated.View>

        {/* Main Courses */}
        <Text style={styles.sectionTitle}>Main Courses</Text>
        <View style={styles.mealsGrid}>
          {mainMeals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              selected={selectedMeals.has(meal.id)}
              quantity={selectedMeals.get(meal.id)?.quantity ?? 0}
              onPress={() => handleSelectMeal(meal)}
              onIncrement={() => handleIncrement(meal.id)}
              onDecrement={() => handleDecrement(meal.id)}
              index={index}
            />
          ))}
        </View>

        {/* Desserts */}
        <Text style={styles.sectionTitle}>Desserts</Text>
        <View style={styles.mealsGrid}>
          {desserts.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              selected={selectedMeals.has(meal.id)}
              quantity={selectedMeals.get(meal.id)?.quantity ?? 0}
              onPress={() => handleSelectMeal(meal)}
              onIncrement={() => handleIncrement(meal.id)}
              onDecrement={() => handleDecrement(meal.id)}
              index={mainMeals.length + index}
            />
          ))}
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      {totalMeals > 0 && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.bottomBar}
        >
          <View style={styles.bottomBarContent}>
            <View style={styles.mealsSummary}>
              <View style={styles.mealsBadge}>
                <Text style={styles.mealsBadgeText}>{totalMeals}</Text>
              </View>
              <Text style={styles.mealsLabel}>
                {totalMeals === 1 ? 'meal' : 'meals'} selected
              </Text>
            </View>
            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.mutedText,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  infoBannerDesc: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: Spacing.md,
  },
  mealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  mealCardWrapper: {
    width: '47%',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    minHeight: 180,
    ...Shadows.card,
  },
  mealCardSelected: {
    borderColor: Colors.light.accent,
    backgroundColor: '#FFFBEB',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 11,
    color: Colors.light.mutedText,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  mealServings: {
    fontSize: 10,
    color: Colors.light.accent,
    fontWeight: '600',
  },
  addBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  quantityRow: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 20,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
    ...Shadows.floating,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mealsBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealsBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mealsLabel: {
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.accent,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
