import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { CartProvider, ThemeProvider as CustomThemeProvider, LocationProvider, OrderProvider, RequestProvider, UserProvider } from '@/context';
import { useTheme } from '@/context/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ONBOARDING_KEY = 'onboarding-completed';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  // Determine effective color scheme based on theme mode
  const effectiveColorScheme = themeMode === 'system' ? systemColorScheme : themeMode;

  const refreshOnboarding = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasOnboarded(value === 'true');
    } catch {
      setHasOnboarded(false);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    refreshOnboarding();
  }, [refreshOnboarding]);

  useEffect(() => {
    if (!isReady) return;
    refreshOnboarding();
  }, [segments.join('/'), isReady, refreshOnboarding]);

  useEffect(() => {
    if (!isReady || hasOnboarded === null) return;
    const inOnboarding = segments[0] === '(onboarding)';
    if (!hasOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isReady, hasOnboarded, segments, router]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         <Stack.Screen name="dasher" options={{ headerShown: false }} />
         <Stack.Screen name="dispatcher" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: true, presentation: 'modal', title: 'Categories' }} />
        <Stack.Screen name="store/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: true, presentation: 'modal', title: 'Cart' }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="request/new" options={{ headerShown: false }} />
        <Stack.Screen name="request/details" options={{ headerShown: false }} />
        <Stack.Screen name="request/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <UserProvider>
        <LocationProvider>
          <CartProvider>
            <OrderProvider>
              <RequestProvider>
                <RootLayoutContent />
              </RequestProvider>
            </OrderProvider>
          </CartProvider>
        </LocationProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}
