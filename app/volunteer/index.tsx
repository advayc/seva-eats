import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Radii, Spacing } from '@/constants/theme';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function VolunteerEntryScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isLoading } = useUser();

  if (!isLoading && user?.role !== 'dasher') {
    router.replace('/(onboarding)/choose-role' as any);
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Volunteer hub</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>Choose how you want to help today</Text>
          </View>
          <Pressable
            style={[styles.switchButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(onboarding)/choose-role' as any)}
          >
            <Text style={[styles.switchText, { color: colors.text }]}>Change role</Text>
          </Pressable>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.cardIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF4DD' }]}>
              <MaterialIcons name="delivery-dining" size={22} color={colors.accent} />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery routes</Text>
              <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>See available deliveries and confirm drop-offs</Text>
            </View>
          </View>
          <Pressable style={[styles.fullButton, { backgroundColor: colors.accent }]} onPress={() => router.push('/dasher/login' as any)}>
            <Text style={styles.fullButtonText}>Open delivery hub</Text>
          </Pressable>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.cardIcon, { backgroundColor: colors.isDark ? 'rgba(5, 150, 105, 0.2)' : '#ECFDF5' }]}>
              <MaterialIcons name="route" size={22} color="#059669" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Dispatcher desk</Text>
              <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>Match volunteers to shelter drop-offs</Text>
            </View>
          </View>
          <Pressable style={[styles.fullButton, { backgroundColor: '#059669' }]} onPress={() => router.push('/dispatcher/dashboard' as any)}>
            <Text style={styles.fullButtonText}>Open dispatcher</Text>
          </Pressable>
        </GlassCard>

        <GlassCard style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.cardIcon, { backgroundColor: colors.isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF' }]}>
              <MaterialIcons name="storefront" size={22} color="#3B82F6" />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Kitchen intake</Text>
              <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>Log meal counts and dietary tags</Text>
            </View>
          </View>
          <Pressable style={[styles.fullButton, { backgroundColor: '#3B82F6' }]} onPress={() => router.push('/kitchen/login' as any)}>
            <Text style={styles.fullButtonText}>Open kitchen</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  switchButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  switchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  fullButton: {
    marginTop: Spacing.md,
    borderRadius: Radii.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  fullButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
