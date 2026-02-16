import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function LearnMoreScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
          <Text style={[styles.title, { color: colors.text }]}>What is Seva Eats?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>A shared delivery network that connects volunteers, community partners, and prepared meals — focused on dignity, speed, and local impact.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>How it works</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>Seva Eats lets community kitchens and partner organizations list prepared meal pickups. Volunteers sign up to pick up and deliver meal boxes to nearby shelters and community sites. The app matches nearby volunteers, provides directions, and tracks deliveries — all while keeping the process fast and secure.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>Why it matters</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>It reduces food waste, increases reach of community meals, and creates a local network of helpers who can respond quickly — no long commitments required.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={() => router.replace('/(onboarding)/choose-role')}>
            <Text style={styles.primaryText}>Get started</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={() => router.replace('/') }>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logo: { width: 140, height: 140, marginBottom: Spacing.md },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, textAlign: 'center' },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: Spacing.md, letterSpacing: 1, textTransform: 'uppercase' },
  paragraph: { fontSize: 15, lineHeight: 22 },
  actions: { gap: Spacing.md, marginTop: Spacing.lg },
  primaryButton: { borderRadius: Radii.pill, paddingVertical: 13, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryButton: { borderRadius: Radii.pill, borderWidth: 1, paddingVertical: 11, alignItems: 'center' },
  secondaryText: { fontSize: 13, fontWeight: '600' },
});
