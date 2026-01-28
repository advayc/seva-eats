import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLATE_SIZE = Math.min(SCREEN_WIDTH * 0.4, 160);

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

export default function IndexScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isLoading } = useUser();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasOnboarded(value === 'true');
      } catch {
        setHasOnboarded(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleContinue = () => {
    if (hasOnboarded && !isLoading) {
      if (user?.role === 'dasher') {
        router.replace('/dasher/dashboard' as any);
      } else {
        router.replace('/(tabs)');
      }
    } else {
      router.replace('/(onboarding)/welcome');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Animated.View entering={FadeIn.duration(600).delay(200)}>
            <LogoMark size={PLATE_SIZE} />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Seva Eats</Text>
            <Text style={[styles.tagline, { color: colors.accent }]}>FOOD • COMMUNITY • SERVICE</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(600)} style={styles.actions}>
          <Pressable
            style={[styles.continueButton, { backgroundColor: colors.accent }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'space-between',
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  titleBlock: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  tagline: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  actions: {
    paddingBottom: Spacing.xl,
  },
  continueButton: {
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
