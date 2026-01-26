import { LandingPage } from '@/components/LandingPage';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function SplashWeb() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <LandingPage onGetStarted={() => router.replace('/welcome')} />
    </View>
  );
}
