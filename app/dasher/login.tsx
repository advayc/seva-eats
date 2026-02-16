import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';

export default function DasherLoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;
  const { setRole } = useUser();

  const handleEnterDasher = async () => {
    await setRole('dasher');
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/dasher/dashboard' as any);
  };

  const handleBackToRecipient = async () => {
    await setRole('recipient');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
          <View style={styles.heroText}>
            <Text style={[styles.title, { color: colors.text }]}>Seva Eats</Text>
            <Text style={[styles.tagline, { color: colors.accent }]}>FOOD • COMMUNITY • SERVICE</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }, shadows.card]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBubble, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF4DD' }]}>
              <MaterialIcons name="delivery-dining" size={24} color={colors.accent} />
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Sevadar Delivery</Text>
              <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>Volunteer delivery access</Text>
            </View>
          </View>
          <Text style={[styles.cardBody, { color: colors.mutedText }]}>Use Sevadar Delivery to view available routes, pick up langar from a nearby gurdwara, and complete drop-offs.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={handleEnterDasher}>
            <Text style={styles.primaryText}>Enter Sevadar Delivery</Text>
          </Pressable>
          <Pressable
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.replace('/(onboarding)/choose-role' as any)}
          >
            <Text style={[styles.secondaryText, { color: colors.text }]}>Change role</Text>
          </Pressable>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
  },
  heroText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  tagline: {
    marginTop: Spacing.xs,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBubble: {
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
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFF8F0',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
