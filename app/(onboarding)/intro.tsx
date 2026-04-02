import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';

export default function IntroScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          {/* Logo & Title */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={[styles.title, { color: colors.text }]}>Seva Eats</Text>
            <Text style={[styles.subtitle, { color: colors.mutedText }]}>
              Community meal sharing network
            </Text>
          </View>

          {/* How it works */}
          <View style={styles.features}>
            <Feature 
              icon="restaurant"
              title="Request a Meal"
              description="Submit a meal request with your location and preferences"
              colors={colors}
            />
            <Feature 
              icon="local-shipping"
              title="Get Matched"
              description="A volunteer driver picks up and delivers your meal"
              colors={colors}
            />
            <Feature 
              icon="check-circle"
              title="Track Delivery"
              description="Follow your meal in real-time until it arrives"
              colors={colors}
            />
          </View>

          {/* CTA */}
          <Pressable 
            style={[styles.button, { backgroundColor: colors.accent }]} 
            onPress={completeOnboarding}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Feature({ icon, title, description, colors }: { 
  icon: string; 
  title: string; 
  description: string; 
  colors: any;
}) {
  return (
    <View style={styles.feature}>
      <View style={[styles.iconContainer, { backgroundColor: colors.isDark ? 'rgba(251, 146, 60, 0.15)' : '#FFF4ED' }]}>
        <MaterialIcons name={icon as any} size={24} color="#F97316" />
      </View>
      <View style={styles.featureText}>
        <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.featureDesc, { color: colors.mutedText }]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  features: {
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    borderRadius: Radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
