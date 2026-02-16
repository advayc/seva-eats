import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function DispatcherDashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Dispatcher</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>Match volunteers to shelter drop-offs</Text>
          </View>
          <Pressable
            style={[styles.backButton, { borderColor: colors.border }]}
            onPress={() => router.push('/profile')}
          >
            <Text style={[styles.backText, { color: colors.text }]}>Account</Text>
          </Pressable>
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Today’s overview</Text>
          <View style={styles.cardRow}>
            <View style={styles.cardItem}>
              <Text style={[styles.cardValue, { color: colors.text }]}>60</Text>
              <Text style={[styles.cardLabel, { color: colors.mutedText }]}>Meals ready</Text>
            </View>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <View style={styles.cardItem}>
              <Text style={[styles.cardValue, { color: colors.text }]}>18</Text>
              <Text style={[styles.cardLabel, { color: colors.mutedText }]}>Shelter drops</Text>
            </View>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <View style={styles.cardItem}>
              <Text style={[styles.cardValue, { color: colors.text }]}>12</Text>
              <Text style={[styles.cardLabel, { color: colors.mutedText }]}>Volunteers</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Quick actions</Text>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.accent }]}>
            <MaterialIcons name="shuffle" size={18} color="#FFFFFF" />
            <Text style={styles.actionText}>Assign routes</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.replace('/dasher/dashboard' as any)}
          >
            <MaterialIcons name="groups" size={18} color={colors.accent} />
            <Text style={[styles.secondaryText, { color: colors.text }]}>Back to dashboard</Text>
          </Pressable>
        </GlassCard>
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
    paddingBottom: Spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardItem: {
    flex: 1,
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  cardDivider: {
    width: 1,
    height: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radii.pill,
    paddingVertical: 12,
    marginBottom: Spacing.sm,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 12,
    marginTop: Spacing.sm,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
