import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { CartProvider, LocationProvider, OrderProvider, RequestProvider, UserProvider } from '@/context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ONBOARDING_KEY = 'onboarding-completed';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        setHasOnboarded(value === 'true');
        setIsReady(true);
      })
      .catch(() => {
        setHasOnboarded(false);
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    if (!isReady || hasOnboarded === null) return;
    const inOnboarding = segments[0] === '(onboarding)';
    if (!hasOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/splash');
    }
  }, [isReady, hasOnboarded, segments, router]);

  if (!isReady) {
    return null;
  }

  return (
    <UserProvider>
      <LocationProvider>
        <CartProvider>
          <OrderProvider>
            <RequestProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="dasher" options={{ headerShown: false }} />
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
            </RequestProvider>
          </OrderProvider>
        </CartProvider>
      </LocationProvider>
    </UserProvider>
  );
}
