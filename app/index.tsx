import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

import { Colors, Radii, Spacing } from '@/constants/theme';

const ONBOARDING_KEY = 'onboarding-completed';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLATE_SIZE = Math.min(SCREEN_WIDTH * 0.6, 240);

function LogoMark({ size }: { size: number }) {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={{ width: size, height: size }}
      contentFit="contain"
      accessibilityLabel="Seva Eats logo"
    />
  );
}

function AnimatedLogoMark({
  isAnimating,
  onAnimationComplete,
  size,
}: {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  size: number;
}) {
  const logoScale = useSharedValue(1);
  const logoOpacity = useSharedValue(1);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (!isAnimating) return;

    logoScale.value = withSequence(
      withTiming(1.08, { duration: 160, easing: Easing.out(Easing.quad) }),
      withTiming(6, { duration: 420, easing: Easing.out(Easing.cubic) })
    );

    logoOpacity.value = withDelay(220, withTiming(0, { duration: 220 }));

    overlayOpacity.value = withDelay(
      360,
      withSequence(
        withTiming(1, { duration: 160 }),
        withTiming(1, { duration: 120 }, () => {
          runOnJS(onAnimationComplete)();
        })
      )
    );
  }, [isAnimating, logoScale, logoOpacity, overlayOpacity, onAnimationComplete]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View style={[styles.plateContainer, { width: size, height: size }]}>
      <Animated.View style={[logoStyle, { width: size, height: size }]}> 
        <LogoMark size={size} />
      </Animated.View>
      <Animated.View style={[styles.overlay, overlayStyle]} />
    </View>
  );
}

export default function IndexScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const contentOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;

    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!isMounted) return;
        if (value === 'true') {
          setShowLanding(true);
          setLoading(false);
          // Staggered fade in
          titleOpacity.value = withTiming(1, { duration: 400 });
          contentOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
          buttonOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
        } else {
          router.replace('/splash');
        }
      } catch {
        if (!isMounted) return;
        router.replace('/splash');
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleEnterApp = () => {
    // Start the burst transition
    setIsTransitioning(true);
    // Hide button immediately
    buttonOpacity.value = withTiming(0, { duration: 150 });
    titleOpacity.value = withTiming(0, { duration: 200 });
  };

  const handleAnimationComplete = () => {
    router.replace('/(tabs)');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          {/* Branded loading screen */}
          <Animated.View style={styles.loaderContent}>
            <LogoMark size={PLATE_SIZE} />
            <Text style={styles.loaderTitle}>Seva Eats</Text>
            <ActivityIndicator color={Colors.light.accent} size="small" style={styles.loaderSpinner} />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  if (showLanding) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.landingContent}>
          {/* Main content - centered */}
          <View style={styles.centerSection}>
            <Animated.View style={titleStyle}>
              <Text style={styles.title}>Seva Eats</Text>
              <Text style={styles.tagline}>FOOD   •   COMMUNITY   •   SERVICE</Text>
            </Animated.View>
            
            <Animated.View style={[styles.illustrationWrap, { width: PLATE_SIZE, height: PLATE_SIZE }, contentStyle]}>
              {isTransitioning ? (
                <AnimatedLogoMark
                  isAnimating={isTransitioning}
                  onAnimationComplete={handleAnimationComplete}
                  size={PLATE_SIZE}
                />
              ) : (
                <LogoMark size={PLATE_SIZE} />
              )}
            </Animated.View>
          </View>

          {/* Button at bottom */}
          <Animated.View style={[styles.buttonSection, buttonStyle]}>
            <Pressable 
              style={styles.enterButton} 
              onPress={handleEnterApp}
              disabled={isTransitioning}
            >
              <Text style={styles.enterButtonText}>Get Started</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landingContent: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 10,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
    color: '#F97316',
    textAlign: 'center',
  },
  illustrationWrap: {
    marginTop: 48,
  },
  plateContainer: {
    position: 'relative',
  },
  absoluteCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT * 3,
    backgroundColor: '#FFFFFF',
  },
  buttonSection: {
    paddingHorizontal: Spacing.md,
  },
  enterButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: Radii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContent: {
    alignItems: 'center',
    gap: 24,
  },
  loaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  loaderSpinner: {
    marginTop: 8,
  },
});
