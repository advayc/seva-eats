import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
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

// AnimatedLogoMark removed for simplified flow

export default function IndexScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isLoading } = useUser();

  useEffect(() => {
    let isMounted = true;

    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!isMounted) return;
        if (value === 'true') {
          if (isLoading) return;
          if (user?.role === 'dasher') {
            router.replace('/dasher/dashboard' as any);
          } else {
            router.replace('/(tabs)');
          }
        } else {
          router.replace('/(onboarding)/welcome');
        }
      } catch {
        if (!isMounted) return;
        router.replace('/(onboarding)/welcome');
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [router, isLoading, user?.role]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.loader}>
        <Animated.View style={styles.loaderContent}>
          <LogoMark size={PLATE_SIZE} />
          <Text style={[styles.loaderTitle, { color: colors.text }]}>Seva Eats</Text>
          <ActivityIndicator color={colors.accent} size="small" style={styles.loaderSpinner} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContent: {
    alignItems: 'center',
    gap: 24,
  },
  loaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  loaderSpinner: {
    marginTop: 8,
  },
});
