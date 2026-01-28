/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#F97316';
const tintColorDark = '#FFFFFF';

// Seva Eats brand colors
export const sevaColors = {
  primary: '#F97316',
  primaryDark: '#EA580C',
  background: '#FFF7ED',
  text: '#111827',
  textSecondary: '#6B7280',
};

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#FFF7ED',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
    surface: '#FFFFFF',
    surfaceElevated: '#FFF4E6',
    border: '#E7D9C8',
    mutedText: '#6B7280',
    success: '#16A34A',
    warning: '#F59E0B',
    accent: '#F97316',
    chip: '#F97316',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0B0F14',
    tint: '#F97316',
    icon: '#A1A7B0',
    tabIconDefault: '#A1A7B0',
    tabIconSelected: '#F97316',
    surface: '#141A22',
    surfaceElevated: '#1A2330',
    border: '#2A3441',
    mutedText: '#A1A7B0',
    success: '#22C55E',
    warning: '#FBBF24',
    accent: '#F97316',
    chip: '#F97316',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const Shadows = {
  light: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
      elevation: 3,
    },
    floating: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 18,
      elevation: 6,
    },
  },
  dark: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 3,
    },
    floating: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 6,
    },
  },
  // Legacy: For backwards compatibility, also export the light shadows at root level
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
