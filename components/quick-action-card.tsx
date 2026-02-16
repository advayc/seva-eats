/**
 * QuickActionCard - A reusable card component for quick action buttons
 * Features:
 * - Material icon with colored background circle
 * - Label text below icon
 * - Scale animation on press
 * - Haptic feedback
 * - Follows app design system
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

// Calculate card width for 2-column grid accounting for padding and gap
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = Spacing.lg * 2; // padding on both sides
const gap = Spacing.md;
const cardWidth = (screenWidth - horizontalPadding - gap) / 2;

export type QuickActionCardProps = {
  /** Material icon name */
  icon: keyof typeof MaterialIcons.glyphMap;
  /** Label text displayed below the icon */
  label: string;
  /** Callback when card is pressed */
  onPress: () => void;
  /** Optional testID for testing */
  testID?: string;
};

const springConfig = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

export function QuickActionCard({
  icon,
  label,
  onPress,
  testID,
}: QuickActionCardProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    'worklet';
    scale.value = withSpring(0.95, springConfig);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    'worklet';
    scale.value = withSpring(1, springConfig);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.isDark ? colors.surface : '#FFF8F0',
            borderColor: colors.border,
          },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: colors.isDark
                ? 'rgba(249, 115, 22, 0.15)'
                : 'rgba(249, 115, 22, 0.1)',
            },
          ]}
        >
          <MaterialIcons name={icon} size={24} color="#F97316" />
        </View>
        <Text
          style={[styles.label, { color: colors.text, textAlign: 'center' }]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    minHeight: 120,
    borderRadius: Radii.xl,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
});
