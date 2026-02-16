import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { SplashScreen } from '@/components/SplashScreen';

export default function SplashRoute() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <SplashScreen onFinish={() => router.replace('/(onboarding)/intro')} />
    </View>
  );
}
