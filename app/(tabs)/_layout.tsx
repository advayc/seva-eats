import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { LiquidGlassTabBar } from '@/components/liquid-glass-tab-bar';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

const TAB_BAR_WIDTH = 100;

export default function TabLayout() {
  const colors = useThemeColors();
  const isDark = colors.isDark;
  const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  const { width: screenWidth } = useWindowDimensions();
  const horizontalMargin = (screenWidth - TAB_BAR_WIDTH) / 2;
  const { user, isLoading } = useUser();

  if (!isLoading && user?.role === 'dasher') {
    return <Redirect href={'/dasher/dashboard' as any} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedText,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarBackground: () => <LiquidGlassTabBar />,
        tabBarStyle: {
          display: 'none',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="home" 
              size={focused ? 26 : 24} 
              color={color} 
            />
          ),
        }}
      />
      {/* Volunteer access is routed separately via Sevadar Delivery */}
    </Tabs>
  );
}
