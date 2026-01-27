import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { LiquidGlassTabBar } from '@/components/liquid-glass-tab-bar';
import { useUser } from '@/context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

const TAB_BAR_WIDTH = 100;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const showGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();
  const { width: screenWidth } = useWindowDimensions();
  const horizontalMargin = (screenWidth - TAB_BAR_WIDTH) / 2;
  const { user, isLoading } = useUser();

  if (!isLoading && user?.role === 'dasher') {
    return <Redirect href={'/volunteer' as any} />;
  }

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
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            left: horizontalMargin,
            right: horizontalMargin,
            bottom: 35,
            height: 68,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 0,
            borderRadius: 34,
            backgroundColor: 'transparent',
            borderWidth: showGlass ? 0.5 : 0,
            borderColor: colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(0, 0, 0, 0.06)',
            shadowColor: colorScheme === 'dark' ? '#000000' : '#F97316',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: showGlass ? 0.25 : 0.15,
            shadowRadius: 32,
            overflow: 'hidden',
          },
          default: {
            position: 'absolute',
            left: horizontalMargin,
            right: horizontalMargin,
            bottom: 35,
            height: 68,
            alignItems: 'center',
            justifyContent: 'center',
            borderTopWidth: 0,
            borderRadius: 34,
            backgroundColor: colorScheme === 'dark' ? '#1F2937F8' : '#FFFFFFF8',
            borderWidth: 1,
            borderColor: colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.08)',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            elevation: 16,
          },
        }),
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
      {/* Volunteer access is routed separately via Dasher Hub */}
    </Tabs>
  );
}
