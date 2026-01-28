import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Shadows, Spacing } from '@/constants/theme';
import { useUser } from '@/context';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';

type RoleOption = {
  id: 'recipient' | 'dasher';
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'recipient',
    title: 'Recipient',
    description: 'Request a free meal delivered to a partner shelter or community drop-off.',
    icon: 'restaurant',
  },
  {
    id: 'dasher',
    title: 'Sevadar Delivery',
    description: 'Deliver meals to those in need. Join our network of volunteer drivers.',
    icon: 'volunteer-activism',
  },
];

export default function ChooseRoleScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { setRole } = useUser();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;
  const [isAlreadyOnboarded, setIsAlreadyOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setIsAlreadyOnboarded(value === 'true');
    };
    checkOnboarding();
  }, []);

  const handleSelectRole = async (role: RoleOption['id']) => {
    await setRole(role);
    
    // If already onboarded, navigate based on new role
    if (isAlreadyOnboarded) {
      if (role === 'dasher') {
        router.replace('/dasher/dashboard' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
    } else {
      // First time onboarding
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      // Navigate directly to the appropriate screen based on role
      if (role === 'dasher') {
        router.replace('/dasher/dashboard' as any);
      } else {
        router.replace('/(tabs)');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/images/logo.png')} style={styles.logo} contentFit="contain" />
          </View>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.text }]}>Seva Eats</Text>
            <Text style={[styles.tagline, { color: colors.accent }]}>FOOD • COMMUNITY • SERVICE</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <Text style={[styles.prompt, { color: colors.mutedText }]}>Choose how you want to serve</Text>

        <View style={styles.cardList}>
          {ROLE_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.roleCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                shadows.card,
                pressed && styles.roleCardPressed,
              ]}
              onPress={() => handleSelectRole(option.id)}
            >
              <View style={[styles.roleIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED' }]}>
                <MaterialIcons name={option.icon} size={28} color={colors.accent} />
              </View>
              <View style={styles.roleText}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>{option.title}</Text>
                <Text style={[styles.roleDescription, { color: colors.mutedText }]}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.border} />
            </Pressable>
          ))}
        </View>

        <Text style={[styles.footerNote, { color: colors.mutedText }]}>You can change this later in your profile.</Text>
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
    gap: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logoWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    width: 72,
    height: 72,
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  tagline: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    opacity: 0.9,
  },
  spacer: {
    height: Spacing.lg,
  },
  prompt: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  cardList: {
    gap: Spacing.lg,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  roleCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
    gap: 2,
  },
  roleTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerNote: {
    marginTop: Spacing.xl,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
});
