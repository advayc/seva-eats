import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

type LiquidGlassButtonProps = {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  variant?: 'default' | 'accent' | 'success';
};

const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LiquidGlassButton({
  title,
  description,
  icon,
  onPress,
  variant = 'default',
}: LiquidGlassButtonProps) {
  const colors = useThemeColors();
  const isDark = colors.isDark;
  
  const scale = useSharedValue(1);
  const glassScale = useSharedValue(1);

  const getTintColor = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.35)' : 'rgba(249, 115, 22, 0.22)';
      case 'success':
        return isDark ? 'rgba(34, 197, 94, 0.35)' : 'rgba(22, 163, 74, 0.22)';
      default:
        return isDark ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.85)';
    }
  };

  const getBlurIntensity = () => {
    return 80;
  };

  const getFallbackBackground = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.14)' : 'rgba(255, 247, 237, 0.98)';
      case 'success':
        return isDark ? 'rgba(34, 197, 94, 0.14)' : 'rgba(236, 253, 245, 0.98)';
      default:
        return isDark ? colors.surfaceElevated : '#FFFFFF';
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.18)' : '#FFF7ED';
      case 'success':
        return isDark ? 'rgba(34, 197, 94, 0.18)' : '#ECFDF5';
      default:
        return isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFF7ED';
    }
  };

  const getAccentColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'accent':
      default:
        return colors.accent;
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.97, {
      damping: 15,
      stiffness: 300,
    });
    glassScale.value = withTiming(1.02, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    glassScale.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glassAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glassScale.value }],
  }));

  const borderStyle = {
    borderWidth: 1,
    borderColor: colors.border,
  };

  return (
    <AnimatedPressable
      style={[animatedStyle, styles.container]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={[styles.glassContainer, borderStyle]}>
        {showGlass ? (
          <Animated.View style={[styles.glassBackground, glassAnimatedStyle]}>
            <GlassView
              style={StyleSheet.absoluteFill}
              glassEffectStyle="clear"
              tintColor={getTintColor()}
              isInteractive
            />
          </Animated.View>
        ) : Platform.OS === 'ios' ? (
          <BlurView
            intensity={getBlurIntensity()}
            tint={isDark ? 'dark' : 'light'}
            style={styles.blurBackground}
          />
        ) : (
          <View style={[styles.solidBackground, { backgroundColor: getFallbackBackground() }]} />
        )}
        
        <View style={styles.content}>
          <View style={[styles.iconWrap, { backgroundColor: getIconBackgroundColor() }]}>
            <MaterialIcons name={icon} size={28} color={getAccentColor()} />
          </View>
          <View style={styles.textContent}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.description, { color: colors.mutedText }]}>
              {description}
            </Text>
          </View>
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={isDark ? 'rgba(255, 255, 255, 0.5)' : colors.mutedText} 
          />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  glassContainer: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  solidBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    position: 'relative',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
