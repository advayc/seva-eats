import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';

const ONBOARDING_KEY = 'onboarding-completed';

export default function IntroScreen() {
  const router = useRouter();

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Image
            source={require('@/assets/images/logo.svg')}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.heroText}>
            <Text style={styles.title}>Sewa Eats</Text>
            <Text style={styles.subtitle}>A shared community delivery network</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Pick up a prepared meal box at the temple.</Text>
          </View>
          <View style={styles.stepRow}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Drop it off at a nearby partner location.</Text>
          </View>
          <Text style={styles.helperText}>Estimated time: 1 minute to get started</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={completeOnboarding}>
            <Text style={styles.primaryText}>Continue to app</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={completeOnboarding}>
            <Text style={styles.secondaryText}>Skip for now</Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          Locations are curated by partner programs. You can update delivery preferences later.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 0.2,
    color: Colors.light.mutedText,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
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
    color: Colors.light.text,
    backgroundColor: '#E5E7EB',
  },
  stepText: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.light.text,
    borderRadius: Radii.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 11,
    alignItems: 'center',
  },
  secondaryText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.light.mutedText,
    textAlign: 'center',
  },
});
