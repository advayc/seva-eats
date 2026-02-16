import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

const ONBOARDING_KEY = 'onboarding-completed';

export default function LearnMoreScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] }>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>How It Works</Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={[styles.card, { backgroundColor: colors.surface }] }>
            <View style={styles.cardBadge}><Text style={styles.badgeText}>1</Text></View>
            <View style={styles.cardIcon}>
              <MaterialIcons name="restaurant" size={32} color="#F97316" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Choose a meal</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }] }>
            <View style={styles.cardBadge}><Text style={styles.badgeText}>2</Text></View>
            <View style={styles.cardIcon}>
              <MaterialIcons name="pin-drop" size={32} color="#F97316" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Confirm delivery</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }] }>
            <View style={styles.cardBadge}><Text style={styles.badgeText}>3</Text></View>
            <View style={styles.cardIcon}>
              <MaterialIcons name="volunteer-activism" size={32} color="#F97316" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Receive with dignity</Text>
          </View>
        </View>

        <View style={styles.quoteWrap}>
          <Text style={[styles.quote, { color: colors.text }]}>"Food is a human right. This app exists to share, not to judge."</Text>
          <Text style={[styles.quoteSub, { color: colors.mutedText }]}>Built with seva in mind</Text>
        </View>

        <View style={[styles.perksCard, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.15)' : '#FFF7ED' }]}> 
          <View style={styles.perkRow}>
            <View style={[styles.perkIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF3E0' }]}> 
              <MaterialIcons name="volunteer-activism" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.perkText, { color: colors.text }]}>Langar is always free</Text>
          </View>
          <View style={styles.perkRow}>
            <View style={[styles.perkIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF3E0' }]}>
              <MaterialIcons name="directions-car" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.perkText, { color: colors.text }]}>Delivered by local volunteers</Text>
          </View>
          <View style={styles.perkRow}>
            <View style={[styles.perkIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF3E0' }]}>
              <MaterialIcons name="verified" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.perkText, { color: colors.text }]}>No eligibility checks</Text>
          </View>
          <View style={styles.perkRow}>
            <View style={[styles.perkIcon, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF3E0' }]}>
              <MaterialIcons name="lock" size={20} color={colors.accent} />
            </View>
            <Text style={[styles.perkText, { color: colors.text }]}>Privacy respected</Text>
          </View>
        </View>

        <View style={styles.actions}>
           <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={async () => {
             await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
             router.replace('/(tabs)');
           }}>
             <Text style={styles.primaryText}>Get started</Text>
           </Pressable>
          <Pressable style={[styles.secondaryButton, { borderColor: colors.border }]} onPress={() => router.back()}>
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
  headerBlock: { alignItems: 'center', marginBottom: Spacing.lg },
  heroTitle: { fontSize: 28, fontWeight: '800', marginBottom: Spacing.md },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: Spacing.md, letterSpacing: 1, textTransform: 'uppercase' },
  paragraph: { fontSize: 15, lineHeight: 22 },
  actions: { gap: Spacing.md, marginTop: Spacing.lg },
  primaryButton: { borderRadius: Radii.pill, paddingVertical: 13, alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryButton: { borderRadius: Radii.pill, borderWidth: 1, paddingVertical: 11, alignItems: 'center' },
  secondaryText: { fontSize: 13, fontWeight: '600' },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  card: {
    flex: 1,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  cardBadge: {
    position: 'absolute',
    top: -10,
    left: 18,
    backgroundColor: '#FB923C',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeText: { color: '#fff', fontWeight: '700' },
  cardIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#FEF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emoji: { fontSize: 32 },
  cardTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  quoteWrap: { marginTop: Spacing.xl, alignItems: 'center', paddingVertical: Spacing.xl },
  quote: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: Spacing.sm, lineHeight: 30 },
  quoteSub: { fontSize: 14, textAlign: 'center' },
  perksCard: {
    marginTop: Spacing.lg,
    borderRadius: Radii.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  perkIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
