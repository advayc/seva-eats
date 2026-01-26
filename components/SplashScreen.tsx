import { Colors, Radii, Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 600;
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.3); // Start small
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslate = useSharedValue(20);

  useEffect(() => {
    // Netflix-style: Entire logo expands from small to full size
    logoOpacity.value = withTiming(1, { duration: 1200 });
    logoScale.value = withSequence(
      withTiming(1, { duration: 1200 }), // Slow expansion
      withTiming(1.05, { duration: 300 }), // Subtle bounce bigger
      withTiming(1, { duration: 300 }) // Settle to normal size
    );
    
    // Text fades in after logo starts expanding
    textOpacity.value = withTiming(1, { duration: 800 });
    textTranslate.value = withTiming(0, { duration: 800 });
    
    // Button appears last
    buttonOpacity.value = withTiming(1, { duration: 800 });
    buttonTranslate.value = withTiming(0, { duration: 800 });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslate.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.heroRow, !isWide && styles.heroRowStacked]}>
          <Animated.View style={[styles.logoWrapper, logoStyle]}>
            <Image
              source={require('@/assets/images/logo.svg')}
              style={[styles.logo, !isWide && styles.logoStacked]}
              contentFit="contain"
            />
          </Animated.View>

          <Animated.View style={[styles.titleBlock, textStyle, !isWide && styles.titleBlockStacked]}>
            <Text style={styles.title}>Sewa Eats</Text>
            <Text style={styles.tagline}>{"FOOD\u2009•\u2009COMMUNITY\u2009•\u2009SERVICE"}</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.buttonWrap, buttonStyle]}>
          <Pressable 
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed
            ]} 
            onPress={onFinish}
          >
            <Text style={styles.primaryText}>Get started</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  heroRowStacked: {
    flexDirection: 'column',
    gap: Spacing.lg,
  },
  titleBlock: {
    alignItems: 'flex-start',
  },
  titleBlockStacked: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#F97316',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 280,
  },
  logoStacked: {
    width: 240,
    height: 240,
  },
  buttonWrap: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryText: {
    color: Colors.light.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
