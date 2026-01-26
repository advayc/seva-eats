import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/images/logo.svg')} style={styles.logo} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Sewa Eats</Text>
            <Text style={styles.tagline}>FOOD • COMMUNITY • SERVICE</Text>
          </View>
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/intro')}>
          <Text style={styles.primaryText}>Continue</Text>
        </Pressable>
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
    paddingVertical: Spacing.xxxl,
    justifyContent: 'space-between',
  },
  heroRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
  },
  logoWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  titleBlock: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  tagline: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#F97316',
  },
  primaryButton: {
    backgroundColor: Colors.light.text,
    borderRadius: Radii.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: Colors.light.background,
    fontSize: 15,
    fontWeight: '700',
  },
});