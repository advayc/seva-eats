import { Colors } from '@/constants/theme';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useSharedValue(1);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Play Lottie animation, then fade out
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    }, 2200); // Adjust to match animation duration
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.lottieWrapper, animatedStyle]}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/lottie/splash.json')}
          autoPlay
          loop={false}
          style={{ width: 200, height: 200 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
