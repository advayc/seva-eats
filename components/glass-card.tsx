import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

type GlassCardProps = ViewProps & {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success';
  intensity?: 'subtle' | 'medium' | 'strong';
  noBorder?: boolean;
};

const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

export function GlassCard({ 
  children, 
  style, 
  variant = 'default',
  intensity = 'medium',
  noBorder = false,
  ...props 
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getTintColor = () => {
    switch (variant) {
      case 'accent':
        return isDark ? '#F9731620' : '#F9731615';
      case 'success':
        return isDark ? '#05966920' : '#05966915';
      default:
        return isDark ? '#1F293780' : '#FFFFFF80';
    }
  };

  const getBlurIntensity = () => {
    switch (intensity) {
      case 'subtle': return 40;
      case 'strong': return 90;
      default: return 60;
    }
  };

  const getFallbackBackground = () => {
    switch (variant) {
      case 'accent':
        return isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255, 247, 237, 0.95)';
      case 'success':
        return isDark ? 'rgba(5, 150, 105, 0.1)' : 'rgba(236, 253, 245, 0.95)';
      default:
        return isDark ? 'rgba(31, 41, 55, 0.85)' : 'rgba(255, 255, 255, 0.85)';
    }
  };

  const borderStyle = noBorder ? {} : {
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
  };

  if (showGlass) {
    return (
      <View 
        style={[
          styles.container, 
          borderStyle,
          style
        ]} 
        {...props}
      >
        <GlassView
          style={styles.glassBackground}
          glassEffectStyle="clear"
          tintColor={getTintColor()}
          isInteractive
        />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Fallback for non-iOS or older iOS versions
  if (Platform.OS === 'ios') {
    return (
      <View 
        style={[
          styles.container, 
          borderStyle,
          style
        ]} 
        {...props}
      >
        <BlurView
          intensity={getBlurIntensity()}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurBackground}
        />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    );
  }

  // Android/other fallback with solid background
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor: getFallbackBackground() },
        borderStyle,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'relative',
  },
});
