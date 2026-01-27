import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

export function LiquidGlassTabBar() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
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
            tintColor={isDark ? '#1F293795' : '#FFFFFFA0'}
            isInteractive
          />
        </Animated.View>
        {/* Subtle gradient overlay for depth */}
        <View style={[styles.gradientOverlay, {
          backgroundColor: isDark 
            ? 'rgba(31, 41, 55, 0.05)' 
            : 'rgba(255, 255, 255, 0.1)',
        }]} />
      </View>
    );
  }

  return (
    <BlurView
      intensity={90}
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
