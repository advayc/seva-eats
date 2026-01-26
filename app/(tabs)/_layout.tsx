import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TAB_BAR_WIDTH = 100;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  const { width: screenWidth } = useWindowDimensions();
  const horizontalMargin = (screenWidth - TAB_BAR_WIDTH) / 2;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarBackground: () => (
          showGlass ? (
            <GlassView
              key="tab-glass"
              style={styles.glassBackground}
              glassEffectStyle="clear"
              tintColor={colorScheme === 'dark' ? '#0B122080' : '#FFFFFF80'}
              isInteractive
            />
          ) : (
            <BlurView
              intensity={70}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={styles.blurBackground}
            />
          )
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            left: horizontalMargin,
            right: horizontalMargin,
            bottom: 35,
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 0,
            borderRadius: 32,
            backgroundColor: 'transparent',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            overflow: 'hidden',
          },
          default: {
            position: 'absolute',
            left: horizontalMargin,
            right: horizontalMargin,
            bottom: 35,
            height: 64,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 0,
            borderRadius: 32,
            backgroundColor: colorScheme === 'dark' ? '#1F2937F5' : '#FFFFFFF5',
            borderWidth: 0.5,
            borderColor: 'rgba(0, 0, 0, 0.08)',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Volunteer',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="volunteer-activism" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});
