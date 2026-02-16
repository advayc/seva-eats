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

  const getRequestMeta = () => {
    if (!activeRequest?.driverNote) return null;
    const lines = activeRequest.driverNote.split('\n');
    const windowLine = lines.find((line) => line.startsWith('Window:'));
    const deliveryLine = lines.find((line) => line.startsWith('Delivery:'));
    return {
      window: windowLine?.replace('Window:', '').trim(),
      delivery: deliveryLine?.replace('Delivery:', '').trim(),
    };
  };

  const requestMeta = getRequestMeta();

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
                {isLoading ? 'Getting location...' : locationLabel}
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

        <GlassCard style={styles.sectionNotice}>
          <View style={[styles.noticeLeft]}> 
            <MaterialIcons name="restaurant" size={20} color={colors.accent} />
          </View>
          <View style={styles.noticeText}>
            <Text style={[styles.noticeTitle, { color: colors.text }]}>Recipient access</Text>
            <Text style={[styles.noticeSubtitle, { color: colors.mutedText }]}>Beta: shelter drop-offs only</Text>
          </View>
        </GlassCard>

        {/* Active Meal Request Banner */}
        {activeRequest && (
          <Pressable style={[styles.activeRequestBanner, { backgroundColor: colors.success }]} onPress={handleViewActiveRequest}>
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

        {activeRequest && (
          <GlassCard style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={[styles.statusTitle, { color: colors.text }]}>Delivery status</Text>
              <Text style={[styles.statusBadge, { color: colors.accent }]}>Live</Text>
            </View>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {REQUEST_STATUS_LABELS[activeRequest.status]}
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Text style={[styles.statusLabel, { color: colors.mutedText }]}>Window</Text>
                <Text style={[styles.statusText, { color: colors.text }]}>{requestMeta?.window ?? 'TBD'}</Text>
              </View>
                <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statusItem}>
                <Text style={[styles.statusLabel, { color: colors.mutedText }]}>Drop-off</Text>
                <Text style={[styles.statusText, { color: colors.text }]}>{requestMeta?.delivery ?? 'TBD'}</Text>
              </View>
            </View>
          </GlassCard>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Start a request</Text>

        <GlassCard
          style={[styles.actionButton, !colors.isDark && { borderColor: colors.border, borderWidth: 1 }]}
        >
          <Pressable
            style={styles.actionButtonPress}
            onPress={() => router.push('/request/new')}
          >
            <MaterialIcons name="restaurant" size={24} color={colors.accent} />
            <View style={styles.actionButtonText}>
              <Text style={[styles.actionButtonTitle, { color: colors.text }]}>Request a shelter drop-off</Text>
              <Text style={[styles.actionButtonDesc, { color: colors.mutedText }]}>Request a free langar meal for a partner shelter or community drop-off</Text>
            </View>
            <MaterialIcons name="arrow-forward" size={20} color={colors.mutedText} />
          </Pressable>
        </GlassCard>

        <GlassCard style={styles.howItWorksCard}>
          <Text style={[styles.howItWorksTitle, { color: colors.text }]}>How it works</Text>

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
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>A volunteer collects meals from a nearby distribution hub</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={[styles.stepNumberWrap, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Drop-off</Text>
              <Text style={[styles.stepDesc, { color: colors.mutedText }]}>Confirm delivery at the shelter</Text>
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
  statusCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusDivider: {
    width: 1,
    height: 28,
  },
  sectionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noticeLeft: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  noticeSubtitle: {
    fontSize: 12,
    marginTop: 2,
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
  actionButton: {
    marginVertical: Spacing.md,
    overflow: 'hidden',
  },
  actionButtonPress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButtonDesc: {
    fontSize: 12,
  },
});
