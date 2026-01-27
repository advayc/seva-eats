import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { LiquidGlassButton } from '@/components/liquid-glass-button';
import { communityStats } from '@/constants/mock-data';
import { Radii, Spacing } from '@/constants/theme';
import { useLocation, useRequests } from '@/context';
import { REQUEST_STATUS_LABELS } from '@/context/RequestContext';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { userLocation, refreshLocation, isLoading } = useLocation();
  const { activeRequest } = useRequests();

  const locationLabel = userLocation?.address?.split(',')[0] ?? 'Set location';

  const handleViewActiveRequest = () => {
    if (!activeRequest) return;
    router.push(`/request/${activeRequest.id}` as any);
  };

  const getRequestIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'search';
      case 'matched': return 'person';
      case 'picked_up': return 'restaurant';
      case 'on_the_way': return 'directions-car';
      case 'delivered': return 'check-circle';
      case 'cancelled': return 'cancel';
      default: return 'restaurant';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appTitle, { color: colors.text }]}>Seva Eats</Text>
            <Pressable 
              style={({ pressed }) => [
                styles.locationRow,
                pressed && { opacity: 0.6 }
              ]} 
              onPress={refreshLocation}
            >
              <MaterialIcons name="location-on" size={14} color={colors.mutedText} />
              <Text style={[styles.locationText, { color: colors.mutedText }]}>
                {isLoading ? 'Finding...' : locationLabel}
              </Text>
            </Pressable>
          </View>
          <View style={styles.headerActions}>
            <Pressable 
              style={[styles.iconButton, { backgroundColor: colors.surface }]} 
              onPress={() => router.push('/profile')}
            >
              <MaterialIcons name="person-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <GlassCard style={styles.segmentCard}>
          <View style={styles.segmentRow}>
            <View style={styles.segmentLeft}>
              <Text style={[styles.segmentTitle, { color: colors.text }]}>Recipient Mode</Text>
              <Text style={[styles.segmentSubtitle, { color: colors.mutedText }]}>Shelter drop-offs only during beta</Text>
            </View>
            <Pressable
              style={[styles.segmentButton, { borderColor: colors.border }]}
              onPress={() => router.push('/role-switch' as any)}
            >
              <Text style={[styles.segmentButtonText, { color: colors.text }]}>Switch</Text>
            </Pressable>
          </View>
        </GlassCard>

        {/* Active Meal Request Banner */}
        {activeRequest && (
          <Pressable style={styles.activeRequestBanner} onPress={handleViewActiveRequest}>
            <View style={styles.activeOrderLeft}>
              <View style={styles.requestIconPulse}>
                <MaterialIcons 
                  name={getRequestIcon(activeRequest.status) as any} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              <View style={styles.activeOrderText}>
                <Text style={styles.activeOrderTitle}>
                  {REQUEST_STATUS_LABELS[activeRequest.status]}
                </Text>
                <Text style={styles.activeOrderSubtitle}>
                  {activeRequest.status === 'pending'
                    ? 'Matching a volunteer...'
                    : activeRequest.showVolunteerName && activeRequest.volunteerName
                      ? `${activeRequest.volunteerName} is on it`
                      : 'Tap to view details'
                  }
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Impact Stats Card */}
        <GlassCard style={styles.statsCard}>
          <Text style={[styles.statsLabel, { color: colors.mutedText }]}>Community Impact</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.mealsDelivered.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Meals</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.familiesServed.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Shelters</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{communityStats.activeVolunteers}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedText }]}>Volunteers</Text>
            </View>
          </View>
        </GlassCard>

        {/* Main Action Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Request a meal</Text>

        <LiquidGlassButton
          title="Request Shelter Drop-off"
          description="Request a free Langar meal for a partner shelter or community drop-off"
          icon="restaurant"
          onPress={() => router.push('/request/new')}
          variant="default"
        />

        <GlassCard style={styles.howItWorksCard}>
          <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How It Works</Text>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Request</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Choose meals and a shelter drop-off window</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Pickup</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>A volunteer collects langar from a nearby gurdwara</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Confirm</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Confirm delivery window at the shelter</Text>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRequestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#059669',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  requestIconPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  activeOrderText: {},
  activeOrderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeOrderSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  segmentCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentLeft: {
    flex: 1,
  },
  segmentTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  segmentSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  segmentButton: {
    borderRadius: Radii.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  seeAllLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  howItWorksCard: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  howItWorksTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  stepNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
