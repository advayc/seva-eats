import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';

import { SewaColors } from '@/constants/theme';

const ONBOARDING_KEY = 'onboarding-completed';

export default function IndexScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!isMounted) return;
        if (value === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/splash');
        }
      } catch {
        if (!isMounted) return;
        router.replace('/splash');
      } finally {
        if (isMounted) {
          setReady(true);
        }
      }
    };

    checkOnboarding();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loader}>
        {!ready ? <ActivityIndicator color={SewaColors.primary} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SewaColors.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
