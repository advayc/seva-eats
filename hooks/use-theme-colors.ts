/**
 * Hook that returns the full theme color palette for the current color scheme.
 * Use this hook to get all theme colors at once for styling components.
 */

import { Colors } from '@/constants/theme';
import { useTheme } from '@/context';
import { useColorScheme } from 'react-native';

export type ThemeColors = typeof Colors.light;

export function useThemeColors(): ThemeColors & { isDark: boolean } {
  const { themeMode } = useTheme();
  const systemColorScheme = useColorScheme();
  
  let activeScheme: 'light' | 'dark';
  
  if (themeMode === 'system') {
    activeScheme = systemColorScheme === 'dark' ? 'dark' : 'light';
  } else {
    activeScheme = themeMode;
  }
  
  const colors = Colors[activeScheme];
  
  return {
    ...colors,
    isDark: activeScheme === 'dark',
  };
}
