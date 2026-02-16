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
      router.replace('/(onboarding)/intro');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <View style={styles.headerTop}>
          <Animated.View entering={FadeIn.duration(600).delay(100)}>
            <View style={[styles.logoWrap]}> 
              <LogoMark size={150} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.heroText}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>Request a free langar{"\n"}meal near you</Text>
            <Text style={[styles.heroSubtitle, { color: colors.mutedText }]}>Food is shared with dignity. No payment, no paperwork.</Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(500)} style={styles.actions}>
          <Pressable onPress={() => router.push('/request/new') as any} style={[styles.requestButton, { backgroundColor: colors.accent }]}> 
            <Text style={styles.requestText}>Request a Meal</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(onboarding)/intro' as any)} style={styles.learnWrap}>
            <Text style={[styles.learnText, { color: colors.accent }]}>Learn how it works →</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  requestButton: {
    borderRadius: Radii.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: '100%',
  },
  requestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  learnWrap: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  learnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTop: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 2,
  },
  heroText: {
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
  },
  heroSubtitle: {
    marginTop: Spacing.sm,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 320,
  },
  locationCardWrap: {
    marginTop: Spacing.lg,
  },
  locationCard: {
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  pinIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  locationBody: {
    marginTop: Spacing.md,
  },
  nextDelivery: {
    fontSize: 13,
  },
});
