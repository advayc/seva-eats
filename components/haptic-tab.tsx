import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '@/hooks/use-theme-colors';

const springConfig = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

export function HapticTab(props: BottomTabBarButtonProps) {
  const { isDark } = useThemeColors();
  const scale = useSharedValue(1);
  const bubbleScale = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const isPressed = useSharedValue(0);

  const handlePressIn = (ev: any) => {
    // Trigger haptic feedback on iOS
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Scale down the icon slightly
    scale.value = withSpring(0.85, springConfig);
    
    // Show the bubble indicator
    bubbleScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    bubbleOpacity.value = withTiming(1, { duration: 100 });
    isPressed.value = withTiming(1, { duration: 100 });
    
    props.onPressIn?.(ev);
  };

  const handlePressOut = (ev: any) => {
    // Scale back to normal
    scale.value = withSpring(1, springConfig);
    
    // Fade out the bubble
    bubbleScale.value = withSpring(0.8, springConfig);
    bubbleOpacity.value = withTiming(0, { duration: 200 });
    isPressed.value = withTiming(0, { duration: 200 });
    
    props.onPressOut?.(ev);
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBubbleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isPressed.value,
      [0, 1],
      [
        isDark ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)',
        isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(249, 115, 22, 0.15)',
      ]
    );

    return {
      position: 'absolute' as const,
      top: -4,
      left: -8,
      right: -8,
      bottom: -4,
      borderRadius: 16,
      backgroundColor,
      transform: [{ scale: bubbleScale.value }],
      opacity: bubbleOpacity.value,
    };
  });

  return (
    <Animated.View style={{ position: 'relative' }}>
      {/* Bubble indicator behind the icon */}
      <Animated.View style={animatedBubbleStyle} pointerEvents="none" />
      
      {/* Animated icon container */}
      <Animated.View style={animatedIconStyle}>
        <PlatformPressable
          {...props}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Animated.View>
    </Animated.View>
  );
}
