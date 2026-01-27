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
    description: 'Request a Langar meal delivered to a partner shelter or community drop-off.',
    icon: 'restaurant',
  },
  {
    id: 'dasher',
    title: 'Volunteer',
    description: 'Deliver meals or help operate kitchen and dispatch flows.',
    icon: 'volunteer-activism',
  },
];

export default function ChooseRoleScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { setRole } = useUser();
  const shadows = colors.isDark ? Shadows.dark : Shadows.light;

  const handleSelectRole = async (role: RoleOption['id']) => {
    await setRole(role);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');

    if (role === 'recipient') {
      router.replace('/(tabs)');
      return;
    }

    router.replace('/volunteer' as any);
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

        <Text style={[styles.prompt, { color: colors.mutedText }]}>Choose your path</Text>

        <View style={styles.cardList}>
          {ROLE_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.roleCard,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                shadows.card,
                pressed && styles.roleCardPressed,
              ]}
              onPress={() => handleSelectRole(option.id)}
            >
              <View style={[styles.roleIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF4DD' }]}>
                <MaterialIcons name={option.icon} size={24} color={colors.accent} />
              </View>
              <View style={styles.roleText}>
                <Text style={[styles.roleTitle, { color: colors.text }]}>{option.title}</Text>
                <Text style={[styles.roleDescription, { color: colors.mutedText }]}>{option.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.mutedText} />
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
    gap: Spacing.xxl,
  },
  logoWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 78,
    height: 78,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  tagline: {
    marginTop: Spacing.xs,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  prompt: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardList: {
    gap: Spacing.md,
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
    opacity: 0.85,
  },
  roleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    flex: 1,
    gap: 4,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  roleDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  footerNote: {
    fontSize: 12,
    textAlign: 'center',
  },
});
