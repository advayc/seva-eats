import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View style={[styles.content]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Sevadar Delivery</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>Deliver meals and serve your community</Text>
          </View>
          <Pressable
            style={[styles.switchButton, { borderColor: colors.border }]}
            onPress={() => router.push('/(onboarding)/choose-role' as any)}
          >
            <Text style={[styles.switchText, { color: colors.text }]}>Change role</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/dasher/login' as any)}
        >
          <MaterialIcons name="delivery-dining" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>Start delivering</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: Spacing.xs,
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    borderRadius: Radii.pill,
    paddingVertical: 14,
    marginTop: Spacing.xl,
  },
  buttonIcon: {
    marginRight: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
