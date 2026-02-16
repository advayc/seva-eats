import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function IntroScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const goToRoleSelection = () => {
    // Keep onboarding focused on recipients — default role is 'recipient'.
    // Navigate into the app; role switching is available from the profile/account menu.
    router.replace('/(tabs)');
  };

  const goToLanding = () => {
    router.replace('/(onboarding)/intro' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.heroText}>
            <Text style={[styles.title, { color: colors.text }]}>Seva Eats</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>A shared community delivery network</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>How it works</Text>
          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: colors.text, backgroundColor: colors.isDark ? colors.surface : '#E5E7EB' }]}>1</Text>
            <Text style={[styles.stepText, { color: colors.text }]}>Pick up a prepared meal box at a nearby distribution hub.</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={[styles.stepNumber, { color: colors.text, backgroundColor: colors.isDark ? colors.surface : '#E5E7EB' }]}>2</Text>
            <Text style={[styles.stepText, { color: colors.text }]}>Drop it off at a nearby shelter or community location.</Text>
          </View>
          <Text style={[styles.helperText, { color: colors.mutedText }]}>Takes about 1 minute to get started</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={goToRoleSelection}>
            <Text style={styles.primaryText}>Choose your role</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={goToLanding}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Go Back</Text>
          </Pressable>
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedText }]}>
          Locations are curated by partner programs. You can update delivery preferences later.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 96,
    height: 96,
  },
  heroText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 22,
    overflow: 'hidden',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    fontSize: 12,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    borderRadius: Radii.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
  },
});
