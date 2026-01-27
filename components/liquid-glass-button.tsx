import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const scale = useSharedValue(1);
  const glassScale = useSharedValue(1);

  const getTintColor = () => {
    switch (variant) {
      case 'accent':
        return isDark ? '#F9731640' : '#F9731630';
      case 'success':
        return isDark ? '#05966940' : '#05966930';
      default:
        return isDark ? '#1F293790' : '#FFFFFF90';
    }
  };

  const getBlurIntensity = () => {
    return 80;
  };

  const getFallbackBackground = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 247, 237, 0.98)';
      case 'success':
        return isDark ? 'rgba(5, 150, 105, 0.15)' : 'rgba(236, 253, 245, 0.98)';
      default:
        return isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    }
  };

  const getIconBackgroundColor = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED';
      case 'success':
        return isDark ? 'rgba(5, 150, 105, 0.2)' : '#ECFDF5';
      default:
        return isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFF7ED';
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
    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
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
            <MaterialIcons name={icon} size={28} color={Colors.light.accent} />
          </View>
          <View style={styles.textContent}>
            <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
            <Text style={[styles.description, isDark && styles.descriptionDark]}>
              {description}
            </Text>
          </View>
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color={isDark ? 'rgba(255, 255, 255, 0.4)' : Colors.light.mutedText} 
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
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  titleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    color: Colors.light.mutedText,
    lineHeight: 18,
  },
  descriptionDark: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
