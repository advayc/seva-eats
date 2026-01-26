import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Sewa Eats</Text>
          <Text style={styles.subtitle}>A shared community delivery network</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <View style={styles.row}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.rowText}>Pick up a prepared meal box at the temple.</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.rowText}>Drop it off at a nearby partner location.</Text>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.mutedText,
  },
  card: {
    backgroundColor: Colors.light.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: 20,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.mutedText,
  },
  rowText: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 14,
    lineHeight: 20,
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
  },
});
