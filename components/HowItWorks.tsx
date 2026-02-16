import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function HowItWorks() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>For recipients</Text>
      
      {/* Steps */}
      <View style={styles.stepsWrapper}>
        <View style={styles.stepRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.isDark ? 'rgba(254, 241, 232, 0.06)' : '#FFF7ED' }]}>
            <MaterialIcons name="restaurant" size={16} color="#F97316" />
          </View>
          <Text style={[styles.stepText, { color: colors.text }]}>
            Browse available meals from local restaurants and donors.
          </Text>
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.isDark ? 'rgba(254, 241, 232, 0.06)' : '#FFF7ED' }]}>
            <MaterialIcons name="location-on" size={16} color="#F97316" />
          </View>
          <Text style={[styles.stepText, { color: colors.text }]}>
            Confirm your preferred pickup location and time.
          </Text>
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.isDark ? 'rgba(254, 241, 232, 0.06)' : '#FFF7ED' }]}>
            <MaterialIcons name="volunteer-activism" size={16} color="#F97316" />
          </View>
          <Text style={[styles.stepText, { color: colors.text }]}>
            Receive your meal with dignity and respect.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepsWrapper: {
    marginBottom: Spacing.xl,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  quoteSection: {
    borderLeftWidth: 3,
    borderRadius: Radii.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
    letterSpacing: -0.2,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
});
