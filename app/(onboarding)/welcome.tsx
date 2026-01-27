import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/images/logo.svg')} style={styles.logo} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Sewa Eats</Text>
            <Text style={[styles.tagline, { color: colors.accent }]}>{"FOOD\u2009•\u2009COMMUNITY\u2009•\u2009SERVICE"}</Text>
          </View>
        </View>

        <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={() => router.push('/intro')}>
          <Text style={styles.primaryText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxxl,
    justifyContent: 'space-between',
  },
  heroRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleBlock: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  primaryButton: {
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
