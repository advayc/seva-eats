import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/hooks/use-theme-colors';

const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

export function LiquidGlassTabBar() {
  const colors = useThemeColors();
  const isDark = colors.isDark;
  
  // Subtle breathing animation for the glass effect
  const glassOpacity = useSharedValue(1);

  useEffect(() => {
    glassOpacity.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [glassOpacity]);

  const animatedGlassStyle = useAnimatedStyle(() => ({
    opacity: glassOpacity.value,
  }));

  if (showGlass) {
    return (
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedGlassStyle]}>
          <GlassView
            style={StyleSheet.absoluteFill}
            glassEffectStyle="clear"
            tintColor={isDark ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.85)'}
            isInteractive
          />
        </Animated.View>
        {/* Subtle gradient overlay for depth */}
        <View style={[styles.gradientOverlay, {
          backgroundColor: isDark 
            ? 'rgba(15, 23, 42, 0.08)' 
            : 'rgba(255, 255, 255, 0.12)',
        }]} />
      </View>
    );
  }

  return (
    <BlurView
      intensity={80}
      tint={isDark ? 'dark' : 'light'}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});
