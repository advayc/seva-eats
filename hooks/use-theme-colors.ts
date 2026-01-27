/**
 * Hook that returns the full theme color palette for the current color scheme.
 * Use this hook to get all theme colors at once for styling components.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemeColors = typeof Colors.light;

export function useThemeColors(): ThemeColors & { isDark: boolean } {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];
  
  return {
    ...colors,
    isDark: scheme === 'dark',
  };
}
