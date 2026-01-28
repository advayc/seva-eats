import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

import { useUser } from '@/context';

const ONBOARDING_KEY = 'onboarding-completed';

export default function DasherLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useUser();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setHasOnboarded(value === 'true'))
      .catch(() => setHasOnboarded(false));
  }, []);

  useEffect(() => {
    if (isLoading || hasOnboarded === null) return;
    if (!hasOnboarded) {
      router.replace('/(onboarding)/welcome');
      return;
    }

    if (user?.role !== 'dasher') {
      router.replace('/(onboarding)/choose-role' as any);
    }
  }, [hasOnboarded, isLoading, user?.role, router, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
