/**
 * AnimatedPressable - A reusable pressable component with smooth animations
 * Features:
 * - Scale animation on press (configurable)
 * - Optional opacity effect
 * - Optional haptic feedback
 * - Uses react-native-reanimated for 60fps animations
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Platform, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type AnimatedPressableProps = Omit<PressableProps, 'style'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale factor when pressed (default: 0.97) */
  pressScale?: number;
  /** Whether to trigger haptic feedback on press (default: true on iOS) */
  hapticFeedback?: boolean;
  /** Type of haptic feedback (default: Light) */
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional callback for long press */
  onLongPress?: () => void;
  /** Long press duration in ms (default: 500) */
  longPressDuration?: number;
};

const springConfig = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

export function AnimatedPressable({
  children,
  style,
  pressScale = 0.97,
  hapticFeedback = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
  onPress,
  onLongPress,
  longPressDuration = 500,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    if (hapticFeedback && Platform.OS === 'ios') {
      Haptics.impactAsync(hapticStyle);
    }
  }, [hapticFeedback, hapticStyle]);

  const handlePress = useCallback(() => {
    if (!disabled && onPress) {
      onPress({} as any);
    }
  }, [disabled, onPress]);

  const handleLongPress = useCallback(() => {
    if (!disabled && onLongPress) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onLongPress();
    }
  }, [disabled, onLongPress]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(pressScale, springConfig);
      isPressed.value = true;
      runOnJS(triggerHaptic)();
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, springConfig);
      isPressed.value = false;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const longPressGesture = Gesture.LongPress()
    .enabled(!disabled && !!onLongPress)
    .minDuration(longPressDuration)
    .onStart(() => {
      'worklet';
      runOnJS(handleLongPress)();
    });

  const composedGesture = Gesture.Race(tapGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[style, animatedStyle]} {...props}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * Simple animated pressable that uses the Pressable API directly
 * Good for basic use cases where gesture handler isn't needed
 */
export function SimpleAnimatedPressable({
  children,
  style,
  pressScale = 0.97,
  hapticFeedback = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled = false,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps & { onPressIn?: () => void; onPressOut?: () => void }) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(pressScale, springConfig);
    if (hapticFeedback && Platform.OS === 'ios') {
      runOnJS(Haptics.impactAsync)(hapticStyle);
    }
    if (onPressIn) {
      runOnJS(onPressIn)();
    }
  }, [pressScale, hapticFeedback, hapticStyle, onPressIn, scale]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, springConfig);
    if (onPressOut) {
      runOnJS(onPressOut)();
    }
  }, [onPressOut, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <GestureDetector
        gesture={Gesture.Tap()
          .enabled(!disabled)
          .onBegin(() => {
            'worklet';
            runOnJS(handlePressIn)();
          })
          .onFinalize(() => {
            'worklet';
            runOnJS(handlePressOut)();
          })
          .onEnd(() => {
            'worklet';
            if (onPress && !disabled) {
              runOnJS(onPress)({} as any);
            }
          })}
      >
        <Animated.View {...props}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
