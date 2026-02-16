import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
    router.back();
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

        <View style={styles.howItWorksSection}>
          <Text style={[styles.processLabel, { color: '#F97316' }]}>SIMPLE PROCESS</Text>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How It Works</Text>
          <Text style={[styles.sectionDescription, { color: colors.mutedText }]}>Access nutritious meals in three easy steps</Text>

          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepWrapper}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepBadge, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.1)' : '#FEF3E8', borderColor: '#F97316' }]}>
                  <Text style={styles.stepNumber}>01</Text>
                </View>
                <View style={styles.connectorLine} />
              </View>
              <View style={[styles.stepIconContainer, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.15)' : '#FFF4ED' }]}>
                <MaterialIcons name="restaurant" size={20} color="#F97316" />
              </View>
              <View style={styles.stepRight}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Choose Your Meal</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Browse available meals from local donors and restaurants</Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepWrapper}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepBadge, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.1)' : '#FEF3E8', borderColor: '#F97316' }]}>
                  <Text style={styles.stepNumber}>02</Text>
                </View>
                <View style={styles.connectorLine} />
              </View>
              <View style={[styles.stepIconContainer, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.15)' : '#FFF4ED' }]}>
                <MaterialIcons name="location-on" size={20} color="#F97316" />
              </View>
              <View style={styles.stepRight}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Confirm Delivery</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Set your preferred pickup location and time</Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepWrapper}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepBadge, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.1)' : '#FEF3E8', borderColor: '#F97316' }]}>
                  <Text style={styles.stepNumber}>03</Text>
                </View>
              </View>
              <View style={[styles.stepIconContainer, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.15)' : '#FFF4ED' }]}>
                <MaterialIcons name="volunteer-activism" size={20} color="#F97316" />
              </View>
              <View style={styles.stepRight}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>Receive with Dignity</Text>
                <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Get your meal delivered with care and respect</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={goToRoleSelection}>
            <Text style={styles.primaryText}>Enter</Text>
          </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={goToLanding}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Go Back</Text>
          </Pressable>
        </View>
      
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl * 1.5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  heroText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  howItWorksSection: {
    marginBottom: Spacing.xl * 1.5,
  },
  processLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.xl * 1.5,
    textAlign: 'center',
  },
  stepsContainer: {
    paddingHorizontal: Spacing.sm,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl * 1.2,
  },
  stepLeft: {
    alignItems: 'center',
    width: 56,
  },
  stepBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F97316',
    letterSpacing: 0.5,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    minHeight: 50,
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
    marginTop: 6,
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
    marginRight: Spacing.md,
    marginTop: 10,
  },
  stepRight: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.xl,
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
});
